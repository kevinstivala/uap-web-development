import { BoardRepository } from "./board.repository";

export class BoardServices {
  constructor(private boardRepository: BoardRepository) {}

async getBoardById(boardId: string, userId: string) {
  // Obtiene el board
  const board = await this.boardRepository.getBoardById(boardId);
  if (!board) return null;

  // Obtiene el rol del usuario actual en ese board
  const role = await this.boardRepository.getUserRoleOnBoards(userId, boardId);

  // Obtiene los usuarios compartidos (id, username, role)
  const sharedUsers = await this.boardRepository.getBoardUsers(boardId);

  return {
    ...board,
    role,
    sharedUsers,
  };
}

  async getBoardsForUser(userId: string) {
    return this.boardRepository.getBoardsForUser(userId);
  }

  async addBoard(name: string, ownerId: string) {
    return this.boardRepository.addBoard(name,ownerId);
  }

  async deleteBoard(boardId: string) {
    await this.boardRepository.deleteBoard(boardId);
  }

  async shareBoard(
    boardId: string,
    ownerId: string,
    targetUserId: string,
    role: string
  ) {
    //Solo el dueño puede compartir el board.
    const ownerRole = await this.boardRepository.getUserRoleOnBoards(
      ownerId,
      boardId
    );
    if (ownerRole !== "dueño") {
      throw new Error("Solo el dueño púede compartir el tablero");
    }
    await this.boardRepository.addUserToBoard(targetUserId, boardId, role);
  }

  async changeUserRole(
    boardId: string,
    ownerId: string,
    targetUserId: string,
    newRole: string
  ) {
    const ownerRole = await this.boardRepository.getUserRoleOnBoards(
      ownerId,
      boardId
    );
    if (ownerRole !== "dueño") {
      throw new Error("Solo el dueño puede cambiar permisos");
    }
    await this.boardRepository.updateUserRole(boardId, targetUserId, newRole);
  }

  async removeUser(boardId: string, ownerId: string, targetUserId: string) {
    const ownerRole = await this.boardRepository.getUserRoleOnBoards(
      ownerId,
      boardId
    );
    if (ownerRole !== "dueño") {
      throw new Error("Solo el dueño puede eliminar usuarios del tablero");
    }
    await this.boardRepository.removeUserFromBoard(boardId, targetUserId);
  }
}
