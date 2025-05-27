import { useState } from "react";
import "./App.css";
import {
  useTasks,
  useAddTask,
  useDeleteTask,
  useToggleTask,
  useClearCompletedTask,
} from "./hooks/useTasks";

function App() {
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "activa" | "completada">("all");

  const { data: tasks = [], isLoading, error } = useTasks();
  const addTask = useAddTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const clearCompletedTasks = useClearCompletedTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask.mutate(newTask);
    setNewTask("");
  };

  //Funcion para filtrar tareas
  const filteredTasks = tasks.filter((task: any) => {
    if (filter === "activa") return !task.completed;
    if (filter === "completada") return task.completed;
    return true; //all
  });

  return (
    <>
      <div className="bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-4 mx-auto max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4 p-4">
            TODO - REACT Tarea 7
          </h1>
          <form
            className="flex justify-center mb-4 p-2"
            onSubmit={handleSubmit}
          >
            <input
              className="border border-gray-300 rounded-md mr-2 px-4 py-2 focus:outline-none focus:border-green-500"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTask.mutate(e as any);
                }
              }}
              placeholder="Agregar nueva tarea"
              required
            />
            <button
              className="bg-green-500 text-white hover:bg-green-700 font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Agregar
            </button>
          </form>

          {isLoading && <p>Cargando...</p>}
          {error && <p>Error al cargar tareas</p>}

          <ul className="list-none p-0">
            {filteredTasks.map((task: any) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) =>
                      toggleTask.mutate({
                        id: task.id,
                        completed: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className={task.completed ? "line-through" : ""}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <button
              className="mr-10 bg-gray-500 hover:bg-gray-700 text-white font-light py-0.5 px-2 rounded mt-2"
              onClick={() => clearCompletedTasks.mutate()}
            >
              Limpiar
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
                filter === "all" ? "bg-blue-100" : ""
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("activa")}
              className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
                filter === "activa" ? "bg-blue-100" : ""
              }`}
            >
              Activas
            </button>
            <button
              onClick={() => setFilter("completada")}
              className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
                filter === "completada" ? "bg-blue-100" : ""
              }`}
            >
              Completadas
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
