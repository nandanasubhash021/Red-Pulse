import { Routes, Route } from "react-router-dom";
import "./assets/styles/global.css";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import FindDonors from './pages/FindDonors/FindDonors'; // Imported page entry

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* The missing URL route path matching your search interface */}
      <Route path="/find-donors" element={<FindDonors />} />
    </Routes>
  );
}

export default App;