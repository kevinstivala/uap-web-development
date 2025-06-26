import { database } from "../../db/connection";
import {v4 as uuidv4} from "uuid";

export class BoardRepository {
  async getBoardsForUser(userId: string){
    return database.all("SELECT b.* FROM boards b JOIN board_users bu ON bu.boardId = b.id WHERE bu.userId = ?", [userId]);
  }
  async addBoard(name: string, ownerId: string) {
    const boardId = uuidv4();
    await database.run("INSERT INTO boards (id, name, ownerId) VALUES (?, ?, ?)", [boardId, name, ownerId]);
    //Asignar owner en board_users:
    await database.run("INSERT INTO board_users (userId, boardId, role) VALUES (?, ?, ?)", [ownerId, boardId, "dueño"]);
    return {id: boardId, name, ownerId};
  }
  async deleteBoard(boardId: string) {
    await database.run("DELETE FROM boards WHERE id = ?",[boardId]);
    await database.run("DELETE FROM board_users WHERE boardId = ?",[boardId]);
    await database.run("DELETE FROM tasks WHERE boardId = ?",[boardId]);
  }
    //Permisos Repo:
  async getUserRoleOnBoards(
    userId: string,
    boardId: string
  ): Promise<string | null> {
    const result = await database.get<{ role: string }>(
      "SELECT role FROM board_users WHERE userId = ? AND boardId = ?",
      [userId, boardId]
    );
    return result ? result.role : null;
  }
  async addUserToBoard(
    userId: string,
    boardId: string,
    role: string
  ): Promise<void> {
    await database.run(
      "INSERT OR REPLACE INTO board_users (userId, boardId, role) VALUES (?, ?, ?)",
      [userId, boardId, role]
    );
  }
  async updateUserRole(boardId: string, userId: string, role: string) {
    await database.run(
      "UPDATE board_users SET role = ? WHERE userId = ? AND boardId = ?",
      [role, userId, boardId]
    );
  }
  async removeUserFromBoard(boardId: string, userId: string) {
    await database.run(
      "DELETE FROM board_users WHERE userId = ? AND boardId = ?",
      [userId, boardId]
    );
  }
}
