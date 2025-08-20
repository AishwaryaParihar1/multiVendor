import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Logout,
  Dashboard,
  VerifiedUser,
  Group,
  Category,
  ReceiptLong,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Toolbar,
  Divider,
  Tooltip,
  useTheme,
} from "@mui/material";
import SweetAlertService from "../ui/SweetAlertService";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 60;

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <Dashboard /> },
  { name: "Vendor Approval", path: "/admin/dashboard/vendorApprovalPage", icon: <VerifiedUser /> },
  { name: "Vendors", path: "/admin/dashboard/vendors", icon: <Group /> },
  { name: "Category Manager", path: "/admin/dashboard/categoryManager", icon: <Category /> },
  { name: "All Orders", path: "/admin/dashboard/adminOrderPage", icon: <ReceiptLong /> },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const theme = useTheme();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

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
    <Box sx={{ display: "flex", height: "100vh", bgcolor: theme.palette.background.default }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            position: "relative",
            whiteSpace: "nowrap",
            width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
            overflowX: "hidden",
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            borderRight: "none",
            boxSizing: "border-box",
          },
        }}
        sx={{
          flexShrink: 0,
          width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
          "& .MuiDrawer-paper": {
            width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: [1],
            bgcolor: theme.palette.primary.dark,
            minHeight: 64,
          }}
        >
          {!collapsed && (
            <Typography variant="h6" noWrap sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}>
              Admin Panel
            </Typography>
          )}
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              color: theme.palette.secondary.main,
              bgcolor: theme.palette.primary.light,
              "&:hover": { bgcolor: theme.palette.primary.dark },
              width: 36,
              height: 36,
            }}
            size="small"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          >
            {collapsed ? <ChevronRight sx={{ color: theme.palette.secondary.main }} /> : <ChevronLeft sx={{ color: theme.palette.secondary.main }} />}
          </IconButton>
        </Toolbar>
        <Divider sx={{ bgcolor: theme.palette.primary.light }} />

        {/* Menu Items */}
        <List sx={{ flexGrow: 1, mt: 1 }}>
          {menuItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <Tooltip title={collapsed ? item.name : ""} placement="right" key={item.name}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={selected}
                  sx={{
                    pl: collapsed ? 2 : 3,
                    py: 1,
                    color: selected ? theme.palette.secondary.main : "#fff",
                    bgcolor: selected ? theme.palette.primary.light : "transparent",
                    borderRadius: 1.5,
                    mx: collapsed ? 1 : 2,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                      color: "#fff",
                    },
                    transition: theme.transitions.create(["background-color", "color"], {
                      duration: theme.transitions.duration.short,
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selected ? theme.palette.secondary.main : "#fff",
                      minWidth: 40,
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

        {/* Logout Button */}
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.primary.light}` }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: theme.palette.error.main,
              borderRadius: 1.5,
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 2 : 3,
              "&:hover": {
                bgcolor: theme.palette.error.light,
                color: theme.palette.error.contrastText,
              },
              transition: theme.transitions.create(["background-color", "color"], {
                duration: theme.transitions.duration.short,
              }),
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.error.main,
                minWidth: 40,
                justifyContent: "center",
              }}
            >
              <Logout />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          bgcolor: theme.palette.background.default,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
