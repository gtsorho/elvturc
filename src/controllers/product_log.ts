import { Request, Response } from 'express';
import Joi from 'joi';
import db from '../models';


const schema = {
    create: Joi.object({
        log: Joi.string().required(),
        type: Joi.string().required(),
        title: Joi.string().required(),
    }),

    update: Joi.object({
        id:Joi.number(),
        log: Joi.string(),
        type: Joi.string(),
        title: Joi.string(),
        UserId: Joi.number(),
    })
};

export default {
    async create(req: Request, res: Response):Promise<any>  {
        try {
            const { error, value } = schema.create.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            value.UserId = req.decodedToken?.id

            const log = await db.product_log.create(value);
            res.status(201).json(log);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getAll(req: Request, res: Response):Promise<any>  {
        try {
            const users = await db.product_log.findAll();
            res.status(200).json(users);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getOne(req: Request, res: Response) :Promise<any> {
        try {
            const { id } = req.params;
            const user = await db.product_log.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json(user);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },
};
