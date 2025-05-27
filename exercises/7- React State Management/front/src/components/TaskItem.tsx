import type { Task } from "../types/Task";
import { useToggleTask, useDeleteTask } from "../hooks/useTasks";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const toogleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    toogleTask.mutate(
      {
        id: task.id,
        completed: !task.completed,
      },
      {
        onSettled: () => setIsToggling(false),
      }
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    deleteTask.mutate(task.id, {
      onSettled: () => setIsDeleting(false),
    });
  };

  return (
    <li className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mr-2"
        />
        <span className={task.completed ? "line-through text-gray-500" : ""}>
          {task.text}
        </span>
      </div>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700"
        disabled={isDeleting || isToggling}
      >
        {isDeleting ? 'Eliminando...' : '❌'}
      </button>
    </li>
  );
};
