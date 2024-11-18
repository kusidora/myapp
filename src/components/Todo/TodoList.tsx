import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "./types";

interface TodoListProps {
  todos: Todo[];
  editTask: (id: number) => void;
  editId: number | null;
  toggleCheck: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  editTask,
  editId,
  toggleCheck,
}) => {
  return (
    <>
      {/* {todos.length ? <h1 className="mb-10 text-center">ToDo一覧</h1> : ""} */}
      <div className="flex justify-center rounded min-h-60">
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              editTask={editTask}
              isEditing={todo.id === editId}
              toggleCheck={toggleCheck}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoList;
