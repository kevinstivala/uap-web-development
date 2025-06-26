import { Router } from 'express';
import { BoardRepository } from '../modules/boards/board.repository';
import { BoardServices } from './../modules/boards/board.service';
import { BoardController } from './../modules/boards/board.controller';
import { authMiddlewareCookies } from './../middleware/auth.middleware';
import { requiereBoardRole } from '../middleware/role.middleware';

const router = Router();
const boardsRepository = new BoardRepository();
const boardsService = new BoardServices(boardsRepository);
const boardsController = new BoardController(boardsService);

//get all boards ( visualicen los del propio usuario logeado o los habilitados para compartir con el usuario asignado.)
router.get("/", authMiddlewareCookies, boardsController.getBoardsForUser);
//add a board
router.post("/", authMiddlewareCookies, boardsController.addBoard);
//delete a board (solo el owner del board puede hacer esto.)
router.delete("/:id", authMiddlewareCookies, requiereBoardRole(["dueño"]), boardsController.removeBoard);

//Compartir el board con otro usuario
router.post("/:boardId/share", authMiddlewareCookies, requiereBoardRole(["dueño"]), boardsController.shareBoard);
//Actualizar el rol (dueño,editor,lector) de un usuario asignado para compartir el board.
router.put("/:boardId/role", authMiddlewareCookies, requiereBoardRole(["dueño"]), boardsController.changeUserRole);
//Eliminar un usuario asignado a compartir el board.
router.delete("/:boardId/user", authMiddlewareCookies, requiereBoardRole(["dueño"]), boardsController.removeUser);

export {router as boardRoutes};