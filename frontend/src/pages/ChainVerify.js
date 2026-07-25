import { useState, useCallback } from "react";
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
  chain: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  shieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  check: "M20 6L9 17l-5-5",
};

export default function ChainVerify() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const verify = useCallback(async () => {
    setStatus("loading");
    setResult(null);
    setErrMsg("");
    try {
      const { data } = await api.get("/chain/verify");
      setResult(data);
      setStatus("success");
    } catch (err) {
      setErrMsg(err.response?.data?.message || err.message || "Blockchain verification failed.");
      setStatus("error");
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <main className="bb-container animate-fade-up" style={{ maxWidth: "840px" }}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.iconCircle}>
            <Icon d={ICONS.chain} size={32} color="#34D399" />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "0.8rem" }}>
            Blockchain Integrity Inspector
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", marginTop: "0.4rem", maxWidth: "560px", margin: "0.4rem auto 0", lineHeight: "1.5" }}>
            Cryptographically verify every block in the ledger. Confirm block sequence, previous hash linkages, and transaction proof integrity.
          </p>

          <button
            id="btn-verify-chain"
            onClick={verify}
            disabled={status === "loading"}
            className="bb-btn bb-btn-emerald"
            style={{ padding: "0.85rem 2rem", fontSize: "1rem", marginTop: "1.5rem" }}
          >
            {status === "loading" ? "Auditing Block Hashes..." : "Run Chain Audit"}
          </button>
        </div>

        {/* Error Card */}
        {status === "error" && (
          <div className="glass-card animate-scale-in" style={styles.errorBox}>
            <Icon d={ICONS.alert} size={20} color="#FB7185" />
            <div>
              <strong style={{ color: "#FB7185", fontSize: "0.95rem" }}>Audit Failure</strong>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "0.2rem" }}>{errMsg}</p>
            </div>
          </div>
        )}

        {/* Audit Results */}
        {status === "success" && result && (
          <div className="glass-card animate-scale-in" style={styles.resultsCard}>
            <div style={{ textAlign: "center" }}>
              <span className={`bb-badge ${result.valid ? "bb-badge-emerald" : "bb-badge-rose"}`} style={{ fontSize: "0.95rem", padding: "0.4rem 1.2rem" }}>
                {result.valid ? "✓ CHAIN VERIFIED INTACT" : "⚠ TAMPER DETECTED"}
              </span>

              <p style={{ fontSize: "0.92rem", color: "#CBD5E1", marginTop: "1rem" }}>
                {result.message}
              </p>
            </div>

            {/* Metrics */}
            <div style={styles.metricsGrid}>
              <div className="glass-card" style={styles.metricBox}>
                <span style={styles.metricLabel}>Total Blocks</span>
                <span style={{ ...styles.metricVal, color: "#38BDF8" }}>
                  {result.totalBlocks ?? "0"}
                </span>
              </div>

              <div className="glass-card" style={styles.metricBox}>
                <span style={styles.metricLabel}>Chain Status</span>
                <span style={{ ...styles.metricVal, color: result.valid ? "#34D399" : "#FB7185" }}>
                  {result.valid ? "Pass" : "Fail"}
                </span>
              </div>
            </div>

            {/* Block Breakdown */}
            {Array.isArray(result.blocks) && result.blocks.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", color: "#F8FAFC" }}>
                  Verified Block Ledger
                </h3>

                <div style={styles.blocksList}>
                  {result.blocks.map((b, i) => (
                    <div key={b.blockIndex ?? i} className="glass-card" style={styles.blockRowCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="bb-badge bb-badge-cyan">Block #{b.blockIndex ?? i + 1}</span>
                        {b.timestamp && (
                          <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                            {new Date(b.timestamp).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div style={styles.hashDetail}>
                        <div>
                          <span style={styles.hashLabel}>Current Hash: </span>
                          <code style={{ color: "#38BDF8" }}>{b.hash}</code>
                        </div>
                        {b.previousHash && (
                          <div style={{ marginTop: "0.25rem" }}>
                            <span style={styles.hashLabel}>Previous Hash: </span>
                            <code style={{ color: "#94A3B8" }}>{b.previousHash}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  heroSection: {
    textAlign: "center",
    padding: "3rem 1.5rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconCircle: {
    width: "68px",
    height: "68px",
    borderRadius: "20px",
    background: "rgba(52, 211, 153, 0.12)",
    border: "1px solid rgba(52, 211, 153, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 25px rgba(52, 211, 153, 0.2)",
  },
  errorBox: {
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2rem",
    borderColor: "rgba(251, 113, 133, 0.3)",
  },
  resultsCard: {
    padding: "2.5rem 2rem",
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  metricBox: {
    padding: "1.2rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  metricLabel: {
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  metricVal: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.8rem",
    fontWeight: "800",
  },
  blocksList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  blockRowCard: {
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  hashDetail: {
    fontSize: "0.82rem",
    background: "rgba(15, 23, 42, 0.8)",
    padding: "0.75rem 0.9rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  hashLabel: {
    color: "#64748B",
    fontWeight: "600",
  },
};
