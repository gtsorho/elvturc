import { Sequelize, DataTypes } from 'sequelize';

const createAccountLogModel = (sequelize: Sequelize) => {
  const Account = sequelize.define('Account', {
    title: {
      type: DataTypes.STRING, // DATE was likely a mistake here too — assuming title is a string
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    openingBalance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Account;
};

export default createAccountLogModel;
