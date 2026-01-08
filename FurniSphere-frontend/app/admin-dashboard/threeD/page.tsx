"use client";

import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import ThreeDManipulation from "../../components/ThreeDManipulation";
import Add3DProduct from "../../components/Add3DProduct";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div className="p-3">{children}</div>}
    </div>
  );
}

export default function ThreeDPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <h3 className="text-gray-700 text-3xl font-medium mb-4">
            3D Product Management
          </h3>
          <div className="border-b border-gray-200">
            <nav
              className="-mb-px flex space-x-8"
              aria-label="3D product management tabs"
            >
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  tabValue === 0
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => handleTabChange(0)}
              >
                Manipulate 3D Products
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  tabValue === 1
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => handleTabChange(1)}
              >
                Add 3D Product
              </button>
            </nav>
          </div>
          <TabPanel value={tabValue} index={0}>
            <ThreeDManipulation />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Add3DProduct />
          </TabPanel>
        </div>
      </main>
    </div>
  );
}
