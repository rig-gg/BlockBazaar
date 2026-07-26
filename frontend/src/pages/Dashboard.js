import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Icon from "../components/Icon";
import ICONS from "../constants/icons";
import PageLayout from "../components/PageLayout";

const QUICK_ACTIONS = [
  { id: "qa-transfer",  label: "Send Tokens",     description: "Transfer MKT to another user instantly.",   route: "/transfer",     icon: ICONS.send,      iconBg: "rgba(56, 189, 248, 0.15)" },
  { id: "qa-market",    label: "Browse Marketplace",description: "Discover and buy listed digital assets.", route: "/marketplace",  icon: ICONS.market,    iconBg: "rgba(129, 140, 248, 0.15)" },
  { id: "qa-my-list",   label: "My Listings",      description: "Manage assets you have listed for sale.",   route: "/my-listings",  icon: ICONS.listings,  iconBg: "rgba(52, 211, 153, 0.15)" },
  { id: "qa-history",   label: "View Transactions", description: "Review your immutable on-chain ledger.",   route: "/transactions", icon: ICONS.history,   iconBg: "rgba(251, 191, 36, 0.15)" },
  { id: "qa-verify",    label: "Verify Blockchain", description: "Audit block hashes for chain integrity.",   route: "/chain-verify", icon: ICONS.chain,     iconBg: "rgba(251, 113, 133, 0.15)" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cardano, setCardano] = useState(null);

  const fetchWallet = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/wallet");
      setWallet(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not fetch wallet data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCardano = async () => {
    try {
      const { data } = await api.get("/cardano/network");
      setCardano(data);
    } catch {
      setCardano({ health: false });
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchCardano();
  }, []);

  return (
    <PageLayout>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroGlow} aria-hidden="true" />
        <div style={styles.greetingRow}>
          <div style={styles.avatarContainer}>
            <span style={styles.avatarText}>{(user?.username || "U").charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 style={styles.greetingHeading}>
              Welcome back, <span style={styles.greetingName}>{user?.username || "User"}</span>
            </h1>
            <p style={styles.greetingSub}>Here is the current state of your BlockBazaar account.</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
          Loading wallet data...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Icon d={ICONS.alert} size={20} color="#FB7185" />
          <div>
            <strong style={{ color: "#FB7185" }}>Unable to load wallet</strong>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>{error}</p>
          </div>
          <button onClick={fetchWallet} className="bb-btn bb-btn-outline" style={{ marginLeft: "auto" }}>
            Retry
          </button>
        </div>
      )}

      {/* Quick Stats Grid */}
      {wallet && !loading && !error && (
        <div style={styles.statsGrid}>
          <div className="glass-card" style={styles.statCard}>
            <span style={styles.statTitle}>Available Balance</span>
            <span style={{ ...styles.statValue, color: "#38BDF8" }}>
              {Number(wallet.balance ?? 0).toFixed(2)} MKT
            </span>
          </div>
          <div className="glass-card" style={styles.statCard}>
            <span style={styles.statTitle}>Cardano Network</span>
            <span style={{ ...styles.statValue, color: cardano?.health ? "#34D399" : "#FB7185" }}>
              {cardano?.health ? `Block #${cardano.latestBlock?.height?.toLocaleString() ?? "..."}` : "Offline"}
            </span>
          </div>
          <div className="glass-card" style={styles.statCard}>
            <span style={styles.statTitle}>Account Type</span>
            <span style={{ ...styles.statValue, color: "#818CF8" }}>
              Standard Wallet
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={styles.sectionHeader}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((act) => (
            <div
              key={act.id}
              id={act.id}
              className="glass-card glass-card-interactive"
              style={styles.actionCard}
              onClick={() => navigate(act.route)}
            >
              <div style={{ ...styles.actionIcon, background: act.iconBg }}>
                <Icon d={act.icon} size={22} color="#FFFFFF" />
              </div>
              <div style={styles.actionContent}>
                <h3 style={styles.actionTitle}>{act.label}</h3>
                <p style={styles.actionDesc}>{act.description}</p>
              </div>
              <div style={styles.actionArrow}>→</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cardano Network */}
      {cardano && (
        <section style={{ marginTop: "2.5rem" }}>
          <h2 style={styles.sectionHeader}>
            <Icon d={ICONS.cardano} size={18} color="#38BDF8" /> Cardano Network
          </h2>
          <div className="glass-card" style={styles.cardanoCard}>
            <div style={styles.cardanoGrid}>
              <div style={styles.cardanoStat}>
                <span style={styles.cardanoLabel}>Status</span>
                <span style={{ ...styles.cardanoValue, color: cardano.health ? "#34D399" : "#FB7185" }}>
                  {cardano.health ? "Connected" : "Unavailable"}
                </span>
              </div>
              <div style={styles.cardanoStat}>
                <span style={styles.cardanoLabel}>Latest Block</span>
                <span style={styles.cardanoValue}>
                  #{cardano.latestBlock?.height?.toLocaleString() ?? "—"}
                </span>
              </div>
              <div style={styles.cardanoStat}>
                <span style={styles.cardanoLabel}>Epoch</span>
                <span style={styles.cardanoValue}>
                  {cardano.latestBlock?.epoch ?? "—"}
                </span>
              </div>
              <div style={styles.cardanoStat}>
                <span style={styles.cardanoLabel}>Slot</span>
                <span style={styles.cardanoValue}>
                  {cardano.latestBlock?.slot?.toLocaleString() ?? "—"}
                </span>
              </div>
            </div>
            <div style={styles.cardanoFooter}>
              <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                Powered by Blockfrost API · Cardano Mainnet
              </span>
              <button
                onClick={() => navigate("/cardano")}
                className="bb-btn bb-btn-outline"
                style={{ padding: "0.4rem 0.9rem", fontSize: "0.8rem" }}
              >
                Explore →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Recent Activity */}
      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={styles.sectionHeader}>Recent Activity</h2>
        <div className="glass-card" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
          <div style={styles.emptyIconContainer}>
            <Icon d={ICONS.history} size={28} color="#38BDF8" />
          </div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "0.3rem" }}>No Recent Activity</h3>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem" }}>
            Your recent transactions and purchases will appear here.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}

const styles = {
  heroSection: {
    position: "relative",
    marginBottom: "2.2rem",
    overflow: "hidden",
    borderRadius: "20px",
    padding: "2rem 2rem 1.5rem",
    background: "linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.15)",
  },
  heroGlow: {
    position: "absolute",
    top: "-80px",
    right: "-60px",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  greetingRow: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
    position: "relative",
    zIndex: 1,
  },
  avatarContainer: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.22) 0%, rgba(129, 140, 248, 0.22) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.3rem",
    fontWeight: "800",
    color: "#F8FAFC",
  },
  greetingHeading: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.7rem",
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: "-0.02em",
  },
  greetingName: {
    background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  greetingSub: {
    fontSize: "0.92rem",
    color: "#94A3B8",
    marginTop: "0.3rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.2rem",
    marginBottom: "0.5rem",
  },
  statCard: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  statTitle: {
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  statValue: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.7rem",
    fontWeight: "800",
  },
  sectionHeader: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: "1rem",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1rem",
  },
  actionCard: {
    padding: "1.2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
  },
  actionIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  actionContent: { flex: 1, minWidth: 0 },
  actionTitle: {
    fontFamily: "var(--font-heading)",
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: "0.15rem",
  },
  actionDesc: {
    fontSize: "0.82rem",
    color: "#94A3B8",
    lineHeight: "1.4",
    margin: 0,
  },
  actionArrow: {
    fontSize: "1.2rem",
    color: "#64748B",
    fontWeight: "300",
    flexShrink: 0,
  },
  emptyIconContainer: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "rgba(56, 189, 248, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "0.4rem",
  },
  cardanoCard: {
    padding: "1.5rem",
    background: "linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
  },
  cardanoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "1.2rem",
  },
  cardanoStat: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  cardanoLabel: {
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  cardanoValue: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#F8FAFC",
  },
  cardanoFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "1.2rem",
    paddingTop: "1rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  },
};
