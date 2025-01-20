import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createItemModel = (sequelize: Sequelize) => {
  const Item = sequelize.define('Item', {
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
  });

  return Item; 
};

export default createItemModel;
