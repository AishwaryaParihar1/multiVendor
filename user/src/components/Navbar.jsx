import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  User2,
  Menu as MenuIcon,
  X as CloseIcon,
  Search,
  Heart,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import { gsap } from "gsap";
import API from "../utils/api";
import logo from "../assets/logo.png";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const logoRef = useRef();

  // Load user info from localStorage
  const loadUserFromStorage = () => {
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("userName");
    if (storedRole && storedName) {
      setUser({ role: storedRole, name: storedName });
    } else {
      setUser(null);
    }
  };

  // Fetch counts for cart & wishlist
  const fetchCounts = async () => {
    if (!localStorage.getItem("token")) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        API.get("/cart"),
        API.get("/wishlist"),
      ]);
      setCartCount(
        cartRes.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
      );
      setWishlistCount(wishlistRes.data.products?.length || 0);
    } catch {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
    loadUserFromStorage();
    fetchCounts();

    const onStorageChange = () => {
      loadUserFromStorage();
      fetchCounts();
    };
    window.addEventListener("storage", onStorageChange);
    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#004030",
          color: "#FFF9E5",
          boxShadow: "0 4px 8px rgba(0,64,48,0.2)",
          minHeight: { xs: 56, md: 64 },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, md: 4, lg: 8 },
          }}
        >
          {/* Left: Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 120,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
            ref={logoRef}
            aria-label="Homepage"
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: 36, width: 36, borderRadius: 6 }}
            />
            <Box
              component="span"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                letterSpacing: 1.2,
                ml: 2,
                color: "#CBAF7A",
                userSelect: "none",
              }}
            >
              MultiCvero
            </Box>
          </Box>

          {/* Center: Nav links (desktop only) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            {navLinks.map(({ name, path }) => (
              <Button
                key={name}
                component={NavLink}
                to={path}
                sx={{
                  color: "#FFF9E5",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  px: 2,
                  textTransform: "none",
                  letterSpacing: "0.05em",
                  transition: "color 0.3s",
                  "&.active": { color: "#CBAF7A" },
                }}
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Button>
            ))}
          </Box>

          {/* Right side: Icons + User + Menu toggle */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Desktop Icons */}
            <Tooltip title="Wishlist" arrow>
              <IconButton
                component={Link}
                to="/wishlist"
                color="inherit"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Badge badgeContent={wishlistCount} color="secondary">
                  <Heart size={19} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Cart" arrow>
              <IconButton
                component={Link}
                to="/cart"
                color="inherit"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCart size={19} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Orders" arrow>
              <IconButton
                component={Link}
                to="/my-orders"
                color="inherit"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <ClipboardList size={18} />
              </IconButton>
            </Tooltip>

            {/* User Section */}
            <Tooltip title={user ? "Profile" : "Login/Register"} arrow>
              {user ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    startIcon={<User2 size={20} />}
                    onClick={() => navigate("/user/profile")}
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      "&:hover": { color: "#CBAF7A" },
                    }}
                    aria-label="Go to user profile"
                  >
                    {user.name}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleLogout}
                    sx={{
                      bgcolor: "#4E5D45",
                      textTransform: "none",
                      fontSize: "0.9rem",
                      px: 2,
                      "&:hover": { bgcolor: "#CBAF7A", color: "#004030" },
                    }}
                    aria-label="Logout"
                  >
                    Logout
                  </Button>
                </Stack>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    bgcolor: "#CBAF7A",
                    color: "#004030",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 2,
                  }}
                  aria-label="Login"
                >
                  Login
                </Button>
              )}
            </Tooltip>

            {/* Mobile menu toggle */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
              sx={{
                display: { xs: "flex", md: "none" },
                ml: 1,
                backgroundColor: "#CBAF7A",
                color: "#004030",
                boxShadow: "0 2px 8px rgba(203,175,122,0.3)",
              }}
            >
              {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#004030",
            width: 260,
            paddingX: 2,
            paddingY: 4,
          },
        }}
      >
        <Stack direction="column" spacing={2} sx={{mt: 3}} >
          {/* Navigation Links */}
          {navLinks.map(({ name, path }) => (
            <Button
              key={name}
              component={NavLink}
              to={path}
              onClick={() => setMenuOpen(false)}
              sx={{
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                paddingY: 1,
                borderRadius: 1,
                "&.active": {
                  bgcolor: "#CBAF7A",
                  color: "#004030",
                  fontWeight: 700,
                },
                "&:hover": {
                  bgcolor: "#CBAF7A",
                  color: "#004030",
                },
              }}
            >
              {name}
            </Button>
          ))}

          {/* Mobile Icons */}
          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Tooltip title="Wishlist" arrow>
              <IconButton
                component={Link}
                to="/wishlist"
                aria-label="Wishlist"
                onClick={() => setMenuOpen(false)}
                sx={{
                  backgroundColor: "white",
                  color: "#004030",
                  "&:hover": { backgroundColor: "#CBAF7A", color: "#004030" },
                }}
              >
                <Badge badgeContent={wishlistCount} color="secondary" overlap="circular">
                  <Heart size={20} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Cart" arrow>
              <IconButton
                component={Link}
                to="/cart"
                aria-label="Cart"
                onClick={() => setMenuOpen(false)}
                sx={{
                  backgroundColor: "white",
                  color: "#004030",
                  "&:hover": { backgroundColor: "#CBAF7A", color: "#004030" },
                }}
              >
                <Badge badgeContent={cartCount} color="secondary" overlap="circular">
                  <ShoppingCart size={20} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Orders" arrow>
              <IconButton
                component={Link}
                to="/my-orders"
                aria-label="My Orders"
                onClick={() => setMenuOpen(false)}
                sx={{
                  backgroundColor: "white",
                  color: "#004030",
                  "&:hover": { backgroundColor: "#CBAF7A", color: "#004030" },
                }}
              >
                <ClipboardList size={20} />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Mobile User */}
          {user ? (
            <Stack direction="column" spacing={1} mt={2}>
              <Button
                component={Link}
                to={`/${user.role}/dashboard`}
                onClick={() => setMenuOpen(false)}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#CBAF7A", color: "#004030" },
                }}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                sx={{
                  color: "#d32f2f",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#fbdde0" },
                }}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Button
              component={Link}
              to="/login"
              onClick={() => setMenuOpen(false)}
              sx={{
                bgcolor: "#CBAF7A",
                color: "#004030",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#b99b69" },
              }}
            >
              Login
            </Button>
          )}
        </Stack>
      </Drawer>

      {/* Spacer to push content below navbar */}
      <Toolbar />
    </>
  );
}
