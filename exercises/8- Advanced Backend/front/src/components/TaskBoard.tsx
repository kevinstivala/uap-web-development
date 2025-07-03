import { useParams, Link } from "@tanstack/react-router";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { TaskFilters } from "./TaskFilters";
import { BoardShare } from "./BoardShare";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const TaskBoard = () => {
  const { boardId, name } = useParams({ from: "/board/$boardId/$name" });
  const { user } = useAuthStore();

  const { data: board, isLoading } = useQuery({
    queryKey: ["board", boardId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/board/${boardId}`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!boardId,
  });

  if (isLoading) return <div>Cargando tablero...</div>;
  if (!board) return <div>No se encontró el tablero</div>;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mx-auto max-w-md">
      <Link to="/" className="text-blue-500 mb-4 block">
        ← Volver a tableros
      </Link>
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-2">
        Tablero: "{name}"
      </h1>
      <h2 className="text-xs font-normal text-center text-gray-400 mb-4">
        ID: {boardId}
      </h2>
      <TaskForm boardId={String(boardId)} />
      <TaskFilters boardId={String(boardId)} />
      <TaskList boardId={String(boardId)} />
      <BoardShare board={board} currentUserId={user?.id ?? ""} />
    </div>
  );
};
