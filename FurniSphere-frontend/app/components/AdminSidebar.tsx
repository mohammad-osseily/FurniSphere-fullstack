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
        backgroundColor: "#8B7355", // Primary theme color
        color: "#FAFAFA", // Base-100 theme color
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
            <ListItem 
              component="a"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#FAFAFA" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" sx={{ color: "#FAFAFA" }} />
            </ListItem>
          </Link>

          <Link href="/admin-dashboard/add-product" passHref legacyBehavior>
            <ListItem 
              component="a"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#FAFAFA" }}>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Add Products" sx={{ color: "#FAFAFA" }} />
            </ListItem>
          </Link>

          <Link href="/admin-dashboard/orders" passHref legacyBehavior>
            <ListItem 
              component="a"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#FAFAFA" }}>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Order Management" sx={{ color: "#FAFAFA" }} />
            </ListItem>
          </Link>

          <Link href="/admin-dashboard/threeD" passHref legacyBehavior>
            <ListItem 
              component="a"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#FAFAFA" }}>
                <ThreeDRotationIcon />
              </ListItemIcon>
              <ListItemText primary="3D Manipulation" sx={{ color: "#FAFAFA" }} />
            </ListItem>
          </Link>
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{
            backgroundColor: "#D9534F", // Error theme color
            color: "#FAFAFA", // Base-100 theme color
            "&:hover": {
              backgroundColor: "#C04440",
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
