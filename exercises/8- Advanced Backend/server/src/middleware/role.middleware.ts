import { Request, Response, NextFunction } from "express";
import { database } from "../db/connection";
import { UserPayload } from '../types/express/server';

export function requiereBoardRole(requiredRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - Token requerido" });
    }
    const userId = req.user?.userId as UserPayload['userId'];
    const boardId = req.params.boardId || req.body.boardId || req.query.boardId;
    if (!userId || !boardId) {
      return res
        .status(400)
        .json({ error: "User ID and Board ID are required" });
    }
    try {
        const boardUser = await database.get<any>("SELECT role FROM board_users WHERE userId = ? AND boardId = ?", [userId, boardId]);
        if (!boardUser || !requiredRoles.includes(boardUser.role)) {
            return res.status(403).json({ error: "Forbidden - No tienes permisos para acceder a este recurso" });
        }
        next();
    } catch (error) {
      console.error("Error en el middleware de roles:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}