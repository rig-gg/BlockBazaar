import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";
import ICONS from "../constants/icons";

const NAV_LINKS = [
  { to: "/dashboard",    label: "Dashboard",    icon: ICONS.dashboard },
  { to: "/marketplace",  label: "Marketplace",  icon: ICONS.market },
  { to: "/my-listings",  label: "My Listings",  icon: ICONS.listings },
  { to: "/transactions", label: "Transactions", icon: ICONS.txHistory },
  { to: "/transfer",     label: "Transfer",     icon: ICONS.transfer },
  { to: "/chain-verify", label: "Chain Verify", icon: ICONS.chain },
  { to: "/cardano",      label: "Cardano",      icon: ICONS.cardano },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header style={styles.header}>
      <div style={styles.innerNav}>
        <div style={styles.brand} onClick={() => navigate("/dashboard")}>
          <div style={styles.brandBadge}>
            <Icon d={ICONS.cardano} size={18} strokeWidth={2.5} />
          </div>
          <span style={styles.brandTitle}>BlockBazaar</span>
        </div>

        <nav style={styles.navLinks}>
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) => `bb-nav-item${isActive ? " active" : ""}`}
            >
              <Icon d={icon} size={15} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.rightActions}>
          {user && (
            <div style={styles.userChip} id="nav-user-chip">
              <div style={styles.userAvatar}>
                <Icon d={ICONS.user} size={13} />
              </div>
              <span style={styles.username}>{user.username}</span>
            </div>
          )}
          <button id="btn-logout" onClick={handleLogout} className="bb-btn bb-btn-danger" style={styles.logoutBtn}>
            <Icon d={ICONS.logout} size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(11, 15, 25, 0.82)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(56, 189, 248, 0.12)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
  },
  innerNav: {
    maxWidth: "1280px", margin: "0 auto", padding: "0.6rem 1.5rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "1rem", flexWrap: "wrap",
  },
  brand: { display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", userSelect: "none" },
  brandBadge: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(129, 140, 248, 0.25) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#38BDF8", boxShadow: "0 0 12px rgba(56, 189, 248, 0.25)",
  },
  brandTitle: {
    fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: "700",
    background: "linear-gradient(135deg, #F8FAFC 0%, #38BDF8 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.01em",
  },
  navLinks: {
    display: "flex", alignItems: "center", gap: "0.25rem",
    overflowX: "auto", padding: "0.2rem 0",
  },
  rightActions: { display: "flex", alignItems: "center", gap: "0.75rem" },
  userChip: {
    display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.8rem",
    borderRadius: "999px", background: "rgba(56, 189, 248, 0.08)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
  },
  userAvatar: {
    width: "22px", height: "22px", borderRadius: "50%",
    background: "rgba(56, 189, 248, 0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#38BDF8",
  },
  username: { fontFamily: "var(--font-heading)", fontSize: "0.85rem", fontWeight: "600", color: "#CBD5E1" },
  logoutBtn: { padding: "0.42rem 0.85rem", fontSize: "0.82rem", borderRadius: "8px" },
};
