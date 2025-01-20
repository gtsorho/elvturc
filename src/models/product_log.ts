import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createProductLogModel = (sequelize: Sequelize) => {
  const Product_Log = sequelize.define('Product_Log', {
    log: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return Product_Log; 
};

export default createProductLogModel;
