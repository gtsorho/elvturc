import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


const createStoreModel = (sequelize: Sequelize) => {
  const Store = sequelize.define('Store', {
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  return Store; 
};

export default createStoreModel;
