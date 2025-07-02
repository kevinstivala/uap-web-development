import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { LandingPage } from "./components/LandingPage";
import { BoardList } from "./components/BoardList";
import { TaskBoard } from "./components/TaskBoard";
import { Layout } from "./components/Layout";
import { Settings } from "./components/Settings";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";

// Crear ruta raíz con layout
const rootRoute = createRootRoute({
  component: Layout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginForm,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterForm,
});

// Ruta principal que muestra la lista de tableros
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => {
    const { user } = useAuthStore();
    return user ? (
      <ProtectedRoute>
        <BoardList />
      </ProtectedRoute>
    ) : (
      <LandingPage />
    );
  },
});

// Ruta para cada tablero individual
const boardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/board/$boardId/$name",
  component: () => (
    <ProtectedRoute>
      <TaskBoard />
    </ProtectedRoute>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  ),
});

// Configurar árbol de rutas
export const routeTree = rootRoute.addChildren([
  indexRoute,
  boardRoute,
  settingsRoute,
  loginRoute,
  registerRoute,
]);

// Crear router
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  // Configuración adicional de enrutamiento
  defaultPendingComponent: () => (
    <div className="p-2 text-center">Cargando...</div>
  ),
  defaultErrorComponent: ({ error }) => (
    <div className="p-2 text-center text-red-500">
      {error.message || "Error desconocido"}
    </div>
  ),
});

// Declarar tipos para TypeScript
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
