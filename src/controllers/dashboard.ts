import { Request, Response } from 'express';
import Joi from 'joi';
import db from '../models';



export default {
  async storeSummary(req: Request, res: Response): Promise<any> {
    const { storeId, startDate, endDate } = req.query;
    const UserId = req.decodedToken?.id;

    try {
      // Total Quantities by Store
      const totalQuantities = await db.item.sum('quantity', {
        include: [
          {
            model: db.product,
            attributes: [],
            where: {
              StoreId: storeId,
            },
          },
        ],
        where: {
          createdAt: {
            [db.Sequelize.Op.between]: [startDate, endDate],
          },
        },
      });

      // Stock Worth
      const stockWorth = await db.item.findAll({
        attributes: [
          [db.sequelize.literal('SUM(quantity * unitPrice)'), 'stockWorth'],
        ],
        include: [
          {
            model: db.product,
            attributes: [],
            where: {
              StoreId: storeId,
            },
          },
        ],
        where: {
          createdAt: {
            [db.Sequelize.Op.between]: [startDate, endDate],
          },
        },
        raw: true,
      });

      // Invoice Returns
      const invoiceReturns = await db.invoice.sum('amount_paid', {
        where: {
          UserId,
          createdAt: {
            [db.Sequelize.Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        storeId,
        UserId,
        totalQuantities,
        stockWorth: stockWorth[0]?.stockWorth || 0, // Handle null case
        invoiceReturns,
      });
    } catch (error) {
      console.error('Error fetching store summary:', error);
      res.status(500).json({ error: 'Unable to fetch store summary' });
    }
  },

  async invoiceSummary(req: Request, res: Response): Promise<any> {
    const { startDate, endDate, groupBy } = req.query;

    try {
      let groupAttributes: ([string, string] | string)[];
      let groupOrder: [string, 'ASC' | 'DESC'][];

      if (groupBy === 'day') {
        groupAttributes = [
          [db.sequelize.fn('DAY', db.sequelize.col('date')), 'day'] as [string, string],
          [db.sequelize.fn('MONTH', db.sequelize.col('date')), 'month'] as [string, string],
          [db.sequelize.fn('YEAR', db.sequelize.col('date')), 'year'] as [string, string],
        ];
        groupOrder = [
          [db.sequelize.fn('YEAR', db.sequelize.col('date')), 'ASC'],
          [db.sequelize.fn('MONTH', db.sequelize.col('date')), 'ASC'],
          [db.sequelize.fn('DAY', db.sequelize.col('date')), 'ASC'],
        ];
      } else {
        groupAttributes = [
          [db.sequelize.fn('MONTH', db.sequelize.col('date')), 'month'] as [string, string],
          [db.sequelize.fn('YEAR', db.sequelize.col('date')), 'year'] as [string, string],
        ];
        groupOrder = [
          [db.sequelize.fn('YEAR', db.sequelize.col('date')), 'ASC'],
          [db.sequelize.fn('MONTH', db.sequelize.col('date')), 'ASC'],
        ];
      }

      const summary = await db.invoice.findAll({
        attributes: [
          ...groupAttributes,
          [db.sequelize.fn('SUM', db.sequelize.col('amount_paid')), 'totalAmountPaid'],
          [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'totalInvoiceAmount'],
          [db.sequelize.fn('SUM', db.sequelize.col('total_items')), 'totalItemsSold'],
        ],
        where: {
          date: {
            [db.Sequelize.Op.between]: [startDate, endDate],
          },
        },
        group: groupAttributes.map(attr => attr[1]),
        order: groupOrder,
        raw: true,
      });

      res.status(200).json({ groupBy, summary });
    } catch (error) {
      console.error('Error fetching invoice summary:', error);
      res.status(500).json({ error: 'Unable to fetch invoice summary' });
    }
  }
};
