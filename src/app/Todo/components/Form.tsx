import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaPlus, FaEdit } from "react-icons/fa";
import { useTodos } from "../../context/TodoContext";

const Form: React.FC = () => {
  const { state, dispatch, deleteCheckedTodos } = useTodos();
  const [text, setText] = useState("");

  useEffect(() => {
    if (state.editId !== null) {
      const currentTask = state.todos.find((todo) => todo.id === state.editId);
      if (currentTask) {
        setText(currentTask.text);
      }
    } else {
      setText("");
    }
  }, [state.editId, state.todos]);

  const handleSubmit = () => {
    if (!text.trim()) return;

    if (state.editId !== null) {
      dispatch({ type: "EDIT", id: state.editId, text });
    } else {
      dispatch({ type: "ADD", text });
    }
    setText(""); // 入力欄クリア
  };

  return (
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
          {state.editId !== null ? <FaEdit /> : <FaPlus />}
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
