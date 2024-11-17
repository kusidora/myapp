import React, { useState, useEffect } from "react";
import { Todo } from "./types";

interface TodoFormProps {
  addOrEditTask: (text: string) => void;
  editId: number | null;
  todos: Todo[];
  setEditId: React.Dispatch<React.SetStateAction<number | null>>;
}

const TodoForm: React.FC<TodoFormProps> = ({
  addOrEditTask,
  editId,
  todos,
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (editId !== null) {
      const currentTask = todos.find((todo) => todo.id === editId);
      if (currentTask) setText(currentTask.text);
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
      <div className="flex justify-center h-40  rounded bg-gray-50 dark:bg-gray-800">
        <div className="mt-8">
          <p>タスクを追加してください</p>
          <input
            className="rounded-md h-8"
            onChange={(e) => setText(e.target.value)}
            type="text"
            value={text}
          />

          <button
            onClick={handleSubmit}
            className="mt-4 ml-4 bg-blue-400 p-1 rounded-xl text-white w-20 hover:translate-y-0.5 transform transition"
          >
            {editId !== null ? "Edit" : "Add"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TodoForm;
