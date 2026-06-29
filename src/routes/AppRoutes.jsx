import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";

// Unified Registration System Flow Mapping
import Register from "../pages/Register/Register";                  // Choice Gate
import UserRegister from "../pages/Register/UserRegister";          // Your migrated original code
import BloodBankRegister from "../pages/Register/BloodBankRegister";// New center entry form

// Unified Login System Flow Mapping
import Login from "../pages/Login/Login";                            // Choice Gate
import UserLogin from "../pages/Login/UserLogin";                    // Your migrated original code
import BloodBankLogin from "../pages/Login/BloodBankLogin";          // New center auth form

// New Dedicated Internal Workspaces
import BloodBankDashboard from "../pages/BloodBankDashboard/BloodBankDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Informational Static Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* REGISTRATION ROUTING SYSTEM */}
      <Route path="/register" element={<Register />} />
      <Route path="/register/user" element={<UserRegister />} />
      <Route path="/register/blood-bank" element={<BloodBankRegister />} />

      {/* LOGIN ROUTING SYSTEM */}
      <Route path="/login" element={<Login />} />
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/login/blood-bank" element={<BloodBankLogin />} />

      {/* BLOOD BANK OPERATION PANELS */}
      <Route path="/blood-bank/dashboard" element={<BloodBankDashboard />} />
      
      {/* Sidebar Navigation Fallback Redirects */}
      <Route path="/blood-bank/inventory" element={<Navigate to="/blood-bank/dashboard" replace />} />
      <Route path="/blood-bank/profile" element={<Navigate to="/blood-bank/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;