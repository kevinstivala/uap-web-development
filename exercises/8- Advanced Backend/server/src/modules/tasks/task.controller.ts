import { Request, Response } from "express";
import { TaskService } from "./task.service";

export class TaskController {
  constructor(private TaskService: TaskService) {}
  getTasks = async (req: Request, res: Response) => {
    const { boardId, limit = 5, offset = 0, filter, search } = req.query;
    if (!boardId) return res.status(400).json({ error: "boardId requerido" });
    try {
      const result = await this.TaskService.getTasks({
        boardId: String(boardId),
        limit: Number(limit),
        offset: Number(offset),
        filter: filter?  String(filter) : undefined,
        search: search? String(search) : undefined,
      });
      if(!result) return res.status(404).json({error: "No se encontraron tareas"});
      res.json(result.tasks.length ? result : {tasks: [], total: 0, limit, offset});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  addTask = async (req: Request, res: Response) => {
    const {text,boardId} = req.body;
    if(!text || !boardId) return res.status(400).json({error: "Datos requeridos (text o boardId)"});
    try{
        const task = await this.TaskService.addTask(text, boardId);
        res.status(201).json(task);
    } catch(error: any){
        res.status(500).json({error: error.message});
    }
  };
  updateTask = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {text, completed} = req.body;
    if(!id) return res.status(400).json({error: "Id de task requerido"});
    try{
        const task = await this.TaskService.updateTask(id,text,completed);
        res.json(task);
    } catch(error: any){
        res.status(500).json({error: error.message})
    };
  };
  deleteTask = async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        await this.TaskService.deleteTask(id);
        res.status(204).send();
    } catch(error: any){
        res.status(500).json({error: error.message});
    }
  };
  deleteCompletedTasks = async (req: Request, res: Response) => {
    const {boardId} = req.query;
    if(!boardId) return res.status(400).json({error: "boardId requerido"});
    try{
        const deletedCount = await this.TaskService.deleteCompletedTasks(String(boardId));
        res.json({deletedCount});
    } catch(error: any){
        res.status(500).json({error: error.message});
    }
  };
}
