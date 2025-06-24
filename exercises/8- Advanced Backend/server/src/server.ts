import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { authMiddlewareCookies } from './middleware/auth.middleware';
import { authRoutes } from './routes/auth.routes';

const app = express();
const port = 3000;

// 1. Security middleware (first)
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// 2. Body parsing middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser(process.env.JWT_SECRET!)); // Use cookie parser with secret for signed cookies

// 3. Logging middleware
//app.use(requestLogger);

// 4. Authentication middleware (for protected routes)
app.use("/api/protected", authMiddlewareCookies);

// 5. Route handlers
app.use("/api/auth", authRoutes);
app.use("api/boards", boardRoutes);

// 6. Error handling middleware (last)
//app.use(errorHandler);

// 7. Health check's endpoint's
// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.get("/", (req, res) => {
  res.send("Backend Avanzado - Tarea 8 - TODO App");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/checkStatus`);
});

// CheckStatus check endpoint
app.get("/checkStatus", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});




// VERSION ANTERIOR DEL SISTEMA (TAREA 7) -> TERMINAR TAREA 8. ---------------------------------------------

// Logging para debugging
function logTasks(operation: string) {
  console.log(`[${operation}] Tasks:`, tasks);
}
// Logging para debugging
function logBoard(operation: string) {
  console.log(`[${operation}] Boards:`, boards);
}

//Añadido: Paginacion por server-side
app.get("/api/task", (req, res) => {
  const boardId = parseInt(req.query.boardId as string);
  const limit = parseInt(req.query.limit as string) || 5; // Limite por defecto
  const offset = parseInt(req.query.offset as string) || 0; // Offset por defecto
  const filter = (req.query.filter as string) || "all"; // Filtro por defecto

  let filteredTasks = tasks.filter((task) => task.boardId === boardId);

  //aplicar filtro
  if (filter === "activa") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  } else if (filter === "completada") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  const totalFilteredItems = filteredTasks.length;
  const paginatedTasks = filteredTasks.slice(offset, offset + limit);

  res.json({
    tasks: paginatedTasks,
    total: totalFilteredItems,
    limit,
    offset,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(totalFilteredItems / limit),
  });
});

app.post("/api/task", (req, res) => {
  const { text, boardId } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text es requerido" });
  }
  if (boardId === undefined || typeof boardId !== "number") {
    return res.status(400).json({ error: "BoardId es requerido" });
  }

  // Guardar la nueva tarea
  const newTask: Todo = {
    id: nextId++, // Usar e incrementar
    text,
    completed: false,
    boardId: boardId, // Asignar a un board por defecto si no se especifica
  };
  tasks.push(newTask);

  logTasks("POST");

  //Una unica respuesta
  return res.status(201).json(newTask);
});

app.put("/api/task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  const task = tasks.find((task) => task.id === id);

  if (task) {
    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;
    logTasks("UPDATE");
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/api/task/completed", (req, res) => {
  const completedCount = tasks.filter((task) => task.completed).length;
  // Filtrar tareas no completadas
  tasks = tasks.filter((task) => !task.completed);
  logTasks("DELETE_COMPLETED");
  // Enviar las tareas actualizadas
  return res.status(200).json({
    deletedCount: completedCount,
    remainingTasks: tasks,
  });
});

app.delete("/api/task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== id);
  logTasks("DELETE");
  res.status(204).send();
});

//BOARDS ROUTES:
app.get("/api/board", (req, res) => {
  res.json(boards);
});

app.post("/api/board", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Nombre es requerido" });
  }

  const newBoard: Board = {
    id: nextBoardId++, // Usar e incrementar
    name,
  };
  boards.push(newBoard);
  res.status(201).json(newBoard);
  logBoard("POST");
});

app.delete("/api/board/:id", (req, res) => {
  const id = parseInt(req.params.id);
  boards = boards.filter((board) => board.id !== id);
  tasks = tasks.filter((task) => task.boardId !== id); // Eliminar tareas asociadas
  res.status(204).send();
  logBoard("DELETE");
});


