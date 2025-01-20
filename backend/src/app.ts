import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute';
import { mongoConnection } from './config/mongdb';
import authRoute from './routes/authRoute';
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';

dotenv.config();
mongoConnection()
const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.ORIGIN_URL,
  methods: ["POST", "PUT", "DELETE", "GET"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
const PORT = process.env.PORT || 3000;

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method)
  console.log(req.body)
  next()
})

app.use('/api/admin', userRoute)
app.use('/api/auth', authRoute)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
