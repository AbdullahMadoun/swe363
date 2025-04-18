// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";
import { CartContext } from "./CartContext";
import { ShoppingCart } from "lucide-react";
import Login from "./Login";
import Signup from "./Signup";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(true);

  const toggleLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const toggleSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleNavClick = () => setShowMenu(false);

  // helper to mark the active link
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={styles.header}>
        <div style={styles.navLinks}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isActive("/") ? styles.activeLink : {}),
            }}
          >
            Main
          </Link>
          <Link
            to="/orders"
            style={{
              ...styles.navLink,
              ...(isActive("/orders") ? styles.activeLink : {}),
            }}
          >
            Orders
          </Link>
          <Link
            to="/wishlist"
            style={{
              ...styles.navLink,
              ...(isActive("/wishlist") ? styles.activeLink : {}),
            }}
          >
            Wishlist
          </Link>
        </div>

        <div style={styles.navLinks}>
          <Link to="/cart" style={styles.navLink}>
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span style={styles.removeButton}>{cart.length}</span>
            )}
          </Link>

          {user ? (
            <div style={styles.userProfile}>
              <div
                style={styles.userAvatar}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <img
                  src={
                    user.image ||
                    "https://docs.gravatar.com/wp-content/uploads/2025/02/avatar-mysteryperson-20250210-256.png"
                  }
                  alt="avatar"
                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                />
              </div>
              <span style={styles.username}>{user.name}</span>

              {showMenu && (
                <div style={styles.dropdownMenu}>
                  <Link
                    to="/settings"
                    onClick={handleNavClick}
                    style={styles.menuItem}
                  >
                    Account Settings
                  </Link>
                  <button onClick={logout} style={styles.menuItem}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={toggleLogin} style={styles.navLink}>
                Sign in
              </button>
              <button onClick={toggleSignup} style={styles.activeLink}>
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>

      {!user && showLogin && <Login />}
      {!user && showSignup && <Signup />}
    </>
  );
}

export default Navbar;

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  navLink: {
    color: "#374151",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "color .2s",
  },
  activeLink: {
    color: "black",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: "1rem",
  },
  removeButton: {
    marginLeft: "0.25rem",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    position: "relative",
  },
  userAvatar: {
    background: "#1f2937",
    width: "2rem",
    height: "2rem",
    borderRadius: "9999px",
    overflow: "hidden",
    cursor: "pointer",
  },
  username: {
    fontSize: "0.875rem",
    color: "#4b5563",
  },
  dropdownMenu: {
    position: "absolute",
    top: "2.5rem",
    right: 0,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "0.5rem 0",
    zIndex: 100,
    minWidth: "10rem",
  },
  menuItem: {
    display: "block",
    width: "100%",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    color: "#374151",
    textDecoration: "none",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
  },
};
