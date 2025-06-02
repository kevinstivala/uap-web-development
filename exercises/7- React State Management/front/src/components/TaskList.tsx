import { useTasks } from "../hooks/useTasks";
import { useUIStore } from "../store/useUIStore";
import { TaskItem } from "./TaskItem";
import { Pagination } from "./Pagination";

export const TaskList = () => {
  const { data, isLoading, error } = useTasks();
  const filter = useUIStore((state) => state.filter);

  const filteredTasks = data?.tasks.filter((task) => {
        if (filter === "activa") return !task.completed;
        if (filter === "completada") return task.completed;
        return true;
    }) || [];

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
          {data && data.total > 0 && (
            <Pagination total={data.total} />
          )}
        </>
      )}
    </div>
  );
};
