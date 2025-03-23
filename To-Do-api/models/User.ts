import mongoose, { Schema } from 'mongoose';
import { User } from '../interfaces.ts';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

export default mongoose.model<User>('User', UserSchema);