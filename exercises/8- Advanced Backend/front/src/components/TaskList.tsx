import { useTasks } from "../hooks/useTasks";
import { TaskItem } from "./TaskItem";
import { Pagination } from "./Pagination";
import { useEffect } from "react";
import { useUIStore } from "../store/useUIStore";

type TaskFormProps = {
  boardId: string;
  role: string;
};

export const TaskList = ({ boardId, role }: TaskListProps) => {
  const { data, isLoading, error } = useTasks(boardId);
  const setOffset = useUIStore((state) => state.setOffset);
  const filter = useUIStore((state) => state.filter);

  // Reset pagination when filter changes
  useEffect(() => {
    setOffset(0);
  }, [filter, setOffset]);

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
      {data?.tasks?.length === 0 && (
        <p className="text-center text-gray-400 my-4">No hay tareas.</p>
      )}
      <ul>
        {data?.tasks?.map((task: any) => (
          <TaskItem key={task.id} task={task} role={role} />
        ))}
      </ul>
      <Pagination total={data?.total || 0} />
    </div>
  );
};
