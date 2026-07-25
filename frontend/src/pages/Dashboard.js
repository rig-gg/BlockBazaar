import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../services/api";

// ─── Animations and Dynamic Styling ──────────────────────────────────────────
const CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }

  .db-action-card {
    background: linear-gradient(135deg, rgba(22,33,62,0.85) 0%, rgba(15,28,55,0.9) 100%);
    border: 1px solid rgba(79,195,247,0.15);
    border-radius: 16px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-align: left;
    color: #eee;
    font-family: inherit;
    position: relative;
    overflow: hidden;
  }
  .db-action-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, rgba(79,195,247,0.5), transparent);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .db-action-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.45);
    border-color: rgba(79,195,247,0.4);
  }
  .db-action-card:hover::before {
    opacity: 1;
  }

  .db-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }

  .db-refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid rgba(79,195,247,0.25);
    background: rgba(79,195,247,0.08);
    color: #4fc3f7;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .db-refresh-btn:hover {
    background: rgba(79,195,247,0.18) !important;
    border-color: rgba(79,195,247,0.45) !important;
    box-shadow: 0 0 15px rgba(79,195,247,0.2);
  }
`;

function Icon({ d, size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const I = {
  wallet:   "M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 7v13a2 2 0 0 0 2 2h16v-5 M18 12a1 1 0 0 0 0 2 1 1 0 0 0 0-2",
  transfer: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  chain:    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  market:   "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  history:  "M12 2v10l4 2 M20.88 18.09A5 5 0 1 1 7.67 6.41 M22 12A10 10 0 1 1 3.34 7",
  listings: "M3 6h18 M3 12h18 M3 18h18",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

const ACTION_CARDS = [
  {
    id: "action-transfer",
    title: "Send Tokens",
    description: "Transfer BBZ tokens instantly to any BlockBazaar user",
    icon: I.transfer,
    gradient: "linear-gradient(135deg, #0288d1, #0050a0)",
    path: "/transfer",
  },
  {
    id: "action-marketplace",
    title: "Marketplace",
    description: "Explore digital items and buy assets from the community",
    icon: I.market,
    gradient: "linear-gradient(135deg, #6a1b9a, #4a148c)",
    path: "/marketplace",
  },
  {
    id: "action-my-listings",
    title: "My Listings",
    description: "List new items for sale or manage your active listings",
    icon: I.listings,
    gradient: "linear-gradient(135deg, #00897b, #004d40)",
    path: "/my-listings",
  },
  {
    id: "action-chain-verify",
    title: "Verify Chain",
    description: "Audit the blockchain hash integrity & detect tampering",
    icon: I.chain,
    gradient: "linear-gradient(135deg, #2e7d32, #1b5e20)",
    path: "/chain-verify",
  },
  {
    id: "action-transactions",
    title: "Transaction Ledger",
    description: "View complete history of your past transfers & purchases",
    icon: I.history,
    gradient: "linear-gradient(135deg, #e65100, #bf360c)",
    path: "/transactions",
  },
];

function BalanceSkeleton() {
  const shimmer = {
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.6s infinite linear",
    borderRadius: "6px",
  };
  return (
    <div style={styles.heroCard}>
      <div style={{ ...shimmer, height: 16, width: 120, marginBottom: "1.2rem", margin: "0 auto" }} />
      <div style={{ ...shimmer, height: 56, width: 220, margin: "0 auto 1rem" }} />
      <div style={{ ...shimmer, height: 14, width: 160, margin: "0 auto" }} />
    </div>
  );
}

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
      setError(err.message || "Could not load wallet data.");
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
      <style>{CSS}</style>
      <Navbar />

      <main style={styles.main}>

        {/* ── Header ── */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>
              {greeting}, <span style={styles.username}>{user?.username || "Trader"}</span> 👋
            </h1>
            <p style={styles.subtitle}>Welcome to your BlockBazaar decentralized hub.</p>
          </div>

          <button
            className="db-refresh-btn"
            onClick={fetchWallet}
            disabled={loading}
            title="Refresh balance"
          >
            <span style={loading ? { display: "inline-block", animation: "spin 0.8s linear infinite" } : {}}>
              <Icon d={I.refresh} size={16} />
            </span>
            {loading ? "Updating..." : "Refresh"}
          </button>
        </div>

        {/* ── Balance Card ── */}
        {loading ? (
          <BalanceSkeleton />
        ) : error ? (
          <div style={styles.errorCard}>
            <Icon d={I.shield} size={24} color="#ff6464" />
            <div>
              <strong style={{ color: "#ff9999", display: "block" }}>Wallet Unavailable</strong>
              <p style={{ margin: "0.2rem 0 0", color: "#cc7070", fontSize: "0.9rem" }}>{error}</p>
            </div>
            <button onClick={fetchWallet} style={styles.retryBtn}>Retry</button>
          </div>
        ) : (
          <div style={styles.heroCard}>
            <div style={styles.heroHeader}>
              <div style={styles.heroLabel}>
                <Icon d={I.wallet} size={16} color="#4fc3f7" />
                <span>Total Balance</span>
              </div>
              {wallet?.walletId && (
                <span style={styles.walletBadge}>Wallet #{wallet.walletId}</span>
              )}
            </div>

            <div style={styles.heroAmount}>
              {Number(wallet?.balance ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span style={styles.heroCurrency}>BBZ</span>
            </div>

            <div style={styles.heroFooter}>
              <span style={styles.statusDot} />
              <span>Chain Connected & Secured</span>
            </div>
          </div>
        )}

        {/* ── Stats Strip ── */}
        <div style={styles.statsStrip}>
          <div style={styles.statBox}>
            <span style={{ ...styles.statValue, color: "#4fc3f7" }}>
              {Number(wallet?.balance ?? 0).toFixed(2)} BBZ
            </span>
            <span style={styles.statLabel}>Available</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statBox}>
            <span style={{ ...styles.statValue, color: "#81c784" }}>Active</span>
            <span style={styles.statLabel}>Wallet Status</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statBox}>
            <span style={{ ...styles.statValue, color: "#b39ddb" }}>SHA-256</span>
            <span style={styles.statLabel}>Encryption</span>
          </div>
        </div>

        {/* ── Quick Actions Grid ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.grid}>
            {ACTION_CARDS.map((card) => (
              <button
                key={card.id}
                id={card.id}
                className="db-action-card"
                onClick={() => navigate(card.path)}
              >
                <div className="db-card-icon" style={{ background: card.gradient }}>
                  <Icon d={card.icon} size={22} color="#fff" />
                </div>
                <div>
                  <div style={styles.cardTitle}>{card.title}</div>
                  <div style={styles.cardDesc}>{card.description}</div>
                </div>
                <div style={styles.cardArrow}>Explore →</div>
              </button>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

// ─── Modern Glassmorphism Styling ─────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a1a2e 0%, #0d1b35 100%)",
    color: "#eee",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "2.5rem 1.5rem 5rem",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
    animation: "fadeUp 0.35s ease",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#ddeeff",
  },
  username: {
    color: "#4fc3f7",
  },
  subtitle: {
    margin: "0.3rem 0 0",
    color: "#5a7a9a",
    fontSize: "0.95rem",
  },
  heroCard: {
    background: "linear-gradient(135deg, rgba(22,33,62,0.95) 0%, rgba(10,28,55,0.95) 100%)",
    border: "1px solid rgba(79,195,247,0.25)",
    borderRadius: "20px",
    padding: "2.5rem",
    textAlign: "center",
    boxShadow: "0 10px 45px rgba(0,0,0,0.45), inset 0 1px 0 rgba(79,195,247,0.15)",
    animation: "countUp 0.4s ease",
    marginBottom: "1.5rem",
  },
  heroHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  heroLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    color: "#5a8aa0",
    fontSize: "0.85rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  walletBadge: {
    background: "rgba(79,195,247,0.12)",
    color: "#4fc3f7",
    fontSize: "0.75rem",
    padding: "2px 8px",
    borderRadius: "999px",
    border: "1px solid rgba(79,195,247,0.25)",
    fontWeight: 600,
  },
  heroAmount: {
    fontSize: "3.5rem",
    fontWeight: 800,
    background: "linear-gradient(90deg, #4fc3f7 0%, #81d4fa 60%, #b3e5fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "0.5rem",
  },
  heroCurrency: {
    fontSize: "1.3rem",
    fontWeight: 700,
    WebkitTextFillColor: "#4fc3f7",
    opacity: 0.85,
  },
  heroFooter: {
    marginTop: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    color: "#3a5a74",
    fontSize: "0.82rem",
    fontWeight: 500,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4caf50",
    boxShadow: "0 0 10px #4caf50",
  },
  statsStrip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    background: "rgba(15,28,52,0.6)",
    border: "1px solid rgba(79,195,247,0.1)",
    borderRadius: "14px",
    padding: "1.2rem 1rem",
    marginBottom: "2.5rem",
    animation: "fadeUp 0.45s ease",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
  },
  statValue: {
    fontWeight: 700,
    fontSize: "1rem",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "#4a6a84",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  statDivider: {
    width: 1,
    height: 28,
    background: "rgba(79,195,247,0.1)",
  },
  section: {
    animation: "fadeUp 0.5s ease",
  },
  sectionTitle: {
    fontSize: "0.85rem",
    color: "#5a8aa0",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "1.2rem",
    margin: "0 0 1.2rem 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.2rem",
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: "1.05rem",
    color: "#ddeeff",
  },
  cardDesc: {
    fontSize: "0.85rem",
    color: "#5a7a9a",
    lineHeight: 1.5,
    marginTop: "0.2rem",
  },
  cardArrow: {
    color: "#4fc3f7",
    fontSize: "0.85rem",
    fontWeight: 600,
    marginTop: "auto",
  },
  errorCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "rgba(140,30,30,0.15)",
    border: "1px solid rgba(255,100,100,0.3)",
    borderRadius: "14px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  retryBtn: {
    marginLeft: "auto",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,100,100,0.4)",
    background: "rgba(255,100,100,0.1)",
    color: "#ff9999",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
};