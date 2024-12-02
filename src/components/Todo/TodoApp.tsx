import React, { useState } from "react";
import TodoForm from "./TodoForm";
import { Todo } from "./types";
import TodoList from "./TodoList";
import { invoke } from "@tauri-apps/api/core";

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // useEffect(() => {
  //   setTodos(invoke("get_to_database"));
  // }, []);

  const addOrEditTask = async (text: string) => {
    if (!text.trim()) return;

    if (editId !== null) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === editId ? { ...todo, text } : todo))
      );
      setEditId(null);
    } else {
      const id = Date.now();
      setTodos([...todos, { id, text, isChecked: false }]);
      // insertする
      try {
        await invoke("add_to_database", {
          id: id,
          text: text,
          isComplete: false,
        });
        // console.log(message);
      } catch (e) {
        console.log(e);
      }
    }
  };

  // チェックボックスの状態を切り替え
  const toggleCheck = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo
      )
    );
    // updateする
  };

  // チェックされているタスクを削除する
  const deleteTask = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.isChecked));
    // deleteする
  };

  // タスクを編集する
  const editTask = (id: number) => {
    setEditId(id);
  };

  return (
    <>
      <div className="sm:ml-64">
        <TodoForm
          todos={todos}
          editId={editId}
          addOrEditTask={addOrEditTask}
          setEditId={setEditId}
          deleteTask={deleteTask}
        />
        <TodoList
          todos={todos}
          editId={editId}
          editTask={editTask}
          toggleCheck={toggleCheck}
        />
      </div>
    </>
  );
};

export default TodoApp;
