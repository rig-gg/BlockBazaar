import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Icon helpers (inline SVG, no extra deps) ─────────────────────────────────
function Icon({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  dashboard:  "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  chain:      "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  transfer:   "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  market:     "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  logout:     "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  user:       "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const NAV_LINKS = [
  { to: "/dashboard",    label: "Dashboard",    icon: ICONS.dashboard },
  { to: "/chain-verify", label: "Chain Verify", icon: ICONS.chain     },
  { to: "/transfer",     label: "Transfer",     icon: ICONS.transfer,  soon: true },
  { to: "/marketplace",  label: "Marketplace",  icon: ICONS.market },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <style>{`
        .bb-nav-link {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.42rem 0.85rem;
          border-radius: 7px;
          color: #7a9bbf;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap;
        }
        .bb-nav-link:hover {
          background: rgba(79,195,247,0.09);
          color: #c4e4f7;
        }
        .bb-nav-link.active {
          background: rgba(79,195,247,0.14);
          color: #4fc3f7;
        }
        .bb-nav-link.soon {
          opacity: 0.45;
          cursor: default;
          pointer-events: none;
        }
        .bb-logout-btn:hover {
          background: rgba(255,100,100,0.15) !important;
          color: #ff8080 !important;
          border-color: rgba(255,100,100,0.4) !important;
        }
      `}</style>

      <nav style={s.nav}>
        {/* Brand */}
        <div style={s.brand}>
          <span style={s.brandDot} />
          <span style={s.brandText}>BlockBazaar</span>
        </div>

        {/* Links */}
        <div style={s.links}>
          {NAV_LINKS.map(({ to, label, icon, soon }) => (
            <NavLink
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(" ", "-")}`}
              className={({ isActive }) =>
                `bb-nav-link${isActive ? " active" : ""}${soon ? " soon" : ""}`
              }
            >
              <Icon d={icon} size={15} />
              {label}
              {soon && <span style={s.soonBadge}>soon</span>}
            </NavLink>
          ))}
        </div>

        {/* User + Logout */}
        <div style={s.right}>
          {user && (
            <div style={s.userChip} id="nav-user-chip">
              <Icon d={ICONS.user} size={13} />
              <span style={s.username}>{user.username}</span>
            </div>
          )}
          <button
            id="btn-logout"
            onClick={handleLogout}
            className="bb-logout-btn"
            style={s.logoutBtn}
          >
            <Icon d={ICONS.logout} size={14} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

const s = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0 1.8rem",
    height: "56px",
    background: "rgba(16,24,48,0.82)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(79,195,247,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.55rem",
    flexShrink: 0,
  },
  brandDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4fc3f7, #0288d1)",
    boxShadow: "0 0 8px rgba(79,195,247,0.7)",
  },
  brandText: {
    color: "#4fc3f7",
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.03em",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
    flex: 1,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  soonBadge: {
    fontSize: "0.62rem",
    background: "rgba(79,195,247,0.15)",
    color: "#4fc3f7",
    padding: "1px 5px",
    borderRadius: "4px",
    letterSpacing: "0.04em",
    marginLeft: "2px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    flexShrink: 0,
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.3rem 0.75rem",
    borderRadius: "999px",
    background: "rgba(79,195,247,0.08)",
    border: "1px solid rgba(79,195,247,0.2)",
    color: "#8ab8d0",
    fontSize: "0.82rem",
  },
  username: { fontWeight: 600, color: "#b0d4e8" },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.35rem 0.8rem",
    borderRadius: "7px",
    border: "1px solid rgba(255,100,100,0.22)",
    background: "transparent",
    color: "#cc7070",
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: "background 0.18s, color 0.18s, border-color 0.18s",
  },
};
