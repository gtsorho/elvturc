import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createTransactionLogModel = (sequelize: Sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('credit', 'debit'), 
      defaultValue: 'credit'
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    depositor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bank: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    narration:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  return Transaction; 
};

export default createTransactionLogModel;
