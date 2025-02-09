import React from "react";
import { Todo } from "../types";
import { FaEdit } from "react-icons/fa";

interface TodoItemProps {
  todo: Todo;
  editTask: (id: number) => void;
  isEditing: boolean;
  toggleCheck: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editTask,
  isEditing,
  toggleCheck,
}) => {
  return (
    <>
      <li
        className={` ${
          isEditing ? "bg-blue-900 rounded-xl p-3" : "p-3"
        } flex items-center`}
      >
        {/* <label htmlFor=""> */}
        <div className="flex items-center me-4">
          <input
            id="teal-checkbox"
            type="checkbox"
            onChange={() => toggleCheck(todo.id)}
            className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="teal-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 w-64 ml-4 truncate"
          >
            {todo.isChecked ? <s>{todo.text}</s> : todo.text}
          </label>
        </div>
        <button
          onClick={() => editTask(todo.id)}
          className="bg-orange-500 rounded-full text-white p-3 hover:translate-y-0.5 transform transition"
        >
          <FaEdit />
        </button>
        {/* </label> */}
      </li>
    </>
  );
};

export default TodoItem;
