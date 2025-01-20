import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('elvturk', 'root', 'Capslock@14', {
  host: 'localhost',
  dialect: 'mysql'
});
