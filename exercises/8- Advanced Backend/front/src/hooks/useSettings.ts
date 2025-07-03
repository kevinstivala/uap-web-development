import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "../store/useSettingsStore";
import { useEffect } from "react";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/settings`;

export const useFetchSettings = () => {
 // console.log("useFetchSettings", );
  const queryResult = useQuery({
    queryKey: ["userSettings", ],
    queryFn: async () => {
      const { data } = await axios.get(BASE_URL, { withCredentials: true });
      return data;
    },
     // Solo ejecuta si hay usuario
  });

  useEffect(() => {
    const settings = queryResult.data;
    if (!settings) return;
    if (settings.refreshInterval)
      useSettingsStore.getState().setRefetchInterval(settings.refreshInterval);
    if (settings.upperCaseDescription !== undefined)
      useSettingsStore.getState().setUpperCaseDescription(!!settings.upperCaseDescription);
    if (settings.paginationLimit)
      useSettingsStore.getState().setPaginationLimit(settings.paginationLimit);
  }, [queryResult.data]);

  return queryResult;
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: {
      refreshInterval?: number;
      upperCaseDescription?: boolean;
      paginationLimit?: number;
    }) => {
      await axios.put(BASE_URL, settings, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });
};