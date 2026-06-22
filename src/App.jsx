import { Routes, Route } from "react-router-dom";
import "./assets/styles/global.css";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import FindDonors from './pages/FindDonors/FindDonors'; 

// 🌟 Imported your new UserDashboard component folder structure
import UserDashboard from "./pages/UserDashboard/UserDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/find-donors" element={<FindDonors />} />
      
      {/* 🌟 New route added to match your user account panel entry */}
      <Route path="/dashboard" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;