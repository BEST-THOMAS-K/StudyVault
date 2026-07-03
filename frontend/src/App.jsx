import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Notes from "./pages/Notes";
import AI from "./pages/AI";
import PYQs from "./pages/PYQs";
import Team from "./pages/Team";
import Login from "./pages/Login";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/ai" element={<AI />} />
      <Route path="/pyqs" element={<PYQs />} />
      <Route path="/team" element={<Team />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;