import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute';
import { mongoConnection } from './config/mongdb';

dotenv.config();
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;
mongoConnection()

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the User Management System!');
});

app.use('/api/admin', userRoute)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
