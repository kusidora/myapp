import TodoForm from "./components/Form";
import TodoList from "./components/List";
import { TodoProvider } from "../context/TodoContext";

const TodoApp: React.FC = () => {
  return (
    <TodoProvider>
      <div className="sm:ml-64">
        <TodoForm />
        <TodoList />
      </div>
    </TodoProvider>
  );
};

export default TodoApp;
