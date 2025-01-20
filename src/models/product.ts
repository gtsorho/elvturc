import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createProductModel = (sequelize: Sequelize) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Product; 
};

export default createProductModel;
