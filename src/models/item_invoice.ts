import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createItemInvoiceModel = (sequelize: Sequelize) => {
  const item_invoice = sequelize.define('item_invoice', {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
  });

  return item_invoice;
};

export default createItemInvoiceModel;
