import { Request, Response, NextFunction } from 'express';
import { RequestWithBody } from './interfaces';

export function validateRequest<T>(schema: (data: any) => data is T) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!schema(req.body)) {
      return res.status(400).send('Invalid request body');
    }
    next();
  };
}

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

export function isNote(data: any): data is Note {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    typeof data.category === 'object' &&
    typeof data.category.id === 'string' &&
    typeof data.category.name === 'string'
  );
}