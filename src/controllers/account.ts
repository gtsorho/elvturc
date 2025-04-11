import { Request, Response } from 'express';
import Joi from 'joi';
import db from '../models';
import { where } from 'sequelize';

const schema = {
  create: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    openingBalance: Joi.number().required(),
    active: Joi.boolean().default(true)
  }),

  update: Joi.object({
    // id: Joi.number().required(),
    title: Joi.string(),
    description: Joi.string(),
    openingBalance: Joi.number(),
    active: Joi.boolean()
  })
};

export default {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const { error, value } = schema.create.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      // If creating an active account, deactivate others first
      if (value.active === true) {
        await db.account.update({ active: false }, { where: {} });
      }

      const account = await db.account.create(value);
      res.status(201).json(account);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  async update(req: Request, res: Response): Promise<any> {
    try {
      const { error, value } = schema.update.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const account = await db.account.findByPk(req.params.id);
      if (!account) return res.status(404).json({ error: 'Account not found' });

      // If setting this account as active, deactivate others
      if (value.active === true) {
        await db.account.update({ active: false }, {
          where: { id: { [db.Sequelize.Op.ne]: req.params.id } }
        });
      }

      await account.update(value);
      res.status(200).json(account);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const accounts = await db.account.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(accounts);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  async active(req: Request, res: Response): Promise<any> {
    try {
      const accounts = await db.account.findOne({
       where: { active: true },
      });
      const lastTransaction = await db.transaction.findOne({
        order: [['createdAt', 'DESC']],
      });
      res.status(200).json({active:accounts, balance:lastTransaction.balance ?? accounts.openingBalance});
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  async getOne(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const account = await db.account.findByPk(id);
      if (!account) return res.status(404).json({ error: 'Account not found' });

      res.status(200).json(account);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  }
};
