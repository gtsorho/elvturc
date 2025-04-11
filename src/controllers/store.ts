import { Request, Response } from 'express';
import Joi from 'joi';
import db from '../models';
import { Op } from "sequelize";


const schema = {
    create: Joi.object({
        location: Joi.string().required(),
        description: Joi.string().required(),
        UserId: Joi.number().optional()
    }),

    update: Joi.object({
        id: Joi.number(),
        location: Joi.string(),
        UserId: Joi.number(),
        description: Joi.string()
    })
};

export default {
    async create(req: Request, res: Response): Promise<any> {
        try {
            const { error, value } = schema.create.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            // value.UserId = req.decodedToken?.id

            const user = await db.store.create(value);
            res.status(201).json(user);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },
    async getAll(req: Request, res: Response): Promise<any> {
        try {
            const stores = await db.store.findAll({
                include: [
                    {
                        model: db.product,
                        attributes: ["id", "name"],
                        include: [
                            {
                                model: db.item,
                                attributes: ["id", "quantity", "unitPrice"],
                            },
                        ],
                    },
                ],
            });

            const result = stores.map((store: any) => {
                const products = store.Products || [];

                const productsWithItems = products.map((product: any) => {
                    const items = product.Items || [];
                    const productWorth = items.reduce(
                        (sum: number, item: any) => sum + item.quantity * item.unitPrice,
                        0
                    );

                    const hasLowStock = items.some((item: any) => item.quantity < 50);

                    return {
                        ...product.toJSON(),
                        items,
                        productWorth,
                        hasLowStock,
                    };
                });

                const totalProducts = productsWithItems.length;
                const hasProducts = totalProducts > 0;
                const storeWorth = productsWithItems.reduce(
                    (sum: number, product: any) => sum + product.productWorth,
                    0
                );
                const hasLowStock = productsWithItems.some(
                    (product: any) => product.hasLowStock
                );

                return {
                    ...store.toJSON(),
                    totalProducts,
                    hasProducts,
                    hasLowStock,
                    storeWorth,
                    products: productsWithItems,
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


    async getAllExcept(req: Request, res: Response): Promise<any> {
        try {
            const excludeUserId  = req.params.excludeUserId;
            const stores = await db.store.findAll({
                where: {
                    UserId: {
                        [Op.not]: excludeUserId
                    },
                },
                include: [
                    {
                        model: db.product,
                        attributes: ["id", "name"],
                        include: [
                            {
                                model: db.item,
                                attributes: ["id", "quantity", "unitPrice"],
                            },
                        ],
                    },
                ],
            });

            res.status(200).json(stores);
        } catch (err: any) {
            res.status(500).json({
                error: "Internal Server Error",
                details: err.message,
            });
        }
    },


    async getOne(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const store = await db.store.findByPk(id, {
                include: [
                    {
                        model: db.product,
                        attributes: ["id", "name", "quantity", "unitPrice"],
                    },
                ],
            });

            if (!store) {
                return res.status(404).json({ error: "Store not found" });
            }

            const totalProducts = store.products?.length;
            const hasLowStock = store.products?.some(
                (product: any) => product.quantity < 50
            );
            const storeWorth = store.products?.reduce(
                (sum: number, product: any) => sum + product.quantity * product.unitPrice,
                0
            );

            const result = {
                ...store.toJSON(),
                totalProducts,
                hasLowStock,
                storeWorth,
            };
            res.status(200).json(result);

        } catch (err: any) {
            res.status(500).json({
                error: "Internal Server Error",
                details: err.message,
            });
        }
    },


    async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { error, value } = schema.update.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const user = await db.store.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const updatedUser = await db.store.update(value, {
                where: {
                    id: id,
                },
            },);
            res.status(200).json(updatedUser);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const user = await db.store.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            await db.store.destroy();
            res.status(204).send();
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
};
