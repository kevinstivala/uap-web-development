import { database } from "../../db/connection";
import { v4 as uuidv4 } from "uuid";

export class TaskRepository {
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
    let query = "SELECT * FROM tasks WHERE boardId = ?";
    const params: any[] = [boardId];

    if (filter === "activa") {
      query += " AND completed = 0";
    } else if (filter === "completada") {
      query += " AND completed = 1";
    }

    if (search) {
      query += " AND text LIKE ?";
      params.push(`%${search}%`);
    }

    query += "ORDER BY id DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const tasks = await database.all(query, params);

    //total para paginación
    let countQuery = "SELECT COUNT(*) as count FROM tasks WHERE boardId = ?";
    const countParams: any[] = [boardId];
    if (filter === "activa") {
      countQuery += " AND completed = 0";
    } else if (filter === "completada") {
      countQuery += " AND completed = 1";
    }
    if (search) {
      countQuery += " AND text LIKE ?";
      countParams.push(`%${search}%`);
    }
    const total = await database.get<{ count: number }>(
      countQuery,
      countParams
    );

    return {
      tasks,
      total: total?.count || 0,
      limit,
      offset,
    };
  }

  async addTask(text: string, boardId: string) {
    const id = uuidv4();
    await database.run(
      "INSERT INTO tasks (id, text, completed, boardId) VALUES (?, ?, 0, ?)",
      [id, text, boardId]
    );
    return { id, text, completed: false, boardId };
  }

  async updateTask(id: string, text?: string, completed?: boolean) {
    const updates: string[] = [];
    const params: any[] = [];
    if(text !== undefined) {
      updates.push("text = ?");
      params.push(text);
    }
    if(completed !== undefined) {
      updates.push("completed = ?");
      params.push(completed ? 1 : 0);
    }
    if(updates.length === 0) throw new Error("No se proporcionaron actualizaciones");
    params.push(id);
    await database.run(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`, params);
    return database.get("SELECT * FROM tasks WHERE id = ?", [id]);
  }

  async deleteTask(id: string) {
    await database.run("DELETE FROM tasks WHERE id = ?", [id]);
  }

  async deleteCompletedTasks(boardId: string) {
    const result = await database.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM tasks WHERE boardId = ? AND completed = 1",
      [boardId]
    );
    await database.run("DELETE FROM tasks WHERE boardId = ? AND completed = 1", [boardId]);
    return result?.count || 0;
  }
}
