import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import db from './modals';

const app = express();
const port = process.env.PORT || 3000;

const startApiService = async (): Promise<void> => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    if (process.env.NODE_ENV !== 'production') {
      await db.sequelize.sync({ alter: true });
      console.log('Database models synchronized.');
    }

    // CORS middleware added before other middleware
    app.use(cors());
    
    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200);
      res.send({msg:'It\'s working!', status: 200});
    });
    
    app.use('/auth', authRoutes);
    
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
  }
};

startApiService();