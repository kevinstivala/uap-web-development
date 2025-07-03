import type { Task } from "../types/Task";
import { useToggleTask, useDeleteTask, useEditTask } from "../hooks/useTasks";
import { useState } from "react";
import { useSettingsStore } from '../store/useSettingsStore';


interface TaskItemProps {
  task: Task;
  role: string;
}

export const TaskItem = ({ task, role }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const editTask = useEditTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();

  const upperCaseDescription = useSettingsStore((s) => s.upperCaseDescription);
  const displayText = upperCaseDescription ? task.text.toUpperCase() : task.text;

  const handleToggle = async () => {
    setIsToggling(true);
    toggleTask.mutate(
      {
        id: task.id,
        completed: !task.completed,
        boardId: String(task.boardId),
      },
      {
        onSettled: () => setIsToggling(false),
      }
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    deleteTask.mutate(
      { id: String(task.id), boardId: String(task.boardId) },
      {
        onSettled: () => setIsDeleting(false),
      }
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() === task.text) {
      setIsEditing(false);
      return;
    }
    editTask.mutate(
      { id: task.id, text: editText.trim(), boardId: String(task.boardId) },
      {
        onSettled: () => setIsEditing(false),
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(task.text);
  };

  // Solo dueño y editor pueden editar/eliminar
  const canEdit = role === "dueño" || role === "editor";

  return (
    <li className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mr-2"
          disabled={isEditing || !canEdit}
        />
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          <span className={task.completed ? "line-through text-gray-500" : ""}>
            {displayText}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="text-green-500 hover:text-green-700"
              disabled={editTask.isPending}
            >
              💾
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              ❌
            </button>
          </>
        ) : (
          <>
            {canEdit && (
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700"
              >
                ✏️
              </button>
            )}
            {canEdit && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "⌛" : "🗑️"}
              </button>
            )}
          </>
        )}
      </div>
    </li>
  );
};
