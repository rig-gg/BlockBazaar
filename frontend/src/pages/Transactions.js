import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

// ─── Keyframes and CSS ────────────────────────────────────────────────────────
const CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }

  .tx-table-container {
    background: linear-gradient(135deg, rgba(22,33,62,0.85) 0%, rgba(10,28,55,0.9) 100%);
    border: 1px solid rgba(79,195,247,0.15);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    overflow-x: auto;
    animation: fadeUp 0.4s ease both;
  }

  .tx-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .tx-table th {
    padding: 1rem;
    color: #5a8aa0;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(79,195,247,0.15);
    white-space: nowrap;
  }

  .tx-table td {
    padding: 1rem;
    color: #ddeeff;
    font-size: 0.9rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    white-space: nowrap;
    transition: background 0.2s;
  }

  .tx-table tbody tr {
    transition: background 0.15s;
  }

  .tx-table tbody tr:hover td {
    background: rgba(79,195,247,0.05);
  }

  .tx-table tbody tr:last-child td {
    border-bottom: none;
  }

  .tx-type-badge {
    display: inline-block;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .tx-type-transfer {
    background: rgba(2, 136, 209, 0.15);
    color: #4fc3f7;
    border: 1px solid rgba(2, 136, 209, 0.3);
  }
  .tx-type-purchase {
    background: rgba(106, 27, 154, 0.15);
    color: #ce93d8;
    border: 1px solid rgba(106, 27, 154, 0.3);
  }
  .tx-type-unknown {
    background: rgba(120, 144, 156, 0.15);
    color: #b0bec5;
    border: 1px solid rgba(120, 144, 156, 0.3);
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
  history: "M12 2v10l4 2 M20.88 18.09A5 5 0 1 1 7.67 6.41 M22 12A10 10 0 1 1 3.34 7",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
};

// ─── Table Skeleton ──────────────────────────────────────────────────────────
function TableSkeleton() {
  const shimmer = {
    background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.6s infinite linear",
    borderRadius: "4px",
    height: "18px",
  };
  return (
    <div className="tx-table-container">
      <table className="tx-table">
        <thead>
          <tr>
            {["Block", "Time", "Type", "Sender", "Receiver", "Amount", "Hash"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td><div style={{ ...shimmer, width: "30px" }} /></td>
              <td><div style={{ ...shimmer, width: "120px" }} /></td>
              <td><div style={{ ...shimmer, width: "70px", borderRadius: "6px", height: "22px" }} /></td>
              <td><div style={{ ...shimmer, width: "80px" }} /></td>
              <td><div style={{ ...shimmer, width: "80px" }} /></td>
              <td><div style={{ ...shimmer, width: "60px" }} /></td>
              <td><div style={{ ...shimmer, width: "100px" }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message || "Failed to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div style={s.page}>
      <style>{CSS}</style>
      <Navbar />

      <main style={s.main}>
        {/* ── Page Header ── */}
        <div style={s.header}>
          <div style={s.iconWrap}>
            <Icon d={I.history} size={24} color="#ff9800" />
          </div>
          <div>
            <h1 style={s.title}>Transaction History</h1>
            <p style={s.subtitle}>A complete ledger of your past transfers and marketplace purchases.</p>
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div style={s.errorCard}>
            <Icon d={I.alert} size={20} color="#ff6464" />
            <div>
              <strong style={{ color: "#ff9999", display: "block", marginBottom: "0.2rem" }}>
                Error loading history
              </strong>
              <p style={{ margin: 0, color: "#cc7070", fontSize: "0.88rem" }}>{error}</p>
            </div>
            <button onClick={fetchTransactions} style={s.retryBtn}>Retry</button>
          </div>
        ) : transactions.length === 0 ? (
          <div style={s.emptyState}>
            <Icon d={I.history} size={36} color="#2a4060" />
            <div style={s.emptyText}>No transactions found on the blockchain yet.</div>
          </div>
        ) : (
          <div className="tx-table-container">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Block #</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => {
                  const isTransfer = tx.type?.toLowerCase() === "transfer";
                  const isPurchase = tx.type?.toLowerCase() === "purchase";
                  const badgeClass = isTransfer ? "tx-type-transfer" : isPurchase ? "tx-type-purchase" : "tx-type-unknown";
                  
                  return (
                    <tr key={index} style={{ animationDelay: `${index * 0.05}s` }}>
                      <td style={{ color: "#8ab8d0", fontWeight: 600 }}>{tx.blockIndex}</td>
                      <td style={{ color: "#a0b8d0" }}>
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "—"}
                      </td>
                      <td>
                        <span className={`tx-type-badge ${badgeClass}`}>
                          {tx.type || "Unknown"}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, color: "#d0e8f5" }}>{tx.sender || "—"}</td>
                      <td style={{ fontWeight: 500, color: "#d0e8f5" }}>{tx.receiver || "—"}</td>
                      <td style={{ fontWeight: 700, color: "#4fc3f7" }}>
                        {tx.amount ? `${Number(tx.amount).toFixed(2)} BBZ` : "—"}
                      </td>
                      <td style={{ fontFamily: "monospace", color: "#5a7a9a", fontSize: "0.85rem" }}>
                        {tx.hash ? `${tx.hash.substring(0, 16)}…` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
    maxWidth: 1000,
    margin: "0 auto",
    padding: "2.5rem 1.5rem 5rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
    marginBottom: "2rem",
    animation: "fadeUp 0.3s ease",
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: "14px",
    background: "linear-gradient(135deg, rgba(230,81,0,0.15), rgba(191,54,12,0.2))",
    border: "1px solid rgba(230,81,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(230,81,0,0.15)",
  },
  title: {
    margin: 0,
    fontSize: "1.7rem",
    fontWeight: 700,
    color: "#ddeeff",
    letterSpacing: "0.02em",
  },
  subtitle: {
    margin: "0.3rem 0 0",
    color: "#5a7a9a",
    fontSize: "0.95rem",
  },
  errorCard: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
    background: "rgba(140,30,30,0.15)",
    border: "1px solid rgba(255,100,100,0.3)",
    borderRadius: "12px",
    padding: "1.5rem",
    animation: "fadeUp 0.3s ease",
  },
  retryBtn: {
    marginLeft: "auto",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,100,100,0.4)",
    background: "rgba(255,100,100,0.1)",
    color: "#ff9999",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    transition: "background 0.2s",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "5rem 1rem",
    background: "rgba(10,20,40,0.4)",
    border: "1px dashed rgba(79,195,247,0.15)",
    borderRadius: "14px",
    animation: "fadeUp 0.4s ease",
  },
  emptyText: {
    color: "#4a6a84",
    fontSize: "0.95rem",
    fontWeight: 500,
  },
};
