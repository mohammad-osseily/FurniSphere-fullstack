"use client";

import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AddProduct from "../../components/AddProduct";

export default function ProductPage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar toggle for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {sidebarOpen ? (
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-10 w-fit bg-transperant shadow-lg transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-auto
        `}
      >
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ">
        <AddProduct />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
