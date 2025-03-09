import express, { Request, Response, NextFunction } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

interface Note extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const NoteModel = mongoose.model<Note>('Note', noteSchema);

class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

app.get('/api/notes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await NoteModel.find();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

app.get('/api/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await NoteModel.findById(req.params.id);
    if (!note) {
      throw new CustomError('Note not found', 404);
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
});

app.post('/api/notes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = new NoteModel(req.body);
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedNote = await NoteModel.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      throw new CustomError('Note not found', 404);
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes', {
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Could not connect to MongoDB', err);
});