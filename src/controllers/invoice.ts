import Joi, { invalid } from 'joi';
import db from '../models';
import { createInvoice, updateQty } from './service';
import { Request, Response } from 'express';


const schema = {
    create: Joi.object({
        date: Joi.date().required(),
        items: Joi.array()
            .items(
                Joi.object({
                    itemId: Joi.number().required(),
                    quantity: Joi.number().required(),
                })
            )
            .min(1)
            .required(),
        amount_paid: Joi.number().required(),
        recipientId: Joi.number().required(),
    }),

    update: Joi.object({
        amount_paid: Joi.number(),
    }),

};

export default {
    async create(req: Request, res: Response): Promise<any> {
        try {
            const { error, value } = schema.create.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            value.UserId = req.decodedToken?.id;

            const { items, recipientId } = value;

            for (var item of items) {
                const updateResult = await updateQty({
                    itemId: item.itemId,
                    quantity: item.quantity,
                    recipientId,
                    date: value.date,
                });

                if (!updateResult.success) {
                    return res.status(400).json({
                        error: `Failed to process item ID ${item.itemId}: ${updateResult.error}`,
                    });
                }
            }

            // Create the invoice
            const invoice = await createInvoice(value);

            const createdInvoice = await db.invoice.findByPk(invoice.id, {
                include: [
                    {
                        model: db.item,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'quantity', 'ProductId']
                        },
                        through: { attributes: ['quantity', 'subtotal'] },
                        include: [
                            {
                                model: db.category,
                                through: {
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    },
                                },
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                },
                            },
                            {
                                model: db.product,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                },
                            }
                        ]
                    },
                    {
                        model: db.user,
                        attributes: ['username', 'phone'],
                    },
                    {
                        model: db.user,
                        as: 'recipient',
                        attributes: ['username', 'phone'],
                    }
                ],
            });



            const log = await db.product_log.create({
                type: 'invoice created',
                log: JSON.stringify(createdInvoice),
                UserId: req.decodedToken?.id

            })
            res.status(201).json({ success: true, data: createdInvoice });
        } catch (err: any) {
            res.status(500).json({
                error: 'Internal Server Error',
                details: err.message,
            });
        }
    },

    async getAll(req: Request, res: Response): Promise<any> {
        try {
            const invoices = await db.invoice.findAll({
                include: [
                    {
                        model: db.item,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'quantity', 'ProductId']
                        },
                        through: { attributes: ['quantity', 'subtotal'] },
                        include: [
                            {
                                model: db.category,
                                through: {
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    },
                                },
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                },
                            },
                            {
                                model: db.product,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                },
                            }
                        ]
                    },
                    {
                        model: db.user,
                        attributes: ['username', 'phone'],
                    },
                    {
                        model: db.user,
                        as: 'recipient',
                        attributes: ['username', 'phone'],
                    }
                ],
                order: [['createdAt', 'DESC']],
            });
            res.json({ success: true, data: invoices });
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const invoice = await db.invoice.findByPk(id, {
                include: [
                    {
                        model: db.item,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'quantity', 'ProductId']
                        },
                        through: { attributes: ['quantity', 'subtotal'] },
                        include: [
                            {
                                model: db.category,
                                through: {
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    },
                                },
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                },
                            },
                            {
                                model: db.product,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                },
                            }
                        ]
                    },
                    {
                        model: db.user,
                        attributes: ['username', 'phone'],
                    },
                    {
                        model: db.user,
                        as: 'recipient',
                        attributes: ['username', 'phone'],
                    }
                ],
            });

            if (!invoice) {
                return res.status(404).json({ success: false, message: 'Invoice not found' });
            }

            res.json({ success: true, data: invoice });
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async update(req: Request, res: Response): Promise<any> {
        try {
            const { error, value } = schema.update.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { id } = req.params;
            const invoice = await db.invoice.findByPk(id)
            if (!invoice) {
                return res.status(404).json({ success: false, message: 'Invoice not found' });
            }
            
            const newPaid = invoice.amount_paid + value.amount_paid;
            
            
            const [rowsUpdated] = await db.invoice.update({amount_paid:newPaid}, { where: { id } });

            const createdInvoice = await db.invoice.findByPk(id, {
                include: [
                    {
                        model: db.item,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'quantity', 'ProductId']
                        },
                        through: { attributes: ['quantity', 'subtotal'] },
                        include: [
                            {
                                model: db.category,
                                through: {
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    },
                                },
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                },
                            },
                            {
                                model: db.product,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                },
                            }
                        ]
                    },
                    {
                        model: db.user,
                        attributes: ['username', 'phone'],
                    },
                    {
                        model: db.user,
                        as: 'recipient',
                        attributes: ['username', 'phone'],
                    }
                ],
            });

            const log = await db.product_log.create({
                type: 'invoice updated',
                log: JSON.stringify(createdInvoice),
                UserId: req.decodedToken?.id
            })

            res.json({ success: true, message: 'Invoice updated successfully' });
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const rowsDeleted = await db.invoice.destroy({ where: { id } });

            if (rowsDeleted === 0) {
                return res.status(404).json({ success: false, message: 'Invoice not found' });
            }

            res.json({ success: true, message: 'Invoice deleted successfully' });
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },
};


