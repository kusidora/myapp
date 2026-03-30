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
    <div className="flex justify-center h-40 rounded">
      <div className="mt-8">
        <input
          className="rounded-md h-8 p-2 w-fit"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(); // ✅ Enterキーで確定
          }}
          type="text"
          value={text}
          placeholder="タスクを入力"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 ml-4 bg-blue-400 rounded-full text-white p-3 hover:translate-y-0.5 transform transition"
        >
          <FaPlus />
        </button>

        <button
          onClick={deleteCheckedTodos}
          className="mt-4 ml-4 bg-green-500 rounded-full text-white p-3 hover:translate-y-0.5 transform transition"
        >
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default Form;
