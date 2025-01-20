import { Request, Response } from 'express';
import Joi from 'joi';
import db from '../models';


const schema = {
    create: Joi.object({
        name: Joi.string().required(),
    }),

    update: Joi.object({
        id:Joi.number(),
        name: Joi.string(),
    })
};

export default {
    async create(req: Request, res: Response):Promise<any> {
        try {
            const { error, value } = schema.create.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const user = await db.category.create(value);
            res.status(201).json(user);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getAll(req: Request, res: Response): Promise<any> {
        try {
            const categories = await db.category.findAll();
            res.status(200).json(categories);
        } catch (err: any) {
            res.status(500).json({
                error: "Internal Server Error",
                details: err.message,
            });
        }
    },        

    async getCategoriesForProduct(req: Request, res: Response): Promise<any> {
        try {
            const product = await db.product.findByPk(req.params.ProductId, {
                include: [
                    {
                        model: db.item,
                        include: [
                            {
                                model: db.category,
                                through: { attributes: [] }, 
                            },
                        ],
                    },
                ],
            });
    
            if (!product) {
                return { error: 'Product not found' };
            }
    
            const categories = product.Items
                ?.flatMap((item: any) => item.Categories)
                .filter((category: any, index: number, self: any[]) =>
                    self.findIndex((c: any) => c.id === category.id) === index
                );
    
                res.status(200).json(categories);
        } catch (err:any) {
            res.status(500).json({
                error: "Internal Server Error",
                details: err.message,
            });
        }
    },

    async delete(req: Request, res: Response):Promise<any>  {
        try {
            const { id } = req.params;
            const user = await db.category.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            await db.category.destroy();
            res.status(204).send();
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
};
