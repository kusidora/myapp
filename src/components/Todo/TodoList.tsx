import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "./types";

interface TodoListProps {
  todos: Todo[];
  deleteTask: (id: number) => void;
  editTask: (id: number) => void;
  editId: number | null;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTask,
  editTask,
  editId,
}) => {
  return (
    <>
      {/* {todos.length ? <h1 className="mb-10 text-center">ToDo一覧</h1> : ""} */}
      <div className="flex justify-center h-svh  rounded bg-gray-50 dark:bg-gray-800">
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTask={deleteTask}
              editTask={editTask}
              isEditing={todo.id === editId}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoList;
