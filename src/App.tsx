import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoApp from "./components/Todo/TodoApp";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/todo" element={<TodoApp />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
