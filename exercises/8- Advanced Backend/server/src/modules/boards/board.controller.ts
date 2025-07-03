import { UserPayload } from "./../../types/express/server.d";
import { Request, Response } from "express";
import { BoardServices } from "./board.service";

export class BoardController {
  constructor(private boardServices: BoardServices) {}

  getBoardById = async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const userId = req.user!.userId;
  try {
    const board = await this.boardServices.getBoardById(boardId, userId);
    if (!board) return res.status(404).json({ error: "No se encontró el tablero" });
    res.json(board);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

  getBoardsForUser = async (req: Request, res: Response) => {
    const userId = req.user!.userId as UserPayload['userId'];
    try{
      const boards = await this.boardServices.getBoardsForUser(userId);
      if(!boards) return res.status(404).json({error: "No se encontraron tableros"});
      res.json(boards.length ? boards : []);
    } catch(error: any) {
      res.status(500).json({error: error.message});
    }
  };

  addBoard = async (req: Request, res: Response) => {
    const userId = req.user!.userId as UserPayload['userId'];
    const {name} = req.body;
    if(!name){return res.status(400).json({error: "Nombre requerido"})};
    try{
      const board = await this.boardServices.addBoard(name,userId);
      res.status(201).json(board);
    } catch (error: any){
      res.status(500).json({ error: `Error al añadir tablero - ${error.message}` })
    }
  }

  removeBoard = async (req: Request, res: Response) => {
    const {boardId} = req.params;
    try{
      await this.boardServices.deleteBoard(boardId);
      res.status(201).send();
    } catch(error: any) {
      res.status(500).json({error: `Error al eliminar tablero - ${error.message}`})
    }
  }

  //Nuevas Funciones: Compartir Board, actualizar Rol, Borrar usuario compartido.
  shareBoard = async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const { targetUserId, role } = req.body;
    const ownerId = req.user!.userId;
    try {
      await this.boardServices.shareBoard(boardId, ownerId, targetUserId, role);
      res.status(200).json({ message: "Tablero compartido correctamente" });
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  };

  changeUserRole = async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const { targetUserId, newRole } = req.body;
    const ownerId = req.user!.userId;
    try {
      await this.boardServices.changeUserRole(
        boardId,
        ownerId,
        targetUserId,
        newRole
      );
      res.status(200).json({ message: "Permiso actualizado" });
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  };

  removeUser = async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const { targetUserId } = req.body;
    const ownerId = req.user!.userId;
    try {
      await this.boardServices.removeUser(boardId, ownerId, targetUserId);
      res.status(200).json({ message: "Usuario eliminado del tablero"});
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    };
  };
};
