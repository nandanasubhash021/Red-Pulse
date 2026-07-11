import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import FindDonors from '../pages/FindDonors/FindDonors'; 
import UserDashboard from "../pages/UserDashboard/UserDashboard";

// New Resource Discovery Channels
import FindBlood from '../pages/FindBlood/FindBlood';
import FindBloodBanks from '../pages/FindBloodBanks/FindBloodBanks';

// Unified Registration System Flow Mapping
import Register from "../pages/Register/Register";                  
import UserRegister from "../pages/Register/UserRegister";          
import BloodBankRegister from "../pages/Register/BloodBankRegister";

// Unified Login System Flow Mapping
import Login from "../pages/Login/Login";                            
import UserLogin from "../pages/Login/UserLogin";                    
import BloodBankLogin from "../pages/Login/BloodBankLogin";          

// Dedicated Workspace Panels
import BloodBankDashboard from "../pages/BloodBankDashboard/BloodBankDashboard";
 

function AppRoutes() {
  return (
    <Routes>
      {/* Informational Static Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Resource Discovery Channels */}
      <Route path="/find-blood" element={<FindBlood />} />
      <Route path="/find-blood-banks" element={<FindBloodBanks />} />
      <Route path="/find-donors" element={<FindDonors />} />
      <Route path="/dashboard" element={<UserDashboard />} />

      {/* Registration System Routing */}
      <Route path="/register" element={<Register />} />
      <Route path="/register/user" element={<UserRegister />} />
      <Route path="/register/blood-bank" element={<BloodBankRegister />} />

      {/* Login System Routing */}
      <Route path="/login" element={<Login />} />
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/login/blood-bank" element={<BloodBankLogin />} />

      {/* Blood Bank Operation Panels */}
      <Route path="/blood-bank/dashboard" element={<BloodBankDashboard />} />
      
      {/* 👑 Administrative Dashboard Portal */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      {/* Sidebar Navigation Fallback Redirects */}
      <Route path="/blood-bank/inventory" element={<Navigate to="/blood-bank/dashboard" replace />} />
      <Route path="/blood-bank/profile" element={<Navigate to="/blood-bank/dashboard" replace />} />
      
      {/* General Catch-All Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;