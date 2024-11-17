import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Side from "./components/ui/Side";
import TodoApp from "./components/Todo/TodoApp";

const App: React.FC = () => {
  return (
    <>
      <Side />
      <BrowserRouter>
        <Routes>
          <Route path="/todo" element={<TodoApp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
