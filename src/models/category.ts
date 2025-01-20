import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createCategoryModel = (sequelize: Sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  return Category; 
};

export default createCategoryModel;
