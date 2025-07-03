import { useState } from "react";
import type { Board } from "../types/Board";
import {
  useChangeUserRole,
  useRemoveUserFromBoard,
  useShareBoard,
  useAllUsers,
} from "../hooks/useBoard";
import toast from "react-hot-toast";

export const BoardShare = ({
  board,
  currentUserId,
}: {
  board: Board;
  currentUserId: string;
}) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [role, setRole] = useState<"lector" | "editor" | "dueño">("lector");
  const shareBoard = useShareBoard(board.id);
  const changeUserRole = useChangeUserRole(board.id);
  const removeUser = useRemoveUserFromBoard(board.id);

  const { data: users } = useAllUsers(currentUserId);

  //Solo el dueño puede ocmpartir y gestionar roles
  if (board.role !== "dueño") return null;

  return (
    <>
      <div className="p-4 border mb-4">
        <h3 className="font-bold mb-2">Compartir tablero</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedUserId) return;
            shareBoard.mutate(
              { targetUserId: selectedUserId, role },
              {
                onSuccess: () => {
                  toast.success("Tablero compartido correctamente");
                  setSelectedUserId("");
                  setRole("lector");
                },
                onError: () => toast.error("Error al compartir el tablero"),
              }
            );
          }}
          className="flex gap-2 mb-4"
        >
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="border p-1 rounded"
            required
          >
            <option value="">Selecciona un usuario</option>
            {users && users.length === 0 && (
              <option disabled value="">
                No hay otros usuarios
              </option>
            )}
            {users?.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="border p-1 rounded"
          >
            <option value="lector">Lector</option>
            <option value="editor">Editor</option>
            <option value="dueño">Dueño</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white px-2 rounded">
            Compartir
          </button>
        </form>

        <h4 className="font-semibold mb-1">Usuarios con acceso:</h4>
        <ul>
          {board.sharedUsers?.map((u) => (
            <li key={u.userId} className="flex items-center gap-2 mb-1">
              <span>
                {u.username} ({u.role})
              </span>
              {u.userId !== currentUserId && (
                <>
                  <select
                    value={u.role}
                    onChange={(e) =>
                      changeUserRole.mutate(
                        { targetUserId: u.userId, newRole: e.target.value },
                        {
                          onSuccess: () => toast.success("Rol actualizado"),
                          onError: () => toast.error("Error al cambiar rol"),
                        }
                      )
                    }
                    className="border p-1 rounded"
                  >
                    <option value="lector">Lector</option>
                    <option value="editor">Editor</option>
                    <option value="dueño">Dueño</option>
                  </select>
                  <button
                    onClick={() =>
                      removeUser.mutate(
                        { targetUserId: u.userId },
                        {
                          onSuccess: () => toast.success("Usuario eliminado"),
                          onError: () =>
                            toast.error("Error al eliminar usuario"),
                        }
                      )
                    }
                    className="text-red-500 ml-2"
                  >
                    Quitar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
