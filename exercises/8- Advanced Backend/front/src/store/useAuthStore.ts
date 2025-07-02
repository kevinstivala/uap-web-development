import { create } from "zustand";
import axios from "axios";

interface AuthState {
  user: null | { id: string; username: string };
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: (strict: boolean) => Promise<void>;
}
let isManualLogout = false;
let wasLoggedIn = false;
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { username, password },
        {
          withCredentials: true,
        }
      );
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/user`,
        {
          withCredentials: true,
        }
      );
      wasLoggedIn = true;
      set({ user: data, loading: false, error: null });
      return true;
    } catch (error: any) {
      set({ error: "Login fallido", loading: false });
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  },
  logout: async () => {
    isManualLogout = true;
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    set({ user: null, loading: false, error: null });
    setTimeout(() => {isManualLogout = false;}, 1000);
    wasLoggedIn = false;
  },
  fetchUser: async (strict = false) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/user`,
        {
          withCredentials: true,
        }
      );
      wasLoggedIn = true;
      set({ user: data, loading: false, error: null });
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        set({ user: null, loading: false, error: null });
        // Si es modo estricto (rutas protegidas), muestra advertencia y redirige
        if (strict && !isManualLogout && wasLoggedIn) {
          import("react-hot-toast").then(({ default: toast }) => {
            toast.error(
              "Sesión expirada. Por favor, inicia sesión nuevamente."
            );
          });
        }
        wasLoggedIn = false;
      } else {
        set({
          user: null,
          loading: false,
          error: "Error al obtener el usuario",
        });
        console.error("Error al obtener el usuario:", error);
      }
    }
  },
}));
