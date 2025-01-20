import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createItemCategoryModel = (sequelize: Sequelize) => {
  const item_categories = sequelize.define('item_categories', {

  });

  return item_categories; 
};

export default createItemCategoryModel;
