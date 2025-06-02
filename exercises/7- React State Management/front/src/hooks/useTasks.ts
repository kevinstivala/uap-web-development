import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types/Task";
import axios from "axios";
import { useUIStore } from "../store/useUIStore";

const BASE_URL = "http://localhost:3000/api/task";

export interface TaskResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
};

export const useTasks = () => {
  const offset = useUIStore((state) => state.offset);
  const limit = useUIStore((state) => state.limit);
    return useQuery<TaskResponse>({
      queryKey: ['tasks', offset, limit],
      queryFn: async () => {
        const { data } = await axios.get(`${BASE_URL}?limit=${limit}&offset=${offset}`);
        if (!data) {
          throw new Error("Error al obtener tareas");
        }
        return data;
      },
    });
  };

export const useAddTask = () => {
    const QueryClient = useQueryClient();
    return useMutation({
        mutationFn: async (text: string) => {
            const {data} = await axios.post(BASE_URL, { text });
            if (!data) {
                throw new Error("Error al agregar tarea");
            }
            return data;
        },
        onSuccess: () => {
            QueryClient.invalidateQueries({queryKey: ["tasks"]});
        },
    });
};

export const useToggleTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
        const { data } = await axios.put(`${BASE_URL}/${id}`, { completed });
        if (!data) {
          throw new Error("Error al actualizar tarea");
        }
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });
  };

  export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        await axios.delete(`${BASE_URL}/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });
  };

  export const useClearCompletedTasks = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async () => {
        await axios.delete(`${BASE_URL}/completed`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });
  };

