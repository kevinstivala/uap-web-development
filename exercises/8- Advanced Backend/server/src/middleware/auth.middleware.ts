import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../types/express/server';

export const authMiddlewareCookies = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.signedCookies?.authToken;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized - Token requerido' });
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
        req.user = user;
        next();
    } catch {
        res.status(403).json({ error: 'Unauthorized - Token inválido' });
        return;
    }
};