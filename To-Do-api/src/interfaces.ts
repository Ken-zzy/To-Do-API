import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface User extends Document {
  username: string;
  passwordHash: string;
}

export interface Note extends Document {
  title: string;
  content: string;
  userId: Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: Types.ObjectId;
}