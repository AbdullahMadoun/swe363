import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { CartContext } from "./CartContext";
import { ShoppingCart } from "lucide-react";
import ShoppingCartPage from "./ShoppingCartPage"; // adjust the path if needed



import Login from "./Login";
import Signup from "./Signup";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { cart } = useContext(CartContext);

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

  return (
    <>
      <nav style={styles.navbar}>
        <Link to="/" style={styles.brand}>
          TechShop
        </Link>

        <div style={styles.navButtons}>
          {user ? (
            <>
              <Link to="/" style={styles.linkButton}>Main</Link>
              <Link to="/orders" style={styles.linkButton}>Orders</Link>
              <Link to="/wishlist" style={styles.linkButton}>Wishlist</Link>

              <Link to="/cart" style={styles.cartButton}>
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span style={styles.cartBadge}>{cart.length}</span>
                )}
                
              </Link>

              <div style={styles.avatarContainer}>
                <img
                  src={
                    user?.image ||
                    "https://docs.gravatar.com/wp-content/uploads/2025/02/avatar-mysteryperson-20250210-256.png"
                  }
                  alt="avatar"
                  style={styles.avatar}
                  onClick={() => setShowMenu(!showMenu)}
                />
                {showMenu && (
                  <div style={styles.dropdownMenu}>
                    <Link to="/settings" onClick={handleNavClick} style={styles.menuItem}>
                      Account Settings
                    </Link>
                    <button onClick={logout} style={styles.menuItem}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
             <Link to="/signin"  onClick={toggleLogin} style={styles.signIn}>Sign in</Link>
             <Link to="/signup" onClick={toggleSignup} style={styles.signUp}>Sign up</Link>
            </>
          )}
        </div>
      </nav>

      {!user && showLogin && <Login />}
      {!user && showSignup &&  <Signup/>}
    </>
  );
}

export default Navbar;
const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#111",
    textDecoration: "none",
  },
  navButtons: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  signIn: {
    padding: "0.5rem 1rem",
    border: "none",
    color: "#2563eb",
    background: "transparent",
    cursor: "pointer",
    fontSize: "1rem",
  },
  signUp: {
    padding: "0.5rem 1rem",
    border: "1px solid #2563eb",
    borderRadius: "4px",
    background: "transparent",
    color: "#2563eb",
    fontSize: "1rem",
    cursor: "pointer",
  },
  cartButton: {
    position: "relative",
    color: "#111",
    textDecoration: "none",
  },
  cartBadge: {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  avatarContainer: {
    position: "relative",
    width: "32px",
    height: "32px",
    marginLeft: "1rem",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    objectFit: "cover",
  },
  dropdownMenu: {
    position: "absolute",
    top: "40px",
    right: "0",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "0.5rem 0",
    zIndex: 1000,
    minWidth: "160px",
  },
  menuItem: {
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    textAlign: "left",
    background: "transparent",
    color: "#2563eb",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textDecoration: "none",
  },
  linkButton: {
    textDecoration: "none",
    fontSize: "1rem",
    color: "#2563eb",
  },
};
