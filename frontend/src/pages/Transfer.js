import { useState, useEffect } from "react";
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
  send:    "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  wallet:  "M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 7v13a2 2 0 0 0 2 2h16v-5 M18 12a1 1 0 0 0 0 2 1 1 0 0 0 0-2",
  alert:   "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  check:   "M20 6L9 17l-5-5",
  arrowRight: "M14 5l7 7m0 0l-7 7m7-7H3",
};

export default function Transfer() {
  const [recipientUsername, setRecipientUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    async function loadWallet() {
      try {
        const { data } = await api.get("/wallet");
        setWallet(data);
      } catch (err) {
        // Silently fail if wallet check fails
      }
    }
    loadWallet();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!recipientUsername.trim()) {
      setError("Please enter a recipient's username.");
      return;
    }
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter an amount greater than 0 MKT.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/transactions/transfer", {
        receiverUsername: recipientUsername.trim(),
        amount: numericAmount,
      });

      setSuccess(data.message || `Successfully transferred ${numericAmount.toFixed(2)} MKT to @${recipientUsername.trim()}!`);
      setRecipientUsername("");
      setAmount("");

      // Refresh wallet balance
      const { data: updatedWallet } = await api.get("/wallet");
      setWallet(updatedWallet);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Transfer failed. Please verify recipient username and balance.");
    } finally {
      setLoading(false);
    }
  };

  const setPercentageAmount = (pct) => {
    if (!wallet || !wallet.balance) return;
    const calc = (Number(wallet.balance) * pct).toFixed(2);
    setAmount(calc);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <main className="bb-container animate-fade-up">
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <span className="bb-badge bb-badge-cyan">Instant Peer-to-Peer</span>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "700", marginTop: "0.4rem" }}>Transfer Tokens</h1>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginTop: "0.3rem" }}>
              Send MKT tokens directly to another BlockBazaar username with instant settlement.
            </p>
          </div>
        </div>

        {/* Transfer Grid */}
        <div style={styles.transferGrid}>
          {/* Main Form */}
          <div className="glass-card" style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.iconCircle}>
                <Icon d={ICONS.send} size={18} color="#38BDF8" />
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Send Tokens</h2>
            </div>

            {error && (
              <div style={styles.errorAlert} className="animate-scale-in">
                <Icon d={ICONS.alert} size={16} color="#FB7185" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={styles.successAlert} className="animate-scale-in">
                <Icon d={ICONS.check} size={16} color="#34D399" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div>
                <label style={styles.label}>Recipient Username</label>
                <input
                  id="input-transfer-recipient"
                  className="bb-input"
                  type="text"
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                  placeholder="e.g. sarah_web3"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <label style={styles.label}>Amount (MKT)</label>
                  {wallet && (
                    <span style={{ fontSize: "0.78rem", color: "#38BDF8" }}>
                      Max: {Number(wallet.balance ?? 0).toFixed(2)} MKT
                    </span>
                  )}
                </div>
                <input
                  id="input-transfer-amount"
                  className="bb-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                />

                {/* Quick percentage buttons */}
                {wallet && (
                  <div style={styles.pctRow}>
                    {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        className="bb-btn bb-btn-outline"
                        style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", flex: 1 }}
                        onClick={() => setPercentageAmount(pct)}
                      >
                        {pct === 1.0 ? "MAX" : `${pct * 100}%`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                id="btn-transfer-submit"
                type="submit"
                className="bb-btn bb-btn-primary"
                disabled={loading}
                style={{ width: "100%", marginTop: "0.5rem", padding: "0.85rem" }}
              >
                {loading ? "Processing Transfer..." : "Confirm & Send MKT"}
              </button>
            </form>
          </div>

          {/* Transfer Summary Preview */}
          <div className="glass-card" style={styles.summaryCard}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.8rem" }}>
              <Icon d={ICONS.wallet} size={16} color="#38BDF8" />
              <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Transfer Summary</h3>
            </div>

            <div style={styles.summaryDetails}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Sender Wallet</span>
                <span style={styles.summaryVal}>{wallet ? `#${wallet.walletId}` : "—"}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Recipient</span>
                <span style={styles.summaryVal}>
                  {recipientUsername.trim() ? `@${recipientUsername.trim()}` : "Not specified"}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Network Fee</span>
                <span style={{ color: "#34D399", fontWeight: "600", fontSize: "0.85rem" }}>Free (0.00 MKT)</span>
              </div>
              <div style={{ ...styles.summaryRow, borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.8rem", marginTop: "0.4rem" }}>
                <span style={styles.summaryLabel}>Total Deduction</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: "800", color: "#38BDF8" }}>
                  {amount && !isNaN(Number(amount)) ? Number(amount).toFixed(2) : "0.00"} MKT
                </span>
              </div>
            </div>

            <div style={styles.noticeBox}>
              <Icon d={ICONS.arrowRight} size={14} color="#94A3B8" />
              <span>Transfers execute immediately on block submission.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  headerRow: {
    marginBottom: "2rem",
  },
  transferGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "1.8rem",
    alignItems: "flex-start",
  },
  card: {
    padding: "1.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
  },
  iconCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#CBD5E1",
    marginBottom: "0.35rem",
    display: "block",
  },
  pctRow: {
    display: "flex",
    gap: "0.4rem",
    marginTop: "0.5rem",
  },
  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.75rem 1rem",
    background: "rgba(251, 113, 133, 0.12)",
    border: "1px solid rgba(251, 113, 133, 0.3)",
    borderRadius: "10px",
    color: "#FB7185",
    fontSize: "0.85rem",
  },
  successAlert: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.75rem 1rem",
    background: "rgba(52, 211, 153, 0.12)",
    border: "1px solid rgba(52, 211, 153, 0.3)",
    borderRadius: "10px",
    color: "#34D399",
    fontSize: "0.85rem",
  },
  summaryCard: {
    padding: "1.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  summaryDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: "0.85rem",
    color: "#94A3B8",
  },
  summaryVal: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#F8FAFC",
  },
  noticeBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.8rem",
    color: "#94A3B8",
    background: "rgba(15, 23, 42, 0.6)",
    padding: "0.6rem 0.8rem",
    borderRadius: "8px",
  },
};
