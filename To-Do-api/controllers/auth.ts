import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JwtPayload } from '../interfaces';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      // Convert userId to ObjectId
      const userId = new mongoose.Types.ObjectId(decoded.userId);
      req.user = await User.findById(userId);
      next();
    } catch (err) {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(401);
  }

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload: JwtPayload = { userId: user._id }; 
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};