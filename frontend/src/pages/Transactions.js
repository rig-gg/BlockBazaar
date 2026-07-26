import { useState, useEffect } from "react";
import api from "../services/api";
import Icon from "../components/Icon";
import ICONS from "../constants/icons";
import PageLayout from "../components/PageLayout";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedHash, setCopiedHash] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCopyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash).catch(() => {});
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <PageLayout>
      <div style={styles.headerRow}>
        <div>
          <span className="bb-badge bb-badge-amber">On-Chain Ledger</span>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", marginTop: "0.4rem" }}>Transactions</h1>
          <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            Immutable audit history of token transfers, marketplace purchases, and block receipts.
          </p>
        </div>
        <button className="bb-btn bb-btn-outline" onClick={fetchTransactions} disabled={loading}>
          Refresh Ledger
        </button>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
          Loading ledger history...
        </div>
      ) : error ? (
        <div className="glass-card" style={styles.errorBox}>
          <Icon d={ICONS.alert} size={20} color="#FB7185" />
          <div>
            <strong style={{ color: "#FB7185" }}>Ledger Error</strong>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>{error}</p>
          </div>
          <button onClick={fetchTransactions} className="bb-btn bb-btn-outline" style={{ marginLeft: "auto" }}>
            Retry
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="glass-card" style={styles.emptyCard}>
          <div style={styles.iconCircle}>
            <Icon d={ICONS.history} size={30} color="#FBBF24" />
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>No Transactions Recorded</h3>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", maxWidth: "380px" }}>
            Transfer tokens or interact with marketplace listings to populate your ledger.
          </p>
        </div>
      ) : (
        <div className="glass-card" style={styles.tableCard}>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Block #</th>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Sender</th>
                  <th style={styles.th}>Receiver</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => {
                  const typeLower = (tx.type || "").toLowerCase();
                  const isTransfer = typeLower.includes("transfer");
                  const isBuy = typeLower.includes("buy") || typeLower.includes("purchase");

                  return (
                    <tr key={index} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "700", color: "#38BDF8" }}>
                        #{tx.blockIndex ?? "—"}
                      </td>
                      <td style={{ ...styles.td, color: "#94A3B8" }}>
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "—"}
                      </td>
                      <td style={styles.td}>
                        <span className={`bb-badge ${isTransfer ? "bb-badge-cyan" : isBuy ? "bb-badge-emerald" : "bb-badge-amber"}`}>
                          {tx.type || "TRANSFER"}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>@{tx.sender || "System"}</td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>@{tx.receiver || "System"}</td>
                      <td style={{ ...styles.td, fontFamily: "var(--font-heading)", fontWeight: "700", color: "#F8FAFC" }}>
                        {tx.amount ? `${Number(tx.amount).toFixed(2)} MKT` : "—"}
                      </td>
                      <td style={styles.td}>
                        {tx.hash ? (
                          <button onClick={() => handleCopyHash(tx.hash)} style={styles.hashBtn} title="Click to copy hash">
                            <code>{tx.hash.substring(0, 14)}...</code>
                            <Icon d={copiedHash === tx.hash ? ICONS.check : ICONS.copy} size={13} color={copiedHash === tx.hash ? "#34D399" : "#94A3B8"} />
                          </button>
                        ) : (
                          <span style={{ color: "#64748B" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

const styles = {
  headerRow: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    gap: "1rem", flexWrap: "wrap", marginBottom: "2rem",
  },
  errorBox: { padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" },
  emptyCard: {
    padding: "3.5rem 1.5rem", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem",
  },
  iconCircle: {
    width: "60px", height: "60px", borderRadius: "50%",
    background: "rgba(251, 191, 36, 0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  tableCard: { padding: "0.5rem", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: {
    padding: "1rem 1.2rem", fontSize: "0.78rem", fontWeight: "700", color: "#64748B",
    textTransform: "uppercase", letterSpacing: "0.05em",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  },
  tr: { borderBottom: "1px solid rgba(255, 255, 255, 0.04)", transition: "background 0.2s" },
  td: { padding: "1rem 1.2rem", fontSize: "0.88rem", color: "#CBD5E1" },
  hashBtn: {
    display: "inline-flex", alignItems: "center", gap: "0.4rem",
    background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "0.3rem 0.6rem", borderRadius: "6px", cursor: "pointer", color: "#38BDF8",
  },
};
