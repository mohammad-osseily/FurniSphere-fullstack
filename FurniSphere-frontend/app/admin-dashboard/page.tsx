"use client";

import React from "react";
import AdminSidebar from "../components/AdminSidebar"; // Assuming the sidebar is in the auth folder
import UserMangment from "../components/UserMangment";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 bg-base-100">
        
        {/* Render the User Management component */}
        <UserMangment />
      </div>
    </div>
  );
};

export default AdminDashboard;
