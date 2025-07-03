import { TaskRepository } from "./task.repository";

export class TaskService {
  constructor(private TaskRepository: TaskRepository) {}

  async getTasks({
    boardId,
    limit,
    offset,
    filter,
    search,
  }: {
    boardId: string;
    limit?: number;
    offset?: number;
    filter?: string;
    search?: string;
  }) {
    return this.TaskRepository.getTasks({
      boardId,
      limit,
      offset,
      filter,
      search,
    });
  }
  async addTask(text:string, boardId: string){
    if(!text || !boardId) throw new Error("Datos requeridos");
    return this.TaskRepository.addTask(text, boardId);
  }
  async updateTask(id: string, text?: string, completed?: boolean){
    if(!id) throw new Error("Id requerido");
    return this.TaskRepository.updateTask(id, text, completed);
  }
  async deleteTask(id: string){
    if(!id) throw new Error("Id requerido");
    return this.TaskRepository.deleteTask(id);
  }
  async deleteCompletedTasks(boardId: string){
    if(!boardId) throw new Error("BoardId requerido");
    return this.TaskRepository.deleteCompletedTasks(boardId);
  }
}
