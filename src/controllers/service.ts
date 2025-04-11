import db from '../models';
import axios from 'axios';
import { Transaction } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export async function createInvoice(data: {
    date: Date;
    items: { itemId: number; quantity: number }[];
    amount_paid: number;
    UserId: number;
    RecipientId: number;

}) {
    const { date, items, amount_paid, UserId, RecipientId} = data;

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const itemDetails = await Promise.all(
        items.map(async ({ itemId, quantity }) => {
            const item = await db.item.findByPk(itemId);
            if (!item) throw new Error(`Item with ID ${itemId} not found`);
            return {
                item_id: item.id,
                quantity,
                subtotal: item.unitPrice * quantity,
            };
        })
    );



    const totalAmount = itemDetails.reduce((sum, item) => sum + item.subtotal, 0);

    console.log(amount_paid)
    const invoice = await db.invoice.create({
        date,
        total_items: totalItems,
        total_amount: totalAmount,
        amount_paid: amount_paid,
        is_balanced: amount_paid >= totalAmount,
        UserId: UserId,
        RecipientId: RecipientId

    });

    for (const detail of itemDetails) {
        await db.item_invoice.create({
            InvoiceId: invoice.id,
            ItemId: detail.item_id,
            quantity: detail.quantity,
            subtotal: detail.subtotal,
        });
    }

    return invoice;
}

export async function updateQty(data: {
    itemId: number;
    quantity: number;
    RecipientId: number;
    date: Date;
}) {
    const { itemId, quantity, RecipientId, date } = data;

    const adjustedQuantity = quantity * -1;

    try {
        // Validate inputs
        if (!itemId || quantity <= 0 || !RecipientId || !date) {
            throw new Error('Invalid input data');
        }

        // Start a transaction
        const transaction: Transaction = await db.sequelize.transaction();

        try {
            const existingItem = await db.item.findByPk(itemId, {
                include: [
                    {
                        model: db.category,
                    },
                ],
                transaction,
            });

            if (!existingItem) {
                await transaction.rollback();
                return { success: false, error: 'Item not found' };
            }

            const recipientStore = await db.store.findOne({
                where: { UserId: RecipientId },
                transaction,
            });

            if (!recipientStore) {
                await transaction.rollback();
                return { success: false, error: 'Recipient store not found' };
            }

            const newQuantity = existingItem.quantity + adjustedQuantity;

            if (newQuantity < 0) {
                await transaction.rollback();
                return { success: false, error: 'Insufficient stock' };
            }

            // Update the existing item's quantity
            await existingItem.update({ quantity: newQuantity }, { transaction });

            // Update or create recipient store item
            const result = await updateOrCreateRecipientStoreItem(
                recipientStore.id,
                existingItem.ProductId,
                existingItem.Categories[0].id,
                existingItem.id,
                Math.abs(quantity)
            );

            if (!result.success) {
                await transaction.rollback();
                return { success: false, error: result.message };
            }

            await transaction.commit();
            return {
                success: true,
                data: {
                    previousQuantity: existingItem.quantity,
                    newQuantity,
                    updatedItem: existingItem,
                    date,
                    recipientStore,
                },
            };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err: any) {
        console.error(err.message);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
 
export async function updateOrCreateRecipientStoreItem(
    recipientStoreId: number,
    productId: number,
    categoryId: number,
    itemId: number,
    quantity: number
): Promise<any> {
    if (quantity <= 0) {
        return { success: false, message: 'Quantity must be greater than zero' };
    }

    try {
        const existingProduct = await db.product.findByPk(productId);
        const existingCategory = await db.category.findByPk(categoryId);
        const existingItem = await db.item.findByPk(itemId);

        if (!existingProduct || !existingCategory || !existingItem) {
            throw new Error('Invalid product, category, or item reference');
        }

        // Find or create product in recipient store
        const [product] = await db.product.findOrCreate({
            where: { name: existingProduct.name, StoreId: recipientStoreId },
            defaults: {
                name: existingProduct.name,
                description: existingProduct.description,
                StoreId: recipientStoreId,
            },
        });

        // Find or create category in recipient store
        const [category] = await db.category.findOrCreate({
            where: { name: existingCategory.name },
            defaults: { name: existingCategory.name },
        });

        // Find or create item in recipient store
        const [item] = await db.item.findOrCreate({
            where: { ProductId: product.id },
            defaults: {
                quantity: 0,
                unitPrice: existingItem.unitPrice,
                ProductId: product.id,
            },
        });

        // Ensure the category is associated with the item
        const productCategoryExists = await db.item_categories.findOne({
            where: { ItemId: item.id, CategoryId: category.id },
        });

        if (!productCategoryExists) {
            await db.item_categories.create({
                ItemId: item.id,
                CategoryId: category.id,
            });
        }

        // Update the item's quantity
        const updatedItem = await item.update({
            quantity: item.quantity + quantity,
        });

        return {
            success: true,
            message: 'Recipient store item updated successfully',
            data: { product, category, updatedItem },
        };
    } catch (error: any) {
        console.error(error.message);
        return { success: false, message: 'Failed to update recipient store item' };
    }
}


interface SMSPayload {
  sender: string;
  message: string;
  recipients: string[];
}

export async function sendSMS(payload: SMSPayload): Promise<void> {
  try {
    const response = await axios.post(
      'https://sms.arkesel.com/api/v2/sms/send',
      payload,
      {
        headers: {
          'api-key': process.env.SMS_API_KEY || '',
        }
      }
    );

    console.log('✅ SMS sent:', response.data);
  } catch (error: any) {
    console.error('❌ Error sending SMS:', error.response?.data || error.message);
  }
}
