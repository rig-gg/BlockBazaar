import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/dashboard" style={styles.brandLink}>
          BlockBazaar
        </Link>
      </div>

      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>
          Dashboard
        </Link>
        <Link to="/marketplace" style={styles.link}>
          Marketplace
        </Link>
        <Link to="/my-listings" style={styles.link}>
          My Listings
        </Link>
        <Link to="/transfer" style={styles.link}>
          Transfer
        </Link>
        <Link to="/chain-verify" style={styles.link}>
          Verify Chain
        </Link>
        <Link to="/transactions" style={styles.link}>
          History
        </Link>
      </div>

      <div style={styles.userSection}>
        <span style={styles.username}>👤 {user?.username || "User"}</span>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.8rem 1.5rem",
    background: "#16213e",
    borderBottom: "1px solid #0f3460",
    color: "#eee",
  },
  brand: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  brandLink: {
    color: "#4fc3f7",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "1.2rem",
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "color 0.15s ease",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  username: {
    fontSize: "0.9rem",
    color: "#81d4fa",
  },
  logoutButton: {
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    border: "1px solid #ff6464",
    background: "transparent",
    color: "#ff6464",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
};

export default Navbar;
