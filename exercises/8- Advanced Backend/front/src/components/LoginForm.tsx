import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: "/" });
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const success = await login(username, password);
      if (success) {
        toast.success("Inicio de sesión exitoso");
        navigate({ to: "/" });
      } else {
        toast.error("Usuario o contraseña incorrectos");
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        "Error al iniciar sesión. Intenta nuevamente.";
      toast.error(msg);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/register" })}
          className="text-blue-500 block hover:underline m-2 mx-auto"
          style={{ display: "block", textAlign: "center" }}
        >
          Registrarse
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </>
  );
};
