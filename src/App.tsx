import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoApp from "./app/Todo/App";
import Timer from "./app/Timer/Timer";
import Side from "./components/ui/Side";

const App: React.FC = () => {
  return (
    <>
      <Side />
      <Router>
        <Routes>
          <Route path="/todo" element={<TodoApp />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
