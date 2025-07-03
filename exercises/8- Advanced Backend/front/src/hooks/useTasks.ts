import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types/Task";
import axios from "axios";
import { useUIStore } from "../store/useUIStore";
import toast from "react-hot-toast";
import { useSettingsStore } from "../store/useSettingsStore";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/task`;

export interface TaskResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
}

export const useTasks = (boardId: string) => {
  const offset = useUIStore((state) => state.offset);
  const filter = useUIStore((state) => state.filter);
  const { refetchInterval, paginationLimit: limit } = useSettingsStore();

  return useQuery<TaskResponse>({
    queryKey: ["tasks", boardId, filter, offset, limit],
    queryFn: async () => {
      const { data } = await axios.get(
        `${BASE_URL}?boardId=${boardId}&limit=${limit}&offset=${offset}&filter=${filter}`,
        { withCredentials: true }
      );
      return data;
    },
    refetchInterval,
  });
};

export const useAddTask = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      text,
      boardId,
    }: {
      text: string;
      boardId: string;
    }) => {
      const { data } = await axios.post(
        BASE_URL,
        { text, boardId },
        { withCredentials: true }
      );
      if (!data) {
        throw new Error("Error al agregar tarea");
      }
      return data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("¡Tarea agregada exitosamente!");
    },
    onError: () => {
      toast.error("Error al agregar la tarea");
    },
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      completed,
      boardId,
    }: {
      id: string;
      completed: boolean;
      boardId: string;
    }) => {
      const { data } = await axios.put(
        `${BASE_URL}/${id}`,
        { completed, boardId },
        { withCredentials: true }
      );
      if (!data) {
        throw new Error("Error al actualizar tarea");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarea actualizada");
    },
    onError: () => {
      toast.error("Error al actualizar la tarea");
    },
  });
};

export const useEditTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      text,
      boardId,
    }: {
      id: string;
      text: string;
      boardId: string;
    }) => {
      const { data } = await axios.put(
        `${BASE_URL}/${id}`,
        { text, boardId },
        { withCredentials: true }
      );
      if (!data) {
        throw new Error("Error al editar tarea");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarea Editada exitosamente");
    },
    onError: () => {
      toast.error("Error al editar la tarea");
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, boardId }: { id: string; boardId: string }) => {
      await axios.delete(`${BASE_URL}/${id}?boardId=${boardId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarea eliminada");
    },
    onError: () => {
      toast.error("Error al eliminar la tarea");
    },
  });
};

export const useClearCompletedTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({boardId}: {boardId: string}) => {
      await axios.delete(
        `${BASE_URL}/?boardId=${boardId}`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tareas completadas eliminadas");
    },
    onError: () => {
      toast.error("Error al eliminar las tareas completadas");
    },
  });
};
