import React, { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Plus,
  Receipt,
  LogOut,
} from "lucide-react";
import SweetAlertService from "../ui/SweetAlertService"; // Ensure correct path
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 72;

const vendorMenu = [
  { name: "Profile", path: "/vendor/dashboard/profile", icon: <User size={20} /> },
  { name: "My Products", path: "/vendor/dashboard/products", icon: <Package size={20} /> },
  { name: "Add Product", path: "/vendor/dashboard/add-product", icon: <Plus size={20} /> },
  { name: "Your Orders", path: "/vendor/dashboard/vendorOrdersPage", icon: <Receipt size={20} /> },
];

export default function VendorDashboard() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await SweetAlertService.showConfirm(
      "Are you sure?",
      "You will be logged out from the dashboard",
      "Logout",
      "Cancel"
    );
    if (confirmed) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <Drawer
        variant="permanent"
        open={!collapsed}
        PaperProps={{
          sx: {
            width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: 2,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {!collapsed && (
            <Typography variant="h6" sx={{ color: theme.palette.secondary.main, fontWeight: "bold" }}>
              Vendor Panel
            </Typography>
          )}
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              color: "#fff",
              bgcolor: theme.palette.secondary.main,
              "&:hover": { bgcolor: theme.palette.secondary.dark },
              p: 0.5,
            }}
            size="small"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          >
            {collapsed ? <Plus size={20} /> : <User size={20} />}
          </IconButton>
        </Box>

        <List sx={{ flexGrow: 1, mt: 1 }}>
          {vendorMenu.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <Tooltip key={item.name} title={collapsed ? item.name : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={selected}
                  sx={{
                    pl: collapsed ? 2 : 3,
                    py: 1,
                    color: selected ? theme.palette.secondary.main : "#fff",
                    bgcolor: selected ? theme.palette.background.paper : "transparent",
                    "&:hover": {
                      bgcolor: selected ? theme.palette.background.paper : theme.palette.secondary.main,
                      color: "#fff", // Ensure hover text is always white for visibility
                    },
                    borderRadius: 2,
                    mx: collapsed ? 1 : 2,
                    mb: 0.5,
                    transition: "color 0.3s, background-color 0.3s",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selected ? theme.palette.secondary.main : "#fff",
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.name} />}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>

        <Box
          sx={{
            p: collapsed ? 1 : 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: theme.palette.error.main,
              borderRadius: 2,
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 0 : 2,
              "&:hover": {
                bgcolor: theme.palette.error.light + "22",
                color: "#fff", // Maintain white text on hover for logout too
              },
              transition: "color 0.3s, background-color 0.3s",
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.error.main,
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: "center",
              }}
            >
              <LogOut size={20} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 6,
          bgcolor: theme.palette.background.default,
          overflow: "auto",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
