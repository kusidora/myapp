import React, { useState, useEffect } from "react";
import { Todo } from "../types";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

interface TodoFormProps {
  addOrEditTask: (text: string) => void;
  editId: number | null;
  todos: Todo[];
  setEditId: React.Dispatch<React.SetStateAction<number | null>>;
  deleteTask: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({
  addOrEditTask,
  editId,
  todos,
  deleteTask,
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (editId !== null) {
      const currentTask = todos.find((todo) => todo.id === editId);
      if (currentTask) {
        setText(currentTask.text);
      }
    } else {
      setText("");
    }
  }, [editId, todos]);

  const handleSubmit = () => {
    addOrEditTask(text);
    setText(""); // 入力欄クリア
  };

  return (
    <>
      <div className="flex justify-center h-40 rounded">
        <div className="mt-8">
          <input
            className="rounded-md h-8 p-2 w-fit"
            onChange={(e) => setText(e.target.value)}
            type="text"
            value={text}
            placeholder="タスクを入力"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 ml-4 bg-blue-400 rounded-full text-white p-3 hover:translate-y-0.5 transform transition"
          >
            {editId !== null ? <FaEdit /> : <FaPlus />}
          </button>

          <button
            onClick={deleteTask}
            className="mt-4 ml-4 bg-green-500 rounded-full text-white p-3 hover:translate-y-0.5 transform transition"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      </div>
    </>
  );
};

export default TodoForm;
