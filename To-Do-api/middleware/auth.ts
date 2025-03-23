import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../interfaces';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user = await User.findById(decoded.userId);
      next();
    } catch (err) {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(401);
  }
};