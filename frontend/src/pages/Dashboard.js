import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredAction, setHoveredAction] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/wallet", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setError("Could not load your wallet balance.");
          return;
        }

        const data = await response.json();
        setBalance(data.balance);
      } catch (err) {
        setError("Cannot reach the server. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Wallet Balance</h2>

          {loading && <p style={styles.status}>Loading balance...</p>}
          {!loading && error && <p style={styles.error}>{error}</p>}
          {!loading && !error && (
            <p style={styles.balance}>
              {Number(balance).toLocaleString()} MKT
            </p>
          )}
        </div>

        <div style={styles.actions}>
          <Link
            to="/transfer"
            style={{
              ...styles.actionButton,
              ...(hoveredAction === "transfer" ? styles.actionButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredAction("transfer")}
            onMouseLeave={() => setHoveredAction(null)}
          >
            Transfer
          </Link>
          <Link
            to="/marketplace"
            style={{
              ...styles.actionButton,
              ...(hoveredAction === "marketplace" ? styles.actionButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredAction("marketplace")}
            onMouseLeave={() => setHoveredAction(null)}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#1a1a2e",
    color: "#eee",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 1.5rem",
  },
  card: {
    background: "#16213e",
    padding: "2.5rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
    textAlign: "center",
  },
  cardTitle: {
    margin: 0,
    marginBottom: "1rem",
    fontSize: "1.1rem",
    fontWeight: "normal",
    color: "#aaa",
  },
  balance: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#4fc3f7",
  },
  status: {
    margin: 0,
    fontSize: "1rem",
    color: "#aaa",
  },
  error: {
    background: "#5c1a1a",
    color: "#ffb3b3",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "2rem",
    width: "100%",
    maxWidth: "420px",
  },
  actionButton: {
    flex: "1 1 160px",
    textAlign: "center",
    padding: "0.7rem",
    borderRadius: "6px",
    background: "#4fc3f7",
    color: "#000",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "background 0.15s ease",
  },
  actionButtonHover: {
    background: "#7fd4fa",
  },
};

export default Dashboard;
