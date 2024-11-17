import React, { useState } from "react";
import TodoForm from "./TodoForm";
import { Todo } from "./types";
import TodoList from "./TodoList";

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const addOrEditTask = (text: string) => {
    if (!text.trim()) return;

    if (editId !== null) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === editId ? { ...todo, text } : todo))
      );
      setEditId(null);
    } else {
      const id = Date.now();
      setTodos([...todos, { id: id, text }]);
    }
  };

  const deleteTask = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTask = (id: number) => {
    setEditId(id);
  };

  return (
    <>
      <div className="pl-1 sm:ml-64">
        <TodoForm
          todos={todos}
          editId={editId}
          addOrEditTask={addOrEditTask}
          setEditId={setEditId}
        />
        <TodoList
          todos={todos}
          editId={editId}
          editTask={editTask}
          deleteTask={deleteTask}
        />
      </div>
    </>
  );
};

export default TodoApp;
