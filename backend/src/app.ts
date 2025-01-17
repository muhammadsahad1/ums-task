import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute';
import { mongoConnection } from './config/mongdb';
import authRoute from './routes/authRoute';
import cookieParser from 'cookie-parser'

dotenv.config();
mongoConnection()
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 3000;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Welcome to the User Management System!');
// });

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method)
  console.log(req.body)
  next()
})

app.use('/api/admin', userRoute)
app.use('/api/auth', authRoute)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
