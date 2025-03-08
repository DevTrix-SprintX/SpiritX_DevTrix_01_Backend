import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';


const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send({msg:'Hello World!', status: 200});
});

app.use('/auth', authRoutes);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });