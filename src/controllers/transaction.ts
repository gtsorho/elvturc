import { Request, Response } from 'express';
import Joi from 'joi';
import { Op, where } from 'sequelize';
import db from '../models';
import {  sendSMS } from './service';


const schema = {
  create: Joi.object({
    date: Joi.date().required(),
    type: Joi.string().valid('credit', 'debit').required(),
    amount: Joi.number().required(),
    transactionId: Joi.string().required(),
    depositor: Joi.string().allow(null, ''),
    bank: Joi.string().allow(null, ''),
    narration: Joi.string().required(),
    balance: Joi.number().required(),
    // AccountId: Joi.number().required(),
  }),

  update: Joi.object({
    id: Joi.number().required(),
    date: Joi.date(),
    type: Joi.string().valid('credit', 'debit'),
    amount: Joi.number(),
    transactionId: Joi.string(),
    depositor: Joi.string().allow(null, ''),
    bank: Joi.string().allow(null, ''),
    narration: Joi.string(),
    balance: Joi.number(),
    // AccountId: Joi.number().required()
  }),

  search: Joi.object({
    searchValue: Joi.string().allow('', null),
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

export default {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const { error, value } = schema.create.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
  
      // Optional: Set the user creating the transaction
      if (req.decodedToken?.id) {
        value.UserId = req.decodedToken.id;
      }
  
      const activeAccount = await db.account.findOne({
        where: { active: true },
      });

      // Step 1: Get the last transaction (assumes global or account-based)
      const lastTransaction = await db.transaction.findOne({
        order: [['createdAt', 'DESC']],
      });
  
      const previousBalance = lastTransaction?.balance ?? activeAccount.openingBalance ?? 0;
  
      // Step 2: Calculate new balance based on type
      const amount = value.amount;
  
      if (value.type === 'credit') {
        value.balance = previousBalance + amount;
      } else if (value.type === 'debit') {
        value.balance = previousBalance - amount;
      } else {
        return res.status(400).json({ error: 'Invalid transaction type' });
      }
  
      value.AccountId = activeAccount?.id; 

      // Step 3: Save the transaction with updated balance
      const transaction = await db.transaction.create(value);

      const sender = 'ElvTurc';
      const message = `${transaction.type } of GH₵ ${transaction.amount} on account: ${activeAccount?.title}, you current balance is GH₵ ${transaction.balance}, transactionId: ${transaction.transactionId}, date: ${transaction.date}, depositor: ${transaction.depositor}, bank: ${transaction.bank}`;
      const recipients = ['0508924141',  await db.user.findOne({ where: { username: 'administrator' }}) ];
      await sendSMS({sender, message, recipients});

      res.status(201).json(transaction);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const transactions = await db.transaction.findAll({
        order: [['createdAt', 'DESC']], // Latest on top
      });
      res.status(200).json(transactions);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  async getOne(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const transaction = await db.transaction.findByPk(id);
      if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

      res.status(200).json(transaction);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  async search(req: Request, res: Response): Promise<any> {
    try {
      const { error, value } = schema.search.validate(req.query);
      if (error) return res.status(400).json({ error: error.details[0].message });
  
      const where: any = {};
  
      // Apply search across multiple fields using a single value
      if (value.searchValue) {
        where[Op.or] = [
          { transactionId: { [Op.like]: `%${value.searchValue}%` } },
          { depositor: { [Op.like]: `%${value.searchValue}%` } },
          { narration: { [Op.like]: `%${value.searchValue}%` } },
        ];
      }
  
      // Apply date range if provided
      if (value.startDate || value.endDate) {
        where.date = {};
        if (value.startDate) where.date[Op.gte] = value.startDate;
        if (value.endDate) where.date[Op.lte] = value.endDate;
      }
  
      const results = await db.transaction.findAll({
        where,
        order: [['date', 'DESC']],
      });
  
      res.status(200).json(results);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  }
  
};
