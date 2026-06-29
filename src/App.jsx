import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/styles/global.css";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import FindDonors from './pages/FindDonors/FindDonors'; 
import UserDashboard from "./pages/UserDashboard/UserDashboard";

// 🚀 NEW INTERFACE ROUTING CHANNELS (Following your folder name convention)
import FindBlood from './pages/FindBlood/FindBlood';
import FindBloodBanks from './pages/FindBloodBanks/FindBloodBanks';

// 🔐 Registration System Flow Mapping
import Register from "./pages/Register/Register"; 
import UserRegister from "./pages/Register/UserRegister"; 
import BloodBankRegister from "./pages/Register/BloodBankRegister";

// 🔓 Login System Flow Mapping
import Login from "./pages/Login/Login"; 
import UserLogin from "./pages/Login/UserLogin"; 
import BloodBankLogin from "./pages/Login/BloodBankLogin"; 

// 📊 Dedicated Dashboard System Workspace Panels
import BloodBankDashboard from "./pages/BloodBankDashboard/BloodBankDashboard";

function App() {
  return (
    <Routes>
      {/* Informational Static Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* 🚀 NEW RESOURCE DISCOVERY CHANNEL HUBS */}
      <Route path="/find-blood" element={<FindBlood />} />
      <Route path="/find-blood-banks" element={<FindBloodBanks />} />
      
      <Route path="/find-donors" element={<FindDonors />} />
      <Route path="/dashboard" element={<UserDashboard />} />

      {/* 🚀 REGISTRATION ROUTING SYSTEM */}
      <Route path="/register" element={<Register />} />
      <Route path="/register/user" element={<UserRegister />} />
      <Route path="/register/blood-bank" element={<BloodBankRegister />} />

      {/* 🚀 LOGIN ROUTING SYSTEM */}
      <Route path="/login" element={<Login />} />
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/login/blood-bank" element={<BloodBankLogin />} />

      {/* 🚀 BLOOD BANK MANAGEMENT INTERFACES */}
      <Route path="/blood-bank/dashboard" element={<BloodBankDashboard />} />

      {/* 🌟 CRITICAL FIX: The catch-all (*) route.
        If any invalid URL is hit, the user is redirected back home 
        instead of seeing a blank white page.
      */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;