import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors()); 
app.use(express.json()); 


const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the User Management System!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
