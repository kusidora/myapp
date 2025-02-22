import React, { useState, useEffect } from "react";
import { Todo } from "../../types";
import { invoke } from "@tauri-apps/api/core";
import { useTodos } from "../../context/TodoContext";

interface TodoItemProps {
  todo: Todo;
  editTask: (id: number | null) => void;
  isEditing: boolean;
  toggleCheck: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editTask,
  isEditing,
  toggleCheck,
}) => {
  const [editText, setEditText] = useState(todo.text);
  const { dispatch, state } = useTodos();

  useEffect(() => {
    setEditText(todo.text); // ✅ todo.text が更新されたら editText も更新
  }, [todo.text]);

  // 編集確定処理
  const handleEditSubmit = async () => {
    if (!editText.trim()) {
      editTask(null);
      return;
    }

    try {
      await invoke("update_database", {
        id: todo.id,
        text: editText,
      });
      console.log(`タスク ${todo.id} を更新しました`);

      // ✅ Reducer の `SET_TODOS` を利用して、state を更新
      dispatch({
        type: "SET_TODOS",
        todos: state.todos.map((t) =>
          t.id === todo.id ? { ...t, text: editText } : t
        ),
      });
    } catch (error) {
      console.error("更新エラー:", error);
    }

    editTask(null);
  };

  return (
    <li
      className={`${
        isEditing ? "bg-blue-900 rounded-xl p-3" : "p-3"
      } flex items-center`}
    >
      <div className="flex items-center me-4">
        <input
          id={`checkbox-${todo.id}`}
          type="checkbox"
          checked={todo.isChecked}
          onChange={() => toggleCheck(todo.id)}
          className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        {isEditing ? (
          // ✅ 編集モードのときは input を表示
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit} // ✅ フォーカスが外れたら保存＆編集モード解除
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSubmit(); // ✅ Enterキーで確定
            }}
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 w-64 ml-4 truncate bg-gray-100 dark:bg-gray-700 p-1 rounded"
            autoFocus
          />
        ) : (
          // ✅ 通常モードのときはテキストを表示
          <label
            onClick={() => editTask(todo.id)}
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 w-64 ml-4 truncate"
          >
            {todo.isChecked ? <s>{todo.text}</s> : todo.text}
          </label>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
