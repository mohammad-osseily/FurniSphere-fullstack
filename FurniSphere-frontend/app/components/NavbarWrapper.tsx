// app/components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  const pathname = usePathname();

  // Conditionally render Navbar based on route
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin-dashboard" ||
    pathname === "/admin-dashboard/threeD" ||
    pathname === "/admin-dashboard/add-product" ||
    pathname === "/admin-dashboard/orders"
  ) {
    return null;
  }

  return <Navbar />;
};

export default NavbarWrapper;
