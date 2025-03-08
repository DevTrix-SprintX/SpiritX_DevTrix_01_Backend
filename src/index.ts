import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';
import db from './modals';

  const startApiService = async (): Promise<void> => {
    try {
      await db.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      
      if (process.env.NODE_ENV !== 'production') {
        await db.sequelize.sync({ alter: true });
        console.log('Database models synchronized.');
      }



      app.get('/', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.send({msg:'Hello World!', status: 200});
    });
    
    app.use('/auth', authRoutes);
    
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });

    } catch (error) {
      console.error('Unable to connect to the database or start server:', error);
    }
  };

  

const app = express();
const port = process.env.PORT || 3000;
startApiService();