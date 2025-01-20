import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createInvoiceLogModel = (sequelize: Sequelize) => {
  const Invoice = sequelize.define('Invoice', {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total_items: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    amount_paid:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    is_balanced: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  return Invoice; 
};

export default createInvoiceLogModel;
