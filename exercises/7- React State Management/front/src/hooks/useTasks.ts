import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types/Task";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/task";


export const useTasks = () => {
    return useQuery<Task[], Error>({
      queryKey: ['tasks'],
      queryFn: async () => {
        const { data } = await axios.get(BASE_URL);
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

