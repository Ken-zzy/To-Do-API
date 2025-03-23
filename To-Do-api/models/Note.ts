import mongoose, { Schema, Types } from 'mongoose';
import { Note } from '../interfaces';

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

export default mongoose.model<Note>('Note', NoteSchema);