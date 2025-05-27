import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:3000/api/task";

export const useTasks = () =>
    useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error("Error al obtener tareas");
            }
            return response.json();
        },
    });

export const useAddTask = () => {
    const QueryClient = useQueryClient();

    return useMutation({
        mutationFn: async (text: string) => {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error("Error al agregar tarea");
            }

            return response.json();
        },
        onSuccess: () => {
            QueryClient.invalidateQueries({queryKey: ["tasks"]});
        },
    });
};

export const useToggleTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (task: { id: string; completed: boolean }) => {
            const response = await fetch(`${BASE_URL}/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: task.completed }), // Removed the negation here
            });

            if (!response.ok) {
                throw new Error("Error al actualizar tarea");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["tasks"]});
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar tarea");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
};

export const useClearCompletedTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`${BASE_URL}/completed`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar tareas completadas");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["tasks"]});
        },
    });
}

