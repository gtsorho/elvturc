import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './database'; // Sequelize configuration
import routes from './routes'; // Define API routes
import db from './models'; //
import cors from 'cors';
db


const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

app.use('/api', routes);

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
  console.log(`Server running on port ${PORT}`);
});
