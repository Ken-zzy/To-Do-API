import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Note from './models/Note';
import { register, login } from './controllers/auth';
import { authenticate } from './middleware/auth';
import { AuthRequest } from './interfaces';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notesdb';

app.use(express.json());

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

app.get('/api/notes', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest; 
    const notes = await Note.find({ userId: authReq.user?._id });
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

app.post('/api/notes', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest; // Explicitly cast req to AuthRequest
    const note = new Note({ ...req.body, userId: authReq.user?._id });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});