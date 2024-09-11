import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NeovimSimulator from "@/components/playground";
import Layout from "./components/layout/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="home w-full">
              <Layout />
            </div>
          }
        />
        <Route path="/playground" element={<NeovimSimulator />} />
      </Routes>
    </Router>
  );
}

export default App;
