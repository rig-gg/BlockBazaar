import { useState } from "react";
import api from "../services/api";
import Icon from "../components/Icon";
import ICONS from "../constants/icons";
import PageLayout from "../components/PageLayout";

const HASH_REGEX = /^[0-9a-f]{64}$/i;

export default function Cardano() {
  const [txHash, setTxHash] = useState("");
  const [txResult, setTxResult] = useState(null);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState("");

  const lookupTx = async (e) => {
    e.preventDefault();
    if (!txHash.trim()) return;

    if (!HASH_REGEX.test(txHash.trim())) {
      setTxError("Invalid hash format. Must be exactly 64 hexadecimal characters.");
      return;
    }

    setTxLoading(true);
    setTxError("");
    setTxResult(null);
    try {
      const { data } = await api.get(`/cardano/tx/${txHash.trim()}`);
      setTxResult(data);
    } catch (err) {
      setTxError(err.message || "Transaction not found");
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <PageLayout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Cardano Explorer</h1>
          <p style={styles.subtitle}>Look up real Cardano mainnet transactions via Blockfrost API</p>
        </div>
      </div>

      <section className="glass-card" style={styles.lookupCard}>
        <h2 style={styles.sectionTitle}>
          <Icon d={ICONS.hash} size={18} color="#38BDF8" />
          Transaction Lookup
        </h2>
        <form onSubmit={lookupTx} style={styles.searchForm}>
          <input
            className="bb-input"
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Enter a Cardano transaction hash (64 hex characters)"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="bb-btn bb-btn-primary"
            disabled={txLoading || !txHash.trim()}
          >
            {txLoading ? (
              <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
                <Icon d={ICONS.refresh} size={16} />
              </span>
            ) : (
              <Icon d={ICONS.search} size={16} />
            )}
            Search
          </button>
        </form>

        {txError && (
          <div style={styles.errorBox} className="animate-scale-in">
            <Icon d={ICONS.x} size={18} color="#FB7185" />
            <span>{txError}</span>
          </div>
        )}

        {txResult && (
          <div style={styles.resultBox} className="animate-fade-up">
            <div style={styles.resultHeader}>
              <Icon d={ICONS.check} size={18} color="#34D399" />
              <span style={{ color: "#34D399", fontWeight: "600" }}>Transaction Found</span>
            </div>
            <div style={styles.resultGrid}>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Hash</span>
                <span style={styles.resultValueMono}>{txResult.hash}</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Block</span>
                <span style={styles.resultValue}>#{txResult.blockHeight?.toLocaleString()}</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Slot</span>
                <span style={styles.resultValue}>{txResult.slot?.toLocaleString() ?? "\u2014"}</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Index</span>
                <span style={styles.resultValue}>{txResult.index}</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Fee</span>
                <span style={styles.resultValue}>{txResult.fee ? `${Number(txResult.fee).toLocaleString()} lovelace` : "\u2014"}</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Output</span>
                <span style={styles.resultValue}>{txResult.outputSum ? `${Number(txResult.outputSum).toLocaleString()} lovelace` : "\u2014"}</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>UTXOs</span>
                <span style={styles.resultValue}>{txResult.outputCount ?? "\u2014"}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <p style={{ fontSize: "0.82rem", color: "#64748B" }}>
          Try searching for a known Cardano transaction hash, or check the{" "}
          <a href="https://cardanoscan.io" target="_blank" rel="noreferrer" style={{ color: "#38BDF8" }}>
            CardanoScan Explorer
          </a>{" "}
          for real transaction hashes.
        </p>
      </section>
    </PageLayout>
  );
}

const styles = {
  header: { marginBottom: "2rem" },
  title: { fontSize: "1.8rem", fontWeight: "700" },
  subtitle: { fontSize: "0.92rem", color: "#94A3B8", marginTop: "0.3rem" },
  lookupCard: { padding: "2rem" },
  sectionTitle: {
    display: "flex", alignItems: "center", gap: "0.5rem",
    fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.2rem", color: "#F8FAFC",
  },
  searchForm: { display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" },
  errorBox: {
    display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "1rem",
    padding: "0.75rem 1rem", background: "rgba(251, 113, 133, 0.12)",
    border: "1px solid rgba(251, 113, 133, 0.3)", borderRadius: "10px",
    color: "#FB7185", fontSize: "0.85rem",
  },
  resultBox: {
    marginTop: "1.2rem", padding: "1.5rem",
    background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(52, 211, 153, 0.25)",
    borderRadius: "12px",
  },
  resultHeader: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" },
  resultGrid: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  resultRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "0.5rem 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  resultLabel: {
    fontSize: "0.82rem", fontWeight: "600", color: "#64748B",
    textTransform: "uppercase", letterSpacing: "0.04em", minWidth: "80px",
  },
  resultValue: {
    fontFamily: "var(--font-heading)", fontSize: "0.92rem", fontWeight: "600",
    color: "#F8FAFC", textAlign: "right",
  },
  resultValueMono: {
    fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: "500",
    color: "#94A3B8", textAlign: "right", wordBreak: "break-all", maxWidth: "400px",
  },
};
