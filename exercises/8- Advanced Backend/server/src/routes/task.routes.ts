import { Router, Request, Response, NextFunction } from "express";
import { TaskRepository } from "./../modules/tasks/task.repository";
import { TaskService } from "./../modules/tasks/task.service";
import { TaskController } from "./../modules/tasks/task.controller";
import { authMiddlewareCookies } from "../middleware/auth.middleware";
import { requiereBoardRole } from "../middleware/role.middleware";
import { query, body, validationResult } from "express-validator";

const router = Router();
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

//Obtener las tasks de un board especifico.
router.get(
  "/",
  authMiddlewareCookies,
  requiereBoardRole(["dueño", "editor", "lector"]),
  [
    query("boardId").isString().notEmpty(),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("offset").optional().isInt({ min: 0 }),
    query("filter").optional().isIn(["all", "activa", "completada"]),
    query("search").optional().isString().trim().escape(),
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
  taskController.getTasks
);
//Add tarea.
router.post(
  "/",
  authMiddlewareCookies,
  requiereBoardRole(["dueño", "editor"]),
  [
    body("text").isString().isLength({ min: 1, max: 200 }).trim().escape(),
    body("boardId").isString().notEmpty(),
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
  taskController.addTask
);
//Editar tarea. (checkbox, texto)
router.put(
  "/:id",
  authMiddlewareCookies,
  requiereBoardRole(["dueño", "editor"]),
  [
    body("text").optional().isString().isLength({ min: 1, max: 200 }).trim().escape(),
    body("completed").optional().isBoolean(),
    body("boardId").isString().notEmpty(),
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
  taskController.updateTask
);
//Eliminar tarea individual.
router.delete(
  "/:id",
  authMiddlewareCookies,
  requiereBoardRole(["dueño", "editor"]),
  [query("boardId").isString().notEmpty()],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  taskController.deleteTask
);
//Eliminar tareas completadas.
router.delete(
  "/",
  authMiddlewareCookies,
  requiereBoardRole(["dueño", "editor"]),
  [query("boardId").isString().notEmpty()],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  taskController.deleteCompletedTasks
);

export { router as taskRoutes };
