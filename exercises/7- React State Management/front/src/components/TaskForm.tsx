import { useState } from "react";
import { useAddTask } from "../hooks/useTasks";

export const TaskForm = () => {
  const [newTask, setNewTask] = useState("");
  const addTask = useAddTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask.mutate(newTask, {
      onSuccess: () => setNewTask(""),
    });
  };

  return (
    <form
      className="flex flex-col items-center justify-center mb-4 p-2"
      onSubmit={handleSubmit}
    >
      <input
        className="border border-gray-300 rounded-md px-4 py-2 mb-2 w-full focus:outline-none focus:border-green-500"
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
        disabled={addTask.isPending}
      />
      <button
        className={`bg-green-500 text-white font-bold py-2 px-4 rounded-full w-full ${
          addTask.isPending
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-700"
        }`}
        type="submit"
        disabled={addTask.isPending}
      >
        {addTask.isPending ? "Agregando..." : "Agregar"}
      </button>
      {addTask.isError && (
        <p className="text-red-500 text-sm mt-2">Error al agregar la tarea. Intenta nuevamente.</p>
      )}
    </form>
  );
};
