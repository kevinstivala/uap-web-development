import { useTasks } from "../hooks/useTasks";
import { useUIStore } from "../store/useUIStore";
import { TaskItem } from "./TaskItem";

export const TaskList = () => {
  const { data: tasks = [], isLoading, error } = useTasks();
  const filter = useUIStore((state) => state.filter);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "activa") return !task.completed;
    if (filter === "completada") return task.completed;
    return true; // all
  });

  return (
    <div>
      {isLoading && (
        <p className="text-center text-blue-500 my-4">Cargando tareas...</p>
      )}
      {error && (
        <p className="text-center text-red-500 my-4">
          Error al cargar las tareas. Intenta nuevamente.
        </p>
      )}
      {!isLoading && !error && (
        <>
          <ul className="list-none p-0">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
