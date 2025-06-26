import { Router } from 'express';
import { TaskRepository } from './../modules/tasks/task.repository';
import { TaskService } from './../modules/tasks/task.service';
import { TaskController } from './../modules/tasks/task.controller';
import { authMiddlewareCookies } from '../middleware/auth.middleware';
import { requiereBoardRole } from '../middleware/role.middleware';

const router = Router();
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

//Obtener las tasks de un board especifico.
router.get("/", authMiddlewareCookies, requiereBoardRole(["dueño", "editor", "lector"]), taskController.getTasks);
//Add tarea.
router.post("/", authMiddlewareCookies, requiereBoardRole(["dueño", "editor"]), taskController.addTask);
//Editar tarea.
router.put("/:id", authMiddlewareCookies, requiereBoardRole(["dueño", "editor"]), taskController.updateTask);
//Eliminar tarea individual.
router.delete("/:id", authMiddlewareCookies, requiereBoardRole(["dueño", "editor"]), taskController.deleteTask);
//Eliminar tareas completadas.
router.delete("/completed", authMiddlewareCookies, requiereBoardRole(["dueño", "editor"]), taskController.deleteCompletedTasks);

export {router as taskRoutes};