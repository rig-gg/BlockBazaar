import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Icon({ d, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  market:    "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  listings:  "M4 6h16M4 10h16M4 14h16M4 18h16",
  txHistory: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  transfer:  "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  chain:     "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  logout:    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  user:      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const NAV_LINKS = [
  { to: "/dashboard",    label: "Dashboard",    icon: ICONS.dashboard },
  { to: "/marketplace",  label: "Marketplace",  icon: ICONS.market },
  { to: "/my-listings",  label: "My Listings",  icon: ICONS.listings },
  { to: "/transactions", label: "Transactions", icon: ICONS.txHistory },
  { to: "/transfer",     label: "Transfer",     icon: ICONS.transfer },
  { to: "/chain-verify", label: "Chain Verify", icon: ICONS.chain },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <style>{`
        .bb-nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.9rem;
          border-radius: 10px;
          color: var(--text-secondary);
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }
        .bb-nav-item:hover {
          color: var(--text-primary);
          background: rgba(56, 189, 248, 0.08);
        }
        .bb-nav-item.active {
          color: var(--accent-cyan);
          background: rgba(56, 189, 248, 0.14);
          border: 1px solid rgba(56, 189, 248, 0.25);
          font-weight: 600;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.15);
        }
      `}</style>

      <header style={styles.header}>
        <div style={styles.innerNav}>
          {/* Brand Logo */}
          <div style={styles.brand} onClick={() => navigate("/dashboard")}>
            <div style={styles.brandBadge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.brandTitle}>BlockBazaar</span>
          </div>

          {/* Navigation Links */}
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

          {/* User Profile Chip & Logout */}
          <div style={styles.rightActions}>
            {user && (
              <div style={styles.userChip} id="nav-user-chip">
                <div style={styles.userAvatar}>
                  <Icon d={ICONS.user} size={13} />
                </div>
                <span style={styles.username}>{user.username}</span>
              </div>
            )}
            <button
              id="btn-logout"
              onClick={handleLogout}
              className="bb-btn bb-btn-danger"
              style={styles.logoutBtn}
            >
              <Icon d={ICONS.logout} size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(11, 15, 25, 0.82)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(56, 189, 248, 0.12)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
  },
  innerNav: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0.6rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    cursor: "pointer",
    userSelect: "none",
  },
  brandBadge: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(129, 140, 248, 0.25) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#38BDF8",
    boxShadow: "0 0 12px rgba(56, 189, 248, 0.25)",
  },
  brandTitle: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.15rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #F8FAFC 0%, #38BDF8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.01em",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    overflowX: "auto",
    padding: "0.2rem 0",
  },
  rightActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.35rem 0.8rem",
    borderRadius: "999px",
    background: "rgba(56, 189, 248, 0.08)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
  },
  userAvatar: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "rgba(56, 189, 248, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#38BDF8",
  },
  username: {
    fontFamily: "var(--font-heading)",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#CBD5E1",
  },
  logoutBtn: {
    padding: "0.42rem 0.85rem",
    fontSize: "0.82rem",
    borderRadius: "8px",
  },
};
