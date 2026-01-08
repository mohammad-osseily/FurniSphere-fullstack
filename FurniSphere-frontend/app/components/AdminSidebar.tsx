"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import Image from "next/image";
import { logoutUser } from "../services/authServices";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();

    router.push("/login");
  };

  return (
    <Box
      sx={{
        height: "100vh", // Set height to 100% of viewport height
        backgroundColor: "oklch(0.3354 0.090487 241.152)",
        color: "white",
        width: drawerWidth,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      {/* Logo */}
      <Box sx={{ pt: 4, textAlign: "right", pl: 2 }}>
        <Image
          src="/static/images/whiteLogo.png"
          alt="Logo"
          width={100}
          height={100}
        />
      </Box>

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, overflow: "auto", pt: 2 }}>
        <List>
          <Link href="/admin-dashboard" passHref legacyBehavior>
            <ListItem component="a">
              <ListItemIcon sx={{ color: "white" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItem>
          </Link>

          <Link href="/admin-dashboard/add-product" passHref legacyBehavior>
            <ListItem component="a">
              <ListItemIcon sx={{ color: "white" }}>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Add Products" />
            </ListItem>
          </Link>

          <Link href="/admin-dashboard/orders" passHref legacyBehavior>
            <ListItem component="a">
              <ListItemIcon sx={{ color: "white" }}>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Order Management" />
            </ListItem>
          </Link>

          <Link href="/admin-dashboard/threeD" passHref legacyBehavior>
            <ListItem component="a">
              <ListItemIcon sx={{ color: "white" }}>
                <ThreeDRotationIcon />
              </ListItemIcon>
              <ListItemText primary="3D Manipulation" />
            </ListItem>
          </Link>
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{
            backgroundColor: "#FF6347",
            "&:hover": {
              backgroundColor: "#ff4c33",
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
