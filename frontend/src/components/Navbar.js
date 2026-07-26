import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";
import ICONS from "../constants/icons";

const NAV_LINKS = [
  { to: "/dashboard",    label: "Dashboard",    icon: ICONS.dashboard },
  { to: "/marketplace",  label: "Marketplace",  icon: ICONS.market },
  { to: "/my-listings",  label: "My Listings",  icon: ICONS.listings },
  { to: "/transactions", label: "Transactions", icon: ICONS.history },
  { to: "/transfer",     label: "Transfer",     icon: ICONS.send },
  { to: "/chain-verify", label: "Chain Verify", icon: ICONS.chain },
  { to: "/cardano",      label: "Cardano",      icon: ICONS.cardano },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bb-navbar">
      <div className="bb-navbar-inner">
        <div className="bb-navbar-brand" onClick={() => navigate("/dashboard")}>
          <div className="bb-navbar-brand-badge">
            <Icon d={ICONS.cardano} size={18} strokeWidth={2.5} />
          </div>
          <span className="bb-navbar-brand-title">BlockBazaar</span>
        </div>

        <nav className="bb-navbar-links">
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

        <div className="bb-navbar-actions">
          {user && (
            <div className="bb-navbar-user-chip" id="nav-user-chip">
              <div className="bb-navbar-user-avatar">
                <Icon d={ICONS.user} size={13} />
              </div>
              <span className="bb-navbar-username">{user.username}</span>
            </div>
          )}
          <button id="btn-logout" onClick={handleLogout} className="bb-btn bb-btn-danger bb-navbar-logout-btn">
            <Icon d={ICONS.logout} size={14} />
            <span>Logout</span>
          </button>
        </div>

        <button
          id="btn-navbar-toggle"
          type="button"
          className="bb-navbar-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <Icon d={menuOpen ? ICONS.x : ICONS.menu} size={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="bb-navbar-mobile-menu animate-fade-up">
          <nav className="bb-navbar-mobile-links">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                id={`nav-mobile-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) => `bb-nav-item${isActive ? " active" : ""}`}
                onClick={closeMenu}
              >
                <Icon d={icon} size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="bb-navbar-mobile-footer">
            {user && (
              <div className="bb-navbar-user-chip" id="nav-user-chip-mobile">
                <div className="bb-navbar-user-avatar">
                  <Icon d={ICONS.user} size={13} />
                </div>
                <span className="bb-navbar-username">{user.username}</span>
              </div>
            )}
            <button
              id="btn-logout-mobile"
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
              className="bb-btn bb-btn-danger bb-navbar-logout-btn"
            >
              <Icon d={ICONS.logout} size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
