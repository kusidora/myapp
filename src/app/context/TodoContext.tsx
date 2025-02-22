import { useReducer, createContext, useContext, useEffect } from "react";
import { Todo } from "../types";
import { invoke } from "@tauri-apps/api/core";

interface State {
  todos: Todo[];
  editId: number | null;
}

type Action =
  | { type: "ADD"; text: string }
  | { type: "TOGGLE"; id: number }
  | { type: "DELETE" }
  | { type: "SET_EDIT_ID"; id: number | null }
  | { type: "SET_TODOS"; todos: Todo[] };

const todoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD":
      if (!action.text.trim()) return state;
      const newTodo: Todo = {
        id: Date.now(),
        text: action.text,
        isChecked: false,
      };
      return { ...state, todos: [...state.todos, newTodo] };

    case "TOGGLE":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, isChecked: !todo.isChecked } : todo
        ),
      };

    case "DELETE":
      return { ...state, todos: state.todos.filter((todo) => !todo.isChecked) };

    case "SET_EDIT_ID":
      return { ...state, editId: action.id };

    case "SET_TODOS":
      return { ...state, todos: action.todos };

    default:
      return state;
  }
};

const TodoContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
      deleteCheckedTodos: () => void;
    }
  | undefined
>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    editId: null,
  });

  // DB からタスクを取得して state にセット
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromDB: Todo[] = await invoke("get_to_database");
        dispatch({ type: "SET_TODOS", todos: todosFromDB });
      } catch (e) {
        console.error("DBからのデータ取得に失敗:", e);
      }
    };
    fetchTodos();
  }, []);

  // `ADD` された新規タスクを DB に追加
  useEffect(() => {
    const saveTodoToDB = async () => {
      const lastTodo = state.todos[state.todos.length - 1];
      if (lastTodo) {
        try {
          await invoke("add_to_database", {
            id: lastTodo.id,
            text: lastTodo.text,
            isComplete: false,
          });
        } catch (error) {
          console.error("Error saving todo to DB:", error);
        }
      }
    };

    saveTodoToDB();
  }, [state.todos]);

  // **削除処理を関数にまとめ、手動で呼び出す**
  const deleteCheckedTodos = async () => {
    const checkedTodos = state.todos.filter((todo) => todo.isChecked);
    for (const todo of checkedTodos) {
      try {
        await invoke("delete_from_database", { id: todo.id });
      } catch (error) {
        console.error("削除エラー:", error);
      }
    }
    dispatch({ type: "DELETE" }); // ステートを更新
  };

  return (
    <TodoContext.Provider value={{ state, dispatch, deleteCheckedTodos }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
