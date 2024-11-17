import React from "react";
import { Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  deleteTask: (id: number) => void;
  editTask: (id: number) => void;
  isEditing: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTask,
  editTask,
  isEditing,
}) => {
  return (
    <>
      <li className={`mt-4 ${isEditing ? "bg-red-400" : ""} flex items-center`}>
        <span className="inline-block w-64 truncate">{todo.text}</span>
        <button
          onClick={() => editTask(todo.id)}
          className="ml-4 bg-blue-400 p-1 rounded-xl text-white w-20 hover:translate-y-0.5 transform transition"
        >
          Edit
        </button>
        <button
          onClick={() => deleteTask(todo.id)}
          className="ml-4 bg-red-400 p-1 rounded-xl text-white w-20 hover:translate-y-0.5 transform transition"
        >
          Delete
        </button>
      </li>
    </>
  );
};

export default TodoItem;
