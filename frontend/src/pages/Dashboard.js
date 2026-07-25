import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Icon({ d, size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  wallet:   "M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 7v13a2 2 0 0 0 2 2h16v-5 M18 12a1 1 0 0 0 0 2 1 1 0 0 0 0-2",
  transfer: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  chain:    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  market:   "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  history:  "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};

const QUICK_ACTIONS = [
  {
    id: "action-transfer",
    label: "Send Tokens",
    description: "Transfer MKT tokens instantly to any user wallet",
    icon: ICONS.transfer,
    iconBg: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
    route: "/transfer",
  },
  {
    id: "action-marketplace",
    label: "Explore Marketplace",
    description: "Browse, buy, or list items in the store",
    icon: ICONS.market,
    iconBg: "linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)",
    route: "/marketplace",
  },
  {
    id: "action-chain-verify",
    label: "Verify Blockchain",
    description: "Inspect block hashes and audit chain integrity",
    icon: ICONS.chain,
    iconBg: "linear-gradient(135deg, #34D399 0%, #059669 100%)",
    route: "/chain-verify",
  },
  {
    id: "action-history",
    label: "Transaction History",
    description: "Review full transaction history and logs",
    icon: ICONS.history,
    iconBg: "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
    route: "/transactions",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchWallet();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={styles.page}>
      <Navbar />

      <main className="bb-container animate-fade-up">
        {/* Header Row */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.welcomeText}>
              {greeting}, <span style={styles.userName}>{user?.username ?? "Trader"}</span> 👋
            </h1>
            <p style={styles.subText}>Here is an overview of your wallet balance and marketplace actions.</p>
          </div>

          <button
            id="btn-refresh-wallet"
            onClick={fetchWallet}
            disabled={loading}
            className="bb-btn bb-btn-outline"
            style={styles.refreshBtn}
            title="Refresh balance"
          >
            <span style={loading ? { display: "inline-block", animation: "spin 0.8s linear infinite" } : {}}>
              <Icon d={ICONS.refresh} size={15} />
            </span>
            Refresh
          </button>
        </div>

        {/* Balance Card */}
        {loading ? (
          <div className="glass-card" style={styles.balanceSkeleton}>
            <div style={styles.skeletonText} />
            <div style={styles.skeletonAmount} />
          </div>
        ) : error ? (
          <div className="glass-card" style={styles.errorBox}>
            <Icon d={ICONS.wallet} size={24} color="#FB7185" />
            <div>
              <strong style={{ color: "#FB7185", fontSize: "0.95rem" }}>Wallet Unavailable</strong>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "0.25rem" }}>{error}</p>
            </div>
            <button id="btn-retry-wallet" onClick={fetchWallet} className="bb-btn bb-btn-outline" style={{ marginLeft: "auto" }}>
              Retry
            </button>
          </div>
        ) : (
          <div className="glass-card" style={styles.balanceCard}>
            <div style={styles.balanceLabel}>
              <Icon d={ICONS.wallet} size={16} color="#38BDF8" />
              <span>Wallet Balance</span>
              {wallet?.walletId && (
                <span className="bb-badge bb-badge-cyan">#{wallet.walletId}</span>
              )}
            </div>

            <div style={styles.balanceDisplay} id="balance-display">
              {Number(wallet?.balance ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span style={styles.currencySymbol}>MKT</span>
            </div>

            <p style={styles.balanceSubtext}>Official BlockBazaar Network Tokens</p>
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
              <span style={styles.statTitle}>Network Status</span>
              <span style={{ ...styles.statValue, color: "#34D399" }}>
                Active (Online)
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

        {/* Recent Activity */}
        <section style={{ marginTop: "2.5rem" }}>
          <h2 style={styles.sectionHeader}>Recent Activity</h2>
          <div className="glass-card" style={styles.emptyState}>
            <div style={styles.emptyIconContainer}>
              <Icon d={ICONS.history} size={32} color="#38BDF8" />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#F8FAFC" }}>No Activity Recorded</h3>
            <p style={{ fontSize: "0.88rem", color: "#94A3B8", maxWidth: "400px" }}>
              Start by transferring tokens to another user or buying items in the marketplace.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
  },
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "2rem",
  },
  welcomeText: {
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  userName: {
    color: "#38BDF8",
  },
  subText: {
    fontSize: "0.92rem",
    color: "#94A3B8",
    marginTop: "0.3rem",
  },
  refreshBtn: {
    padding: "0.5rem 1rem",
    fontSize: "0.85rem",
  },
  balanceCard: {
    padding: "2.5rem 2rem",
    textAlign: "center",
    background: "linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.25)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(56, 189, 248, 0.12)",
  },
  balanceLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  balanceDisplay: {
    fontFamily: "var(--font-heading)",
    fontSize: "3.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #F8FAFC 0%, #38BDF8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: "1.1",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "0.5rem",
  },
  currencySymbol: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#38BDF8",
    WebkitTextFillColor: "#38BDF8",
  },
  balanceSubtext: {
    fontSize: "0.82rem",
    color: "#64748B",
    marginTop: "0.6rem",
  },
  balanceSkeleton: {
    height: "180px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  skeletonText: {
    width: "120px",
    height: "16px",
    background: "rgba(255, 255, 255, 0.06)",
    borderRadius: "4px",
  },
  skeletonAmount: {
    width: "240px",
    height: "48px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
  },
  errorBox: {
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    borderColor: "rgba(251, 113, 133, 0.3)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginTop: "1.25rem",
  },
  statCard: {
    padding: "1.2rem 1.4rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  statTitle: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  statValue: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.25rem",
    fontWeight: "700",
  },
  sectionHeader: {
    fontSize: "1.15rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#F8FAFC",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.2rem",
  },
  actionCard: {
    padding: "1.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    position: "relative",
  },
  actionIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#F8FAFC",
  },
  actionDesc: {
    fontSize: "0.82rem",
    color: "#94A3B8",
    marginTop: "0.25rem",
    lineHeight: "1.4",
  },
  actionArrow: {
    color: "#38BDF8",
    fontSize: "1.1rem",
    fontWeight: "700",
  },
  emptyState: {
    padding: "3rem 1.5rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.8rem",
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
};
