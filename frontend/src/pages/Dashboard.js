import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../services/api";

// ─── Keyframes injected once ──────────────────────────────────────────────────
const CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.88); }
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
    background: rgba(22,33,62,0.75);
    border: 1px solid rgba(79,195,247,0.14);
    border-radius: 14px;
    padding: 1.5rem 1.4rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    text-align: left;
    color: #eee;
    font-family: inherit;
  }
  .db-action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 32px rgba(0,0,0,0.4);
    border-color: rgba(79,195,247,0.35);
  }
  .db-action-card:disabled {
    opacity: 0.42;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .db-action-card .db-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .db-refresh-btn:hover {
    background: rgba(79,195,247,0.15) !important;
    color: #4fc3f7 !important;
  }
`;

// ─── Tiny SVG icon ─────────────────────────────────────────────────────────────
function Icon({ d, size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

// ─── Quick-action card ────────────────────────────────────────────────────────
function ActionCard({ icon, iconBg, label, description, onClick, disabled, id }) {
  return (
    <button
      id={id}
      className="db-action-card"
      onClick={onClick}
      disabled={disabled}
      style={{ width: "100%" }}
    >
      <div className="db-card-icon" style={{ background: iconBg }}>
        <Icon d={icon} size={20} color="#fff" />
      </div>
      <div>
        <div style={s.cardLabel}>{label}</div>
        <div style={s.cardDesc}>{description}</div>
      </div>
      {!disabled && (
        <div style={s.cardArrow}>→</div>
      )}
      {disabled && (
        <span style={s.soonTag}>Coming soon</span>
      )}
    </button>
  );
}

// ─── Skeleton loader for the balance card ─────────────────────────────────────
function BalanceSkeleton() {
  const shimmer = {
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.6s infinite linear",
    borderRadius: "6px",
  };
  return (
    <div style={s.balanceCard}>
      <div style={{ ...shimmer, height: 14, width: 100, marginBottom: "1.2rem" }} />
      <div style={{ ...shimmer, height: 52, width: 200, margin: "0 auto 1rem" }} />
      <div style={{ ...shimmer, height: 12, width: 140, margin: "0 auto" }} />
    </div>
  );
}

// ─── Icon paths ───────────────────────────────────────────────────────────────
const I = {
  wallet:   "M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 7v13a2 2 0 0 0 2 2h16v-5 M18 12a1 1 0 0 0 0 2 1 1 0 0 0 0-2",
  transfer: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  chain:    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  market:   "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  history:  "M12 2v10l4 2 M20.88 18.09A5 5 0 1 1 7.67 6.41 M22 12A10 10 0 1 1 3.34 7",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};

const QUICK_ACTIONS = [
  {
    id: "action-transfer",
    label: "Send Tokens",
    description: "Transfer BBZ to another user instantly",
    icon: I.transfer,
    iconBg: "linear-gradient(135deg, #0288d1, #0050a0)",
    route: "/transfer",
    disabled: true,
  },
  {
    id: "action-chain-verify",
    label: "Verify Chain",
    description: "Audit the blockchain for tampering",
    icon: I.chain,
    iconBg: "linear-gradient(135deg, #2e7d32, #1b5e20)",
    route: "/chain-verify",
    disabled: false,
  },
  {
    id: "action-marketplace",
    label: "Marketplace",
    description: "Browse and buy digital items",
    icon: I.market,
    iconBg: "linear-gradient(135deg, #6a1b9a, #4a148c)",
    route: "/marketplace",
    disabled: false,
  },
  {
    id: "action-history",
    label: "Transaction History",
    description: "View your past transfers and purchases",
    icon: I.history,
    iconBg: "linear-gradient(135deg, #e65100, #bf360c)",
    route: "/transactions",
    disabled: true,
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wallet,  setWallet]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

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

  useEffect(() => { fetchWallet(); }, []);

  // Greeting time-of-day
  const hour    = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={s.page}>
      <style>{CSS}</style>
      <Navbar />

      <main style={s.main}>

        {/* ── Page header ── */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>
              {greeting}, <span style={s.userName}>{user?.username ?? "user"}</span> 👋
            </h1>
            <p style={s.pageSub}>Here's an overview of your BlockBazaar account.</p>
          </div>
          <button
            id="btn-refresh-wallet"
            className="db-refresh-btn"
            onClick={fetchWallet}
            disabled={loading}
            style={s.refreshBtn}
            title="Refresh balance"
          >
            <span style={loading ? { display: "inline-block", animation: "spin 0.8s linear infinite" } : {}}>
              <Icon d={I.refresh} size={15} />
            </span>
            Refresh
          </button>
        </div>

        {/* ── Balance card ── */}
        {loading ? (
          <BalanceSkeleton />
        ) : error ? (
          <div style={s.errorCard}>
            <span style={s.errorIcon}>⚠</span>
            <div>
              <strong style={{ color: "#ff9999" }}>Wallet unavailable</strong>
              <p style={s.errorText}>{error}</p>
            </div>
            <button id="btn-retry-wallet" onClick={fetchWallet} style={s.retryBtn}>Retry</button>
          </div>
        ) : (
          <div style={s.balanceCard}>
            <div style={s.balanceLabel}>
              <Icon d={I.wallet} size={14} color="#4fc3f7" />
              <span>Wallet Balance</span>
              {wallet?.walletId && (
                <span style={s.walletId}>#{wallet.walletId}</span>
              )}
            </div>
            <div style={s.balanceAmount} id="balance-display">
              {Number(wallet?.balance ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span style={s.balanceCurrency}>BBZ</span>
            </div>
            <div style={s.balanceNote}>BlockBazaar Tokens</div>
          </div>
        )}

        {/* ── Stats row ── */}
        {wallet && !loading && !error && (
          <div style={s.statsRow}>
            {[
              { label: "Available",  value: `${Number(wallet.balance ?? 0).toFixed(2)} BBZ`, color: "#4fc3f7" },
              { label: "Reserved",   value: "0.00 BBZ",  color: "#7a8fa6" },
              { label: "Total In",   value: "—",         color: "#7a8fa6" },
              { label: "Total Out",  value: "—",         color: "#7a8fa6" },
            ].map(({ label, value, color }) => (
              <div key={label} style={s.statBox}>
                <span style={{ ...s.statVal, color }}>{value}</span>
                <span style={s.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Quick actions ── */}
        <section style={s.actionsSection}>
          <h2 style={s.sectionTitle}>Quick Actions</h2>
          <div style={s.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.id}
                id={action.id}
                label={action.label}
                description={action.description}
                icon={action.icon}
                iconBg={action.iconBg}
                disabled={action.disabled}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </section>

        {/* ── Activity placeholder ── */}
        <section style={s.activitySection}>
          <h2 style={s.sectionTitle}>Recent Activity</h2>
          <div style={s.emptyState}>
            <Icon d={I.history} size={32} color="#2a4060" />
            <p style={s.emptyText}>No transactions yet.<br />Send tokens or buy from the marketplace to get started.</p>
          </div>
        </section>

      </main>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a1a2e 0%, #0d1b35 100%)",
    color: "#eee",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  main: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "2.2rem 1.5rem 4rem",
  },

  // page header
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.8rem",
    flexWrap: "wrap",
    gap: "1rem",
    animation: "fadeUp 0.35s ease",
  },
  pageTitle: {
    margin: 0,
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#ddeeff",
  },
  userName: {
    color: "#4fc3f7",
  },
  pageSub: {
    margin: "0.3rem 0 0",
    color: "#5a7a9a",
    fontSize: "0.92rem",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.4rem 0.9rem",
    borderRadius: "7px",
    border: "1px solid rgba(79,195,247,0.2)",
    background: "rgba(79,195,247,0.06)",
    color: "#5a8aa0",
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: "background 0.18s, color 0.18s",
  },

  // balance card
  balanceCard: {
    background: "linear-gradient(135deg, rgba(22,33,62,0.9) 0%, rgba(10,28,55,0.95) 100%)",
    border: "1px solid rgba(79,195,247,0.2)",
    borderRadius: "18px",
    padding: "2.2rem",
    textAlign: "center",
    boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(79,195,247,0.1)",
    animation: "countUp 0.4s ease",
    marginBottom: "1rem",
  },
  balanceLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    color: "#5a8aa0",
    fontSize: "0.82rem",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "0.9rem",
  },
  walletId: {
    background: "rgba(79,195,247,0.1)",
    color: "#4fc3f7",
    fontSize: "0.72rem",
    padding: "1px 7px",
    borderRadius: "999px",
    marginLeft: "4px",
  },
  balanceAmount: {
    fontSize: "3.2rem",
    fontWeight: 800,
    background: "linear-gradient(90deg, #4fc3f7 0%, #81d4fa 60%, #b3e5fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "0.4rem",
  },
  balanceCurrency: {
    fontSize: "1.2rem",
    fontWeight: 600,
    WebkitTextFillColor: "#4fc3f7",
    opacity: 0.7,
  },
  balanceNote: {
    marginTop: "0.5rem",
    color: "#2a4060",
    fontSize: "0.8rem",
    letterSpacing: "0.04em",
  },

  // stats row
  statsRow: {
    display: "flex",
    justifyContent: "space-around",
    background: "rgba(15,28,52,0.6)",
    border: "1px solid rgba(79,195,247,0.08)",
    borderRadius: "12px",
    padding: "1.1rem 0.5rem",
    marginBottom: "2.2rem",
    animation: "fadeUp 0.45s ease",
    flexWrap: "wrap",
    gap: "1rem",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
    minWidth: "80px",
  },
  statVal:   { fontWeight: 700, fontSize: "0.95rem" },
  statLabel: { fontSize: "0.73rem", color: "#3a5a74", letterSpacing: "0.05em", textTransform: "uppercase" },

  // error card
  errorCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    background: "rgba(140,30,30,0.15)",
    border: "1px solid rgba(255,100,100,0.3)",
    borderRadius: "12px",
    padding: "1.2rem 1.5rem",
    marginBottom: "1.5rem",
    animation: "fadeUp 0.3s ease",
    flexWrap: "wrap",
  },
  errorIcon: { fontSize: "1.3rem", color: "#ff6464" },
  errorText: { margin: "0.2rem 0 0", color: "#cc7070", fontSize: "0.88rem" },
  retryBtn: {
    marginLeft: "auto",
    padding: "0.35rem 0.9rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,100,100,0.3)",
    background: "transparent",
    color: "#cc7070",
    cursor: "pointer",
    fontSize: "0.83rem",
    alignSelf: "center",
  },

  // quick actions
  actionsSection: { animation: "fadeUp 0.5s ease", marginBottom: "2.5rem" },
  sectionTitle: {
    fontSize: "0.8rem",
    color: "#3a5a74",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "1rem",
    marginTop: 0,
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
    gap: "1rem",
  },
  cardLabel: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "#d0e8f5",
  },
  cardDesc: {
    fontSize: "0.8rem",
    color: "#4a6a84",
    lineHeight: 1.5,
  },
  cardArrow: {
    color: "#4fc3f7",
    fontSize: "0.9rem",
    marginTop: "auto",
    opacity: 0.7,
  },
  soonTag: {
    fontSize: "0.68rem",
    background: "rgba(79,195,247,0.08)",
    color: "#3a6080",
    padding: "2px 7px",
    borderRadius: "4px",
    letterSpacing: "0.04em",
    marginTop: "auto",
    display: "inline-block",
    width: "fit-content",
  },

  // activity
  activitySection: { animation: "fadeUp 0.55s ease" },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "3rem 1rem",
    background: "rgba(10,20,40,0.4)",
    border: "1px dashed rgba(79,195,247,0.1)",
    borderRadius: "14px",
    textAlign: "center",
  },
  emptyText: {
    color: "#2a4a60",
    fontSize: "0.9rem",
    lineHeight: 1.7,
    margin: 0,
  },
};
