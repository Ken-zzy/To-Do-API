import express, { Request, Response } from 'express';
import { notes, categories } from './data';
import { Note, RequestWithBody } from './interfaces';
import { validateRequest, loggingMiddleware, isNote } from './middleware';

const app = express();
const port = 3000;

app.use(express.json());
app.use(loggingMiddleware);

app.get('/api/notes', (req: Request, res: Response) => {
  res.json(notes);
});

app.get('/api/notes/categories/:categoryId', (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const filteredNotes = notes.filter((note) => note.category.id === categoryId);
  res.json(filteredNotes);
});

app.put(
  '/api/notes/:id',
  validateRequest(isNote),
  (req: RequestWithBody<Note>, res: Response) => {
    const id = req.params.id;
    const index = notes.findIndex((note) => note.id === id);
    if (index !== -1) {
      notes[index] = req.body;
      res.json(req.body);
    } else {
      res.status(404).send('Note not found');
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});