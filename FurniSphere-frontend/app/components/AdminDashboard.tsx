"use client";

import React from "react";
import { Box, CssBaseline, Typography } from "@mui/material";
import AdminSidebar from "./AdminSidebar"; // Import the new sidebar component

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: 240, flexShrink: 0 }}>
        <AdminSidebar /> {/* Render the reusable AdminSidebar */}
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "64px" }}>
        {" "}
        {/* Adjust margin top based on the navbar */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
