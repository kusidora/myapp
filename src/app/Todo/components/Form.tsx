import React, { useState } from "react";
import { FaRegTrashAlt, FaPlus } from "react-icons/fa";
import { useTodos } from "../../context/TodoContext";

const Form: React.FC = () => {
  const { deleteCheckedTodos, addTodo } = useTodos();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    addTodo(text)
    setText(""); // 入力欄クリア
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full flex items-center h-30 ml-8 gap-4">
        <div className="flex-1">
          <input
            className="rounded-md w-full p-2"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            type="text"
            value={text}
            placeholder="タスクを入力"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="flex-none bg-blue-400 rounded-full text-white p-2 hover:translate-y-0.5 transition"
        >
          <FaPlus />
        </button>

        <button
          onClick={deleteCheckedTodos}
          className="flex-none bg-green-500 rounded-full text-white p-2 hover:translate-y-0.5 transition"
        >
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default Form;
