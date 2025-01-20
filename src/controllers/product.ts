import { Request, Response } from 'express';
import Joi from 'joi';
import db from '../models';
import category from './category';


const schema = {
    create: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        StoreId: Joi.number().required(),
    }),

    update: Joi.object({
        id:Joi.number(),
        name: Joi.string(),
        description: Joi.string(),
        StoreId: Joi.number(),
    })
};

export default {
    async create(req: Request, res: Response):Promise<any> {
        try {
            const { error, value } = schema.create.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const product = await db.product.create(value);

            res.status(201).json(product);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getAll(req: Request, res: Response): Promise<any> {
        try {
            const products = await db.product.findAll({
                where: { StoreId: req.params.storeId },
                include: [
                    {
                        model: db.item,
                        attributes: ["id", "quantity", "unitPrice"],
                        include: [
                            {
                                model: db.category, 
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
            });
    
            const result = products.map((product: any) => {
                const items = product.Items || []; 
    
                const enrichedItems = items.map((item: any) => {
                    const totalAmount = item.quantity * item.unitPrice;
                    return {
                        ...item.toJSON(),
                        totalAmount,
                    };
                });
    
                const totalWorth = enrichedItems.reduce(
                    (sum: number, item: any) => sum + item.totalAmount,
                    0
                );
    
                return {
                    ...product.toJSON(),
                    items: enrichedItems,
                    totalWorth,
                };
            });
    
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({
                error: "Internal Server Error",
                details: err.message,
            });
        }
    },
             

    async getOne(req: Request, res: Response):Promise<any>  {
        try {
            const { id } = req.params;
            const user = await db.product.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json(user);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async update(req: Request, res: Response):Promise<any>  {
        try {
            const { id } = req.params;
            const { error, value } = schema.update.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const user = await db.product.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const updatedUser = await db.product.update(value, {
                where: {
                  id: id,
                },
            });
            res.status(200).json(updatedUser);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async delete(req: Request, res: Response):Promise<any>  {
        try {
            const { id } = req.params;
            const user = await db.product.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            await db.product.destroy();
            res.status(204).send();
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
};
