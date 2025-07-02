import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "@tanstack/react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, fetchUser, loading } = useAuthStore();

  useEffect(() => {
    fetchUser(true); // o simplemente fetchUser();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
