import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const BASE_URL = import.meta.env.VITE_API_URL;

export const useShareBoard = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      targetUserId,
      role,
    }: {
      targetUserId: string;
      role: string;
    }) => {
      await axios.post(
        `${BASE_URL}/api/board/${boardId}/share`,
        { targetUserId, role },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};

export const useChangeUserRole = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({targetUserId, newRole}: {targetUserId: string; newRole: string}) => {
      await axios.put(`${BASE_URL}/api/board/${boardId}/role`, {targetUserId, newRole}, {withCredentials: true});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

export const useRemoveUserFromBoard = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ targetUserId }: { targetUserId: string }) => {
      await axios.delete(`${BASE_URL}/api/board/${boardId}/user`, {
        data: { targetUserId },
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};

export const useAllUsers = (excludeUserId?: string) =>
  useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/list`, { withCredentials: true });
      console.log("Usuarios disponibles para compartir:", data);
      return data.filter((u: any) => u.id !== excludeUserId);
    },
  });