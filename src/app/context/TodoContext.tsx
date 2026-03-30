import { useReducer, createContext, useContext, useEffect } from "react";
import { Todo } from "../types";
import { invoke } from "@tauri-apps/api/core";

interface State {
  todos: Todo[];
  editId: number | null;
}

type Action =
  | { type: "ADD"; todo: Todo }
  | { type: "TOGGLE"; id: number }
  | { type: "DELETE" }
  | { type: "SET_EDIT_ID"; id: number | null }
  | { type: "SET_TODOS"; todos: Todo[] };

const todoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD":
      return { ...state, todos: [...state.todos, action.todo] };

    case "TOGGLE":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, isComplete: !todo.isComplete } : todo
        ),
      };

    case "DELETE":
      return { ...state, todos: state.todos.filter((todo) => !todo.isComplete) };

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
    addTodo: (text: string) => void;
    toggleTodo: (id: number) => void;
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

  // **削除処理を関数にまとめ、手動で呼び出す**
  const deleteCheckedTodos = async () => {
    const checkedTodos = state.todos.filter((todo) => todo.isComplete);
    try {
      await Promise.all(
        checkedTodos.map((todo) =>
          invoke("delete_from_database", { id: todo.id })
        )
      );
    } catch (error) {
      console.error("削除エラー:", error);
    }
    dispatch({ type: "DELETE" }); // ステートを更新
  };

  const addTodo = async (text: string) => {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      text,
      isComplete: false,
    };

    try {
      await invoke("add_to_database", {
        id: newTodo.id,
        text: newTodo.text,
        isComplete: false,
      });

      dispatch({ type: "ADD", todo: newTodo }); // state更新
    } catch (error) {
      console.error("追加エラー:", error);
    }
  };

  const toggleTodo = async (id: number) => {
    const target = state.todos.find((t) => t.id === id);
    if (!target) return;

    const newChecked = !target.isComplete;

    try {
      await invoke("update_database", {
        id,
        isComplete: newChecked,
      });

      dispatch({ type: "TOGGLE", id });
    } catch (error) {
      console.error("チェック更新エラー:", error);
    }
  };

  return (
    <TodoContext.Provider value={{ state, dispatch, deleteCheckedTodos, addTodo, toggleTodo }}>
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
