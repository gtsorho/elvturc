import { Request, Response } from 'express';
import Joi from 'joi';
import db from '../models';
import category from './category';


const schema = {
    create: Joi.object({
        quantity: Joi.number().required(),
        unitPrice: Joi.number().required(),
        ProductId: Joi.number().required(),
        CategoryId:Joi.number().required(),
        date:Joi.date().optional(),
        StoreId:Joi.number().optional(),
        recipientStoreId:Joi.number().optional(),
    }),

    update: Joi.object({
        id:Joi.number(),
        quantity: Joi.number(),
        unitPrice: Joi.number(),
        ProductId: Joi.number(),
        CategoryId:Joi.number(),
        date:Joi.date(),
        StoreId:Joi.number().optional(),
        recipientStoreId:Joi.number(),
    })
};

export default {
    async create(req: Request, res: Response):Promise<any> {
        try {
            const { error, value } = schema.create.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { quantity, unitPrice, ProductId, CategoryId } = req.body; 
            const item = await db.item.create({ quantity, unitPrice, ProductId });

            const category = await db.category.findByPk(CategoryId);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            await item.addCategory(category);

            res.status(201).json(item);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getAll(req: Request, res: Response): Promise<any> {
        try {
            const items = await db.item.findAll({
                where: { ProductId: req.params.productId},
                include: [
                    { 
                        model:db.category,
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
                        model:db.product,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }, 
                    }
                ]                    
            });
    
            const result = items.map((item: any) => {
                const totalAmount = item.quantity * item.unitPrice;
                return {
                    ...item.toJSON(),
                    totalAmount,
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
    
    async getItemsByStoreId(req: Request, res: Response):Promise<any>  {
        try {
            const { id } = req.params;
            const items = await db.item.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: db.product,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        },
                        where: { StoreId: id },
                    },
                    {
                        model: db.category,
                        attributes: ['name'],
                    },
                ],
            });
            if (!items) return res.status(404).json({ error: 'User not found' });

            res.status(200).json(items);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getOne(req: Request, res: Response):Promise<any>  {
        try {
            const { id } = req.params;
            const user = await db.item.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json(user);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },
    
    async updateQty(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { error, value } = schema.update.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }
    
            const { ProductId, CategoryId, quantity, recipientStoreId, ...updatePayload } = value;
    
            const existingItem = await db.item.findOne({
                where: { ProductId },
                include: [
                    {
                        model: db.category,
                        where: { id: CategoryId },
                    },
                    {
                        model: db.product,
                    },
                ],
            });
    
            if (!existingItem) {
                return res.status(404).json({ success: false, error: 'Item not found' });
            }
    
            // Handle recipient store logic if applicable
            let adjustedQuantity = quantity;
            let recipientStore = null;
    
            if (recipientStoreId) {
                recipientStore = await db.store.findByPk(recipientStoreId);
    
                if (!recipientStore) {
                    return res.status(404).json({ success: false, error: 'Recipient store not found' });
                }
    
                adjustedQuantity = quantity * -1; // Adjust quantity for transfer
            }
    
            const newQuantity = existingItem.quantity + adjustedQuantity;
    
            // Ensure quantity is non-negative (optional, based on business logic)
            if (newQuantity < 0) {
                return res.status(400).json({ success: false, error: 'Insufficient stock' });
            }
    
            // Update the item
            const updatedItem = await existingItem.update({
                ...updatePayload,
                quantity: newQuantity,
            });
    
            if (recipientStoreId) {
                const transferDetails = {
                    productDetails: { name: existingItem.Product.name},
                    categoryDetails: { name: existingItem.Categories[0].name},
                    ...updatePayload,
                };
            
                const result = await updateOrCreateRecipientStoreItem(
                    recipientStore.id,
                    ProductId,
                    CategoryId,
                    existingItem.id,
                    transferDetails,
                    Math.abs(quantity)
                );
            
                if (!result.success) {
                    return res.status(500).json({ success: false, error: result.message });
                }
            }

            res.status(200).json({
                success: true,
                message: 'Item updated successfully',
                data: {
                    previousQuantity: existingItem.quantity,
                    newQuantity,
                    updatedItem,
                    date: updatePayload.date,
                    storeId: await db.store.findByPk(updatePayload.StoreId),
                    recipientStore: recipientStore || null,
                },
            });
        } catch (err: any) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                details: err.message,
            });
        }
    },   
        
    // async update(req: Request, res: Response):Promise<any> {
    //     try {
    //         const { id } = req.params;
    //         var schema = Joi.object({
    //             unitPrice: Joi.number(),
    //             CategoryId:Joi.number(),
    //         })

    //         const { error, value } = schema.validate(req.body);
    //         if (error) return res.status(400).json({ error: error.details[0].message });

    //         const Item = await db.item.findByPk(id);
    //         if (!Item) return res.status(404).json({ error: 'Item not found' });

    //         const updateCategory = await db.item_categories.update({
    //             CategoryId: req.body.CategoryId
    //         },
    //             {
    //                 where:{
    //                     CategoryId: req.body.CategoryId,
    //                     ItemId: id
    //                 }   
    //             }
    //         )

    //         const updatedItem = await db.item.update({
    //             unitPrice: req.body.unitPrice,
    //         },  {
    //             where: {
    //               id: id,
    //             },
    //           },);

    //           console.log([req.body.CategoryId,id])


    //         res.status(200).json([updatedItem, updateCategory]);
    //     } catch (err: any) {
    //         res.status(500).json({ error: 'Internal Server Error', details: err.message });
    //     }
    // },


    async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
    
            // Validation schema
            const schema = Joi.object({
                unitPrice: Joi.number(),
                CategoryId: Joi.number(),
            });
    
            const { error, value } = schema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });
    
            // Find the item
            const item = await db.item.findByPk(id);
            if (!item) return res.status(404).json({ error: 'Item not found' });
    
            // Update the pivot table (item_categories)
            const existingCategoryLink = await db.item_categories.findOne({
                where: { ItemId: id },
            });
    
            if (existingCategoryLink) {
                // If a link exists, update the CategoryId
                await db.item_categories.update(
                    { CategoryId: req.body.CategoryId },
                    { where: { ItemId: id } }
                );
            }
    
            // Update the main item details
            const updatedItem = await db.item.update(
                { unitPrice: req.body.unitPrice },
                { where: { id } }
            );
    
            res.status(200).json({ updatedItem, message: "Item and Category updated successfully" });
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    
    async delete(req: Request, res: Response):Promise<any>  {
        try {
            const { id } = req.params;
            const user = await db.item.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            await db.item.destroy();
            res.status(204).send();
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
};


async function updateOrCreateRecipientStoreItem(    
    recipientStoreId: number,
    productId: number,
    categoryId: number,
    itemId: number,
    itemDetails: any,
    quantity: number
): Promise<any> {
    try {
       
        const existingProduct = await db.product.findByPk(productId)
        const existingCategory = await db.category.findByPk(categoryId)
        const existingItem = await db.item.findByPk(itemId)


        const [product] = await db.product.findOrCreate({
            where: { name: existingProduct.name, StoreId: recipientStoreId },
            defaults: { name: existingProduct.name, description:existingProduct.description, StoreId: recipientStoreId},
        });

        // Find or create the category in the recipient store
        const [category] = await db.category.findOrCreate({
            where: { name: existingCategory.name },
            defaults: { name:existingCategory.name},
        });


        // Find or create the item in the recipient store
        const [item] = await db.item.findOrCreate({
            where: { ProductId: product.id},
            include:{
                model:db.category,
                where: {
                    id: categoryId 
                }
            },
            defaults: { quantity: quantity , unitPrice:existingItem.unitPrice, ProductId:product.id},
        });


        // Ensure the category is associated with the product
        const productCategoryExists = await db.item_categories.findOne({
            where: { ItemId: item.id, CategoryId: category.id },
        });

        if (!productCategoryExists) {
            await db.item_categories.create({
                ItemId: item.id,
                CategoryId: category.id,
            });
        }

        // Update the item's quantity in the recipient store
        const updatedItem = await item.update({
            quantity: item.quantity + quantity,
        });

        return {
            success: true,
            message: 'Recipient store item updated successfully',
            data: {
                product,
                category,
                updatedItem,
            },
        };
    } catch (error: any) {
        throw new Error(`Failed to update recipient store: ${error}`);
    }
}
