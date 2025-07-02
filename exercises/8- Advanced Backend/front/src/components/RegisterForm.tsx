import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Usuario Registrado. Ahora puedes iniciar sesión.");
      navigate({ to: "/login" });
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        "Error al registrar usuario. Intenta nuevamente.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/login" })}
          className="text-blue-500 mb-4 block hover:underline"
        >
          ← Volver al login
        </button>
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
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
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </>
  );
};
