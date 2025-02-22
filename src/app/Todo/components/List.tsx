import React from "react";
import TodoItem from "./Item";
import { useTodos } from "../../context/TodoContext";

const TodoList: React.FC = () => {
  const { state, dispatch } = useTodos();

  return (
    <>
      <div className="flex justify-center rounded min-h-60">
        <ul>
          {state.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={todo.id === state.editId}
              editTask={(id: number | null) =>
                dispatch({ type: "SET_EDIT_ID", id })
              }
              toggleCheck={() => dispatch({ type: "TOGGLE", id: todo.id })}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoList;
