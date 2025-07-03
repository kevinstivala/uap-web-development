import { NextFunction, Router, Request, Response } from "express";
import { BoardRepository } from "../modules/boards/board.repository";
import { BoardServices } from "./../modules/boards/board.service";
import { BoardController } from "./../modules/boards/board.controller";
import { authMiddlewareCookies } from "./../middleware/auth.middleware";
import { requiereBoardRole } from "../middleware/role.middleware";
import { body, validationResult, param } from "express-validator";

const router = Router();
const boardsRepository = new BoardRepository();
const boardsService = new BoardServices(boardsRepository);
const boardsController = new BoardController(boardsService);

//get all boards ( visualicen los del propio usuario logeado o los habilitados para compartir con el usuario asignado.)
router.get("/", authMiddlewareCookies, boardsController.getBoardsForUser);
//add a board
router.post(
  "/",
  authMiddlewareCookies,
  [body("name").isString().isLength({ min: 1, max: 50 }).trim().escape()],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  boardsController.addBoard
);
//delete a board (solo el owner del board puede hacer esto.)
router.delete(
  "/:boardId",
  authMiddlewareCookies,
  requiereBoardRole(["dueño"]),
  [param("boardId").isString().notEmpty()],
  boardsController.removeBoard
);

//Compartir el board con otro usuario
router.post(
  "/:boardId/share",
  authMiddlewareCookies,
  requiereBoardRole(["dueño"]),
  [
    body("targetUserId").isString().notEmpty().trim().escape(),
    body("role").isIn(["dueño", "editor", "lector"]),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  boardsController.shareBoard
);
//Actualizar el rol (dueño,editor,lector) de un usuario asignado para compartir el board.
router.put(
  "/:boardId/role",
  authMiddlewareCookies,
  requiereBoardRole(["dueño"]),
  [
    body("targetUserId").isString().notEmpty().trim().escape(),
    body("newRole").isIn(["dueño", "editor", "lector"]),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  boardsController.changeUserRole
);
//Eliminar un usuario asignado a compartir el board.
router.delete(
  "/:boardId/user",
  authMiddlewareCookies,
  requiereBoardRole(["dueño"]),
  [
    body("targetUserId").isString().notEmpty().trim().escape(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  boardsController.removeUser
);

export { router as boardRoutes };
