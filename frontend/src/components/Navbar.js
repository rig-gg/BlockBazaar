import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [hoveredLink, setHoveredLink] = useState(null);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/transfer", label: "Transfer" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/my-listings", label: "My Listings" },
  ];

  const getLinkStyle = (to, isActive) => ({
    ...styles.link,
    color: isActive || hoveredLink === to ? "#4fc3f7" : "#eee",
  });

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        BlockBazaar
      </Link>

      <div style={styles.links}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => getLinkStyle(link.to, isActive)}
            onMouseEnter={() => setHoveredLink(link.to)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    background: "#16213e",
    color: "#eee",
  },
  brand: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#eee",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "color 0.15s ease",
  },
};

export default Navbar;
