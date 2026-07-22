import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

// ─── Animated ring / spinner ─────────────────────────────────────────────────
const spinnerKeyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-valid {
    0%, 100% { box-shadow: 0 0 0 0 rgba(79, 195, 127, 0.45); }
    50%       { box-shadow: 0 0 0 18px rgba(79, 195, 127, 0); }
  }
  @keyframes pulse-invalid {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 100, 100, 0.45); }
    50%       { box-shadow: 0 0 0 18px rgba(255, 100, 100, 0); }
  }
  @keyframes blockSlide {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;

function InjectStyles() {
  return <style>{spinnerKeyframes}</style>;
}

// ─── Small blockchain-link icon ───────────────────────────────────────────────
function ChainIcon({ size = 32, color = "#4fc3f7" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// ─── Block card (individual block display in the chain) ───────────────────────
function BlockCard({ block, index, isValid }) {
  const accent = isValid ? "#4fc3f7" : "#ff6464";
  return (
    <div style={{
      ...s.blockCard,
      borderColor: accent,
      animationDelay: `${index * 60}ms`,
    }}>
      <div style={s.blockIndex}>Block #{block.blockIndex ?? index + 1}</div>
      <div style={s.blockRow}>
        <span style={s.blockLabel}>Hash</span>
        <span style={{ ...s.blockHash, color: accent }}>
          {block.hash ? `${block.hash.substring(0, 18)}…` : "—"}
        </span>
      </div>
      {block.previousHash && (
        <div style={s.blockRow}>
          <span style={s.blockLabel}>Prev</span>
          <span style={s.blockHash}>
            {block.previousHash.substring(0, 18)}…
          </span>
        </div>
      )}
      {block.timestamp && (
        <div style={s.blockRow}>
          <span style={s.blockLabel}>Time</span>
          <span style={s.blockValue}>
            {new Date(block.timestamp).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ valid }) {
  const color   = valid ? "#4fc3f7" : "#ff6464";
  const bg      = valid ? "rgba(79,195,127,0.12)" : "rgba(255,100,100,0.12)";
  const border  = valid ? "rgba(79,195,127,0.35)" : "rgba(255,100,100,0.35)";
  const pulse   = valid ? "pulse-valid" : "pulse-invalid";
  const label   = valid ? "✓  CHAIN VALID" : "✗  CHAIN INVALID";

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.7rem 1.6rem",
      borderRadius: "999px",
      background: bg,
      border: `1.5px solid ${border}`,
      color,
      fontWeight: 700,
      fontSize: "1.05rem",
      letterSpacing: "0.04em",
      animation: `${pulse} 2.2s ease-in-out infinite`,
    }}>
      {label}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function ChainVerify() {
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [result, setResult]   = useState(null);
  const [errMsg, setErrMsg]   = useState("");


  const verify = useCallback(async () => {
    setStatus("loading");
    setResult(null);
    setErrMsg("");
    try {
      const { data } = await api.get("/chain/verify");
      setResult(data);
      setStatus("success");
    } catch (err) {
      setErrMsg(err.message || "Verification failed.");
      setStatus("error");
    }
  }, []);

  return (
    <div style={s.page}>
      <InjectStyles />
      <Navbar />

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.heroIcon}>
          <ChainIcon size={44} color="#4fc3f7" />
        </div>
        <h1 style={s.heroTitle}>Chain Verification</h1>
        <p style={s.heroSub}>
          Audit the integrity of every block in the BlockBazaar blockchain.
          A single tampered block breaks the chain — verify now to confirm all hashes are intact.
        </p>
      </section>

      {/* ── Verify button ── */}
      <div style={s.btnRow}>
        <button
          id="btn-verify-chain"
          onClick={verify}
          disabled={status === "loading"}
          style={status === "loading" ? { ...s.verifyBtn, opacity: 0.6, cursor: "not-allowed" } : s.verifyBtn}
        >
          {status === "loading" ? (
            <>
              <span style={s.spinner} /> Verifying…
            </>
          ) : (
            <>
              <ChainIcon size={18} color="#000" /> Verify Blockchain
            </>
          )}
        </button>
      </div>

      {/* ── Error state ── */}
      {status === "error" && (
        <div style={s.errorCard}>
          <span style={s.errorIcon}>⚠</span>
          <div>
            <strong>Verification Error</strong>
            <p style={s.errorText}>{errMsg}</p>
          </div>
        </div>
      )}

      {/* ── Success state ── */}
      {status === "success" && result && (
        <div style={s.resultWrapper}>

          {/* Summary card */}
          <div style={s.summaryCard}>
            <StatusBadge valid={result.valid} />

            <div style={s.statsRow}>
              <div style={s.statBox}>
                <span style={s.statNum}>{result.totalBlocks ?? "—"}</span>
                <span style={s.statLabel}>Total Blocks</span>
              </div>
              <div style={s.statDivider} />
              <div style={s.statBox}>
                <span style={{ ...s.statNum, color: result.valid ? "#4fc3f7" : "#ff6464" }}>
                  {result.valid ? "Intact" : "Tampered"}
                </span>
                <span style={s.statLabel}>Chain State</span>
              </div>
            </div>

            <p style={s.message}>{result.message}</p>
          </div>

          {/* Block list (if backend returns them) */}
          {Array.isArray(result.blocks) && result.blocks.length > 0 && (
            <div style={s.blocksSection}>
              <h2 style={s.blocksSectionTitle}>Block Details</h2>
              <div style={s.blocksGrid}>
                {result.blocks.map((block, i) => (
                  <BlockCard
                    key={block.blockIndex ?? i}
                    block={block}
                    index={i}
                    isValid={result.valid}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
    paddingBottom: "4rem",
  },

  /* top bar */
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    borderBottom: "1px solid rgba(79,195,247,0.12)",
    backdropFilter: "blur(6px)",
    background: "rgba(22,33,62,0.7)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(79,195,247,0.3)",
    color: "#4fc3f7",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "background 0.2s",
  },
  appName: {
    color: "#4fc3f7",
    fontWeight: 700,
    fontSize: "1.05rem",
    letterSpacing: "0.04em",
  },

  /* hero */
  hero: {
    textAlign: "center",
    padding: "3.5rem 1.5rem 1.5rem",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "rgba(79,195,247,0.1)",
    border: "1.5px solid rgba(79,195,247,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.2rem",
  },
  heroTitle: {
    margin: "0 0 0.6rem",
    fontSize: "2rem",
    fontWeight: 700,
    background: "linear-gradient(90deg, #4fc3f7 0%, #81d4fa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    margin: 0,
    color: "#8899aa",
    fontSize: "0.97rem",
    lineHeight: 1.7,
  },

  /* verify button */
  btnRow: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem 1rem 0",
  },
  verifyBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.55rem",
    padding: "0.8rem 2.2rem",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)",
    color: "#000",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(79,195,247,0.35)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  spinner: {
    display: "inline-block",
    width: 16,
    height: 16,
    border: "2.5px solid rgba(0,0,0,0.25)",
    borderTopColor: "#000",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  /* error */
  errorCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    background: "rgba(180,40,40,0.15)",
    border: "1px solid rgba(255,100,100,0.35)",
    borderRadius: "10px",
    padding: "1.2rem 1.5rem",
    maxWidth: 520,
    margin: "2rem auto 0",
    animation: "fadeIn 0.3s ease",
  },
  errorIcon: { fontSize: "1.4rem", color: "#ff6464", flexShrink: 0 },
  errorText:  { margin: "0.3rem 0 0", color: "#ff9999", fontSize: "0.9rem" },

  /* result wrapper */
  resultWrapper: {
    maxWidth: 680,
    margin: "2.5rem auto 0",
    padding: "0 1.5rem",
    animation: "fadeIn 0.4s ease",
  },

  /* summary card */
  summaryCard: {
    background: "rgba(22,33,62,0.8)",
    border: "1px solid rgba(79,195,247,0.18)",
    borderRadius: "14px",
    padding: "2rem",
    textAlign: "center",
    backdropFilter: "blur(8px)",
  },

  /* stats */
  statsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    margin: "1.8rem 0 1.2rem",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.3rem",
  },
  statNum:     { fontSize: "2rem", fontWeight: 700, color: "#4fc3f7" },
  statLabel:   { fontSize: "0.8rem", color: "#7a8fa6", letterSpacing: "0.06em", textTransform: "uppercase" },
  statDivider: { width: 1, height: 40, background: "rgba(79,195,247,0.2)" },
  message:     { color: "#a0b8cc", fontSize: "0.95rem", margin: 0, lineHeight: 1.6 },

  /* block list */
  blocksSection: { marginTop: "2rem" },
  blocksSectionTitle: {
    fontSize: "1rem",
    color: "#7a8fa6",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  blocksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "0.9rem",
  },
  blockCard: {
    background: "rgba(15,52,96,0.55)",
    border: "1px solid",
    borderRadius: "10px",
    padding: "1rem 1.1rem",
    animation: "blockSlide 0.35s ease both",
  },
  blockIndex: {
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "#4fc3f7",
    marginBottom: "0.6rem",
    letterSpacing: "0.04em",
  },
  blockRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "0.5rem",
    marginBottom: "0.3rem",
  },
  blockLabel: { fontSize: "0.75rem", color: "#607080", flexShrink: 0 },
  blockHash:  { fontSize: "0.75rem", fontFamily: "monospace", color: "#aaccdd", wordBreak: "break-all" },
  blockValue: { fontSize: "0.78rem", color: "#99bbcc" },
};

export default ChainVerify;
