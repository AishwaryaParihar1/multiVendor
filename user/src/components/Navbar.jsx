import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  User2,
  LogOut,
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import { gsap } from "gsap";
import API from "../utils/api";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Fetch cart and wishlist counts for badge display
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

  // Initialize on mount and listen to storage changes
  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1 }
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
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Search submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setMenuOpen(false);
    }
  };

  const iconBtnClass =
    "relative w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary shadow hover:bg-accent hover:text-white transition";

  return (
    <nav className="bg-primary text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-full mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center cursor-pointer hover:opacity-90 transition"
            ref={logoRef}
            onClick={() => navigate("/")}
            aria-label="Homepage"
          >
            <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
            <span className="font-extrabold text-2xl select-none tracking-wider text-gradient-primary">
              MultiCvero
            </span>
          </div>

          {/* Desktop Nav Links + Search + Icons */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Nav Links */}
            <div className="flex space-x-6 items-center">
              {navLinks.map(({ name, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `relative px-3 py-2 font-semibold text-base transition-colors ${
                      isActive ? "text-accent" : "hover:text-accent"
                    }`
                  }
                >
                  {name}
                  <span
                    className="absolute left-0 -bottom-1 w-full h-0.5 bg-accent scale-x-0 origin-left transition-transform pointer-events-none"
                    aria-hidden="true"
                  />
                </NavLink>
              ))}
            </div>

            {/* Search bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white rounded-md shadow-inner px-3 py-1 ml-3"
              role="search"
              aria-label="Site search"
            >
              <input
                type="search"
                placeholder="Search products..."
                aria-label="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-gray-800 placeholder-gray-400 w-40 md:w-56"
              />
              <button
                type="submit"
                className="text-primary ml-2 hover:text-primary-dark transition"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Wishlist Icon with Badge */}
            <Link to="/wishlist" className={iconBtnClass} aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary rounded-full px-1.5 text-xs font-bold pointer-events-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className={iconBtnClass} aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary rounded-full px-1.5 text-xs font-bold pointer-events-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* My Orders Icon */}
            <Link to="/my-orders" className={iconBtnClass} aria-label="My Orders">
              <ClipboardList size={20} />
            </Link>
          </div>

          {/* Right Side User/Profile or Login/Register + Logout Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  className="flex items-center hover:text-accent focus:outline-none transition"
                  onClick={() => navigate("/user/profile")}
                  aria-label="User Profile"
                >
                  <User2 size={24} />
                  <span className="hidden sm:inline-block font-medium">{user.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded bg-secondary hover:bg-accent text-white text-xs font-semibold transition ml-1"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-md bg-accent text-primary font-semibold hover:bg-accent/90 transition"
                >
                  Login/Register
                </Link>
              </div>
            )}

            {/* Cart, Wishlist, My Orders Icons (Mobile) */}
            <Link
              to="/wishlist"
              className={`${iconBtnClass} md:hidden mx-1`}
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary rounded-full px-1.5 text-xs font-bold pointer-events-none">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className={`${iconBtnClass} md:hidden mx-1`}
              aria-label="Cart"
              title="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary rounded-full px-1.5 text-xs font-bold pointer-events-none">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/my-orders"
              className={`${iconBtnClass} md:hidden mx-1`}
              aria-label="My Orders"
              title="My Orders"
            >
              <ClipboardList size={20} />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded hover:bg-accent/30 transition"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary px-6 py-6 space-y-4 shadow-inner">
          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
                setMenuOpen(false);
              }
            }}
            className="flex items-center bg-white rounded-md px-3 py-1 w-full mb-2"
          >
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              type="submit"
              className="text-primary hover:text-primary-dark ml-3 transition"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Wishlist, Cart, MyOrder mobile links */}
          <div className="flex gap-4 mb-3">
            <Link to="/wishlist" className={iconBtnClass} aria-label="Wishlist" title="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary rounded-full px-1.5 text-xs font-bold pointer-events-none">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className={iconBtnClass} aria-label="Cart" title="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary rounded-full px-1.5 text-xs font-bold pointer-events-none">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/my-orders" className={iconBtnClass} aria-label="My Orders" title="My Orders">
              <ClipboardList size={20} />
            </Link>
          </div>

          {/* Navigation Links */}
          {navLinks.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded font-semibold text-base text-center transition-colors duration-200 ${
                  isActive
                    ? "bg-accent text-primary"
                    : "hover:bg-accent hover:text-primary text-white"
                }`
              }
            >
              {name}
            </NavLink>
          ))}

          {/* User or guest links */}
          {user ? (
            <>
              <Link
                to={`/${user.role}/dashboard`}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded font-semibold text-center hover:bg-accent hover:text-primary transition text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded font-semibold text-red-400 hover:bg-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded font-semibold text-center hover:bg-accent hover:text-primary transition text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded font-semibold text-center hover:bg-accent hover:text-primary transition text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
