import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../services/api";

// ─── Injected CSS / keyframes ──────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -800px 0; }
    100% { background-position:  800px 0; }
  }
  @keyframes modalSlide {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(79,195,247,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(79,195,247,0); }
  }

  .mp-tab-btn {
    padding: 0.5rem 1.4rem;
    border-radius: 8px;
    border: 1px solid rgba(79,195,247,0.15);
    background: transparent;
    color: #5a8aa0;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s, color 0.18s, border-color 0.18s;
    font-family: 'Inter', system-ui, sans-serif;
    letter-spacing: 0.02em;
  }
  .mp-tab-btn.active {
    background: rgba(79,195,247,0.14);
    border-color: rgba(79,195,247,0.4);
    color: #4fc3f7;
  }
  .mp-tab-btn:hover:not(.active) {
    background: rgba(79,195,247,0.07);
    color: #8ab8d0;
  }

  .mp-item-card {
    background: rgba(18,28,52,0.8);
    border: 1px solid rgba(79,195,247,0.1);
    border-radius: 16px;
    padding: 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    animation: fadeUp 0.35s ease both;
    backdrop-filter: blur(8px);
  }
  .mp-item-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.45);
    border-color: rgba(79,195,247,0.25);
  }

  .mp-buy-btn {
    width: 100%;
    padding: 0.6rem;
    border-radius: 9px;
    border: none;
    background: linear-gradient(135deg, #6a1b9a, #4a148c);
    color: #e0c0ff;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
    font-family: 'Inter', system-ui, sans-serif;
    letter-spacing: 0.03em;
    margin-top: auto;
  }
  .mp-buy-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(106,27,154,0.5);
  }
  .mp-buy-btn:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    transform: none;
  }

  .mp-list-btn {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.55rem 1.2rem;
    border-radius: 9px;
    border: none;
    background: linear-gradient(135deg, #6a1b9a, #4a148c);
    color: #e0c0ff;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.18s, box-shadow 0.18s;
    font-family: 'Inter', system-ui, sans-serif;
  }
  .mp-list-btn:hover {
    opacity: 0.88;
    box-shadow: 0 4px 16px rgba(106,27,154,0.45);
  }

  .mp-input {
    width: 100%;
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    border: 1px solid rgba(79,195,247,0.2);
    background: rgba(10,20,45,0.7);
    color: #ddeeff;
    font-size: 0.92rem;
    font-family: 'Inter', system-ui, sans-serif;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    box-sizing: border-box;
  }
  .mp-input:focus {
    border-color: rgba(79,195,247,0.5);
    box-shadow: 0 0 0 3px rgba(79,195,247,0.1);
  }
  .mp-input::placeholder { color: #3a5a74; }

  .mp-confirm-btn {
    flex: 1;
    padding: 0.65rem;
    border-radius: 9px;
    border: none;
    background: linear-gradient(135deg, #6a1b9a, #4a148c);
    color: #e0c0ff;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', system-ui, sans-serif;
    transition: opacity 0.18s;
  }
  .mp-confirm-btn:hover:not(:disabled) { opacity: 0.88; }
  .mp-confirm-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .mp-cancel-btn {
    flex: 1;
    padding: 0.65rem;
    border-radius: 9px;
    border: 1px solid rgba(79,195,247,0.2);
    background: transparent;
    color: #5a8aa0;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', system-ui, sans-serif;
    transition: background 0.18s, color 0.18s;
  }
  .mp-cancel-btn:hover { background: rgba(79,195,247,0.07); color: #8ab8d0; }

  .mp-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 999px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .mp-status-available {
    background: rgba(79,195,247,0.12);
    color: #4fc3f7;
    border: 1px solid rgba(79,195,247,0.25);
  }
  .mp-status-sold {
    background: rgba(120,120,140,0.12);
    color: #6a7a8a;
    border: 1px solid rgba(120,120,140,0.2);
  }
`;

// ─── Icons ─────────────────────────────────────────────────────────────────────
function Icon({ d, size = 18, color = "currentColor", strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const I = {
  market:  "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  plus:    "M12 5v14 M5 12h14",
  tag:     "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  user:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  check:   "M20 6L9 17l-5-5",
  x:       "M18 6L6 18 M6 6l12 12",
  link:    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  clock:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
  spin:    "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  alert:   "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  bag:     "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18",
};

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  const shimmer = {
    background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
    backgroundSize: "800px 100%",
    animation: "shimmer 1.6s infinite linear",
    borderRadius: 6,
  };
  return (
    <div style={{ background: "rgba(18,28,52,0.6)", border: "1px solid rgba(79,195,247,0.07)", borderRadius: 16, padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      <div style={{ ...shimmer, height: 14, width: "60%" }} />
      <div style={{ ...shimmer, height: 11, width: "40%" }} />
      <div style={{ ...shimmer, height: 28, width: "50%", marginTop: 4 }} />
      <div style={{ ...shimmer, height: 36, marginTop: 4 }} />
    </div>
  );
}

// ─── List Item Modal ────────────────────────────────────────────────────────────
function ListItemModal({ onClose, onSuccess }) {
  const [name, setName]       = useState("");
  const [price, setPrice]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Item name is required."); return; }
    const p = parseFloat(price);
    if (isNaN(p) || p < 0.01) { setError("Price must be at least 0.01 BBZ."); return; }

    setLoading(true);
    try {
      await api.post("/marketplace/items", { name: name.trim(), price: p });
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to list item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        <div style={ms.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ ...ms.iconWrap, background: "linear-gradient(135deg,#6a1b9a,#4a148c)" }}>
              <Icon d={I.tag} size={16} color="#e0c0ff" />
            </div>
            <h2 style={ms.modalTitle}>List an Item</h2>
          </div>
          <button style={ms.closeBtn} onClick={onClose} id="modal-list-close">
            <Icon d={I.x} size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label style={ms.label}>Item Name</label>
            <input
              id="input-item-name"
              className="mp-input"
              placeholder="e.g. Rare Digital Card"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoFocus
            />
            <div style={ms.hint}>{name.length}/100 characters</div>
          </div>
          <div>
            <label style={ms.label}>Price (BBZ)</label>
            <input
              id="input-item-price"
              className="mp-input"
              type="number"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {error && (
            <div style={ms.errorBox}>
              <Icon d={I.alert} size={15} color="#ff8080" />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem" }}>
            <button type="button" className="mp-cancel-btn" onClick={onClose} id="modal-list-cancel">Cancel</button>
            <button type="submit" className="mp-confirm-btn" disabled={loading} id="modal-list-submit">
              {loading ? (
                <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>
                  <Icon d={I.spin} size={15} />
                </span>
              ) : "List Item →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Buy Confirmation Modal ────────────────────────────────────────────────────
function BuyModal({ item, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState(null);

  const handleBuy = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post(`/marketplace/items/${item.itemId}/buy`);
      setResult(data);
    } catch (err) {
      setError(err.message || "Purchase failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  return (
    <div style={ms.overlay} onClick={(e) => !result && e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        {result ? (
          // ── Success state ──
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", padding: "0.5rem 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#1b5e20,#2e7d32)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.5s ease 1" }}>
              <Icon d={I.check} size={26} color="#66bb6a" strokeWidth={3} />
            </div>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ ...ms.modalTitle, margin: "0 0 0.3rem" }}>Purchase Successful!</h2>
              <p style={{ color: "#5a8aa0", fontSize: "0.88rem", margin: 0 }}>
                <strong style={{ color: "#c0d8f0" }}>{result.itemName}</strong> is now yours.
              </p>
            </div>
            <div style={ms.proofBox}>
              <div style={ms.proofLabel}>
                <Icon d={I.link} size={13} color="#4fc3f7" />
                <span>Blockchain Proof</span>
              </div>
              <code style={ms.proofHash}>{result.blockHash}</code>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", width: "100%", fontSize: "0.85rem" }}>
              <div style={{ flex: 1, textAlign: "center", background: "rgba(79,195,247,0.06)", borderRadius: 8, padding: "0.6rem" }}>
                <div style={{ color: "#4fc3f7", fontWeight: 700 }}>{Number(result.newBalance).toFixed(2)} BBZ</div>
                <div style={{ color: "#3a5a74", fontSize: "0.75rem" }}>New Balance</div>
              </div>
            </div>
            <button className="mp-confirm-btn" onClick={handleDone} id="modal-buy-done" style={{ width: "100%" }}>Done</button>
          </div>
        ) : (
          // ── Confirmation state ──
          <>
            <div style={ms.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ ...ms.iconWrap, background: "linear-gradient(135deg,#6a1b9a,#4a148c)" }}>
                  <Icon d={I.bag} size={16} color="#e0c0ff" />
                </div>
                <h2 style={ms.modalTitle}>Confirm Purchase</h2>
              </div>
              <button style={ms.closeBtn} onClick={onClose} id="modal-buy-close">
                <Icon d={I.x} size={16} />
              </button>
            </div>

            <div style={ms.confirmDetail}>
              <div style={ms.confirmRow}>
                <span style={ms.confirmKey}>Item</span>
                <span style={ms.confirmVal}>{item.name}</span>
              </div>
              <div style={ms.confirmRow}>
                <span style={ms.confirmKey}>Seller</span>
                <span style={ms.confirmVal}>{item.seller}</span>
              </div>
              <div style={{ ...ms.confirmRow, borderTop: "1px solid rgba(79,195,247,0.1)", marginTop: 4, paddingTop: 12 }}>
                <span style={ms.confirmKey}>You Pay</span>
                <span style={{ ...ms.confirmVal, color: "#b39ddb", fontWeight: 800, fontSize: "1.15rem" }}>
                  {Number(item.price).toFixed(2)} <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>BBZ</span>
                </span>
              </div>
            </div>

            <div style={ms.warnBox}>
              <Icon d={I.alert} size={14} color="#ffa726" />
              <span>This will deduct <strong>{Number(item.price).toFixed(2)} BBZ</strong> from your wallet and be recorded on the blockchain.</span>
            </div>

            {error && (
              <div style={ms.errorBox}>
                <Icon d={I.alert} size={15} color="#ff8080" />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button className="mp-cancel-btn" onClick={onClose} id="modal-buy-cancel">Cancel</button>
              <button className="mp-confirm-btn" onClick={handleBuy} disabled={loading} id="modal-buy-confirm">
                {loading ? (
                  <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>
                    <Icon d={I.spin} size={15} />
                  </span>
                ) : "Confirm Purchase"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Item Card (Browse tab) ────────────────────────────────────────────────────
function ItemCard({ item, currentUsername, onBuy, index }) {
  const isOwn = item.seller === currentUsername;
  const date  = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  return (
    <div className="mp-item-card" style={{ animationDelay: `${index * 0.05}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#ddeeff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem", color: "#4a6a84", fontSize: "0.78rem" }}>
            <Icon d={I.user} size={12} />
            <span>{item.seller}</span>
            {isOwn && <span style={{ color: "#4fc3f7", fontSize: "0.7rem", background: "rgba(79,195,247,0.1)", padding: "0px 5px", borderRadius: 4 }}>you</span>}
          </div>
        </div>
        {date && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#2a4060", fontSize: "0.72rem", flexShrink: 0, marginLeft: 8 }}>
            <Icon d={I.clock} size={11} />
            {date}
          </div>
        )}
      </div>

      <div style={{ marginTop: "0.3rem" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 800, background: "linear-gradient(90deg,#b39ddb,#9c27b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {Number(item.price).toFixed(2)}
        </span>
        <span style={{ fontSize: "0.8rem", color: "#7a5a9a", fontWeight: 600, marginLeft: 5 }}>BBZ</span>
      </div>

      <button
        className="mp-buy-btn"
        onClick={() => onBuy(item)}
        disabled={isOwn}
        id={`btn-buy-${item.itemId}`}
        title={isOwn ? "You cannot buy your own item" : `Buy ${item.name}`}
      >
        {isOwn ? "Your Listing" : "Buy Now"}
      </button>
    </div>
  );
}

// ─── My Listing Card ──────────────────────────────────────────────────────────
function MyListingCard({ item, index }) {
  const isSold = item.status === "Sold";
  const date   = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div className="mp-item-card" style={{ animationDelay: `${index * 0.05}s`, opacity: isSold ? 0.75 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ddeeff", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.name}
        </div>
        <span className={`mp-status-badge ${isSold ? "mp-status-sold" : "mp-status-available"}`}>
          {isSold ? "Sold" : "Available"}
        </span>
      </div>
      <div>
        <span style={{ fontSize: "1.4rem", fontWeight: 800, background: isSold ? "none" : "linear-gradient(90deg,#b39ddb,#9c27b0)", WebkitBackgroundClip: isSold ? "unset" : "text", WebkitTextFillColor: isSold ? "#5a6a7a" : "transparent" }}>
          {Number(item.price).toFixed(2)}
        </span>
        <span style={{ fontSize: "0.78rem", color: isSold ? "#3a4a5a" : "#7a5a9a", fontWeight: 600, marginLeft: 5 }}>BBZ</span>
      </div>
      {date && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#2a4060", fontSize: "0.75rem" }}>
          <Icon d={I.clock} size={12} />
          Listed {date}
        </div>
      )}
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "4rem 1rem", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(106,27,154,0.1)", border: "1px dashed rgba(106,27,154,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={icon} size={28} color="#4a2070" />
      </div>
      <div>
        <div style={{ color: "#3a5a74", fontWeight: 600, fontSize: "0.95rem" }}>{title}</div>
        <div style={{ color: "#2a3a50", fontSize: "0.83rem", marginTop: "0.3rem" }}>{sub}</div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Marketplace() {
  const { user } = useAuth();

  const [tab, setTab]           = useState("browse");   // "browse" | "mine"
  const [items, setItems]       = useState([]);
  const [myItems, setMyItems]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const [buyTarget, setBuyTarget]     = useState(null);   // item to buy
  const [showListModal, setListModal] = useState(false);

  const fetchBrowse = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/marketplace/items");
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load items.");
    } finally { setLoading(false); }
  }, []);

  const fetchMine = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/marketplace/items/mine");
      setMyItems(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load your listings.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (tab === "browse") fetchBrowse();
    else                  fetchMine();
  }, [tab, fetchBrowse, fetchMine]);

  const handleBuySuccess = () => {
    fetchBrowse();
    if (tab === "mine") fetchMine();
  };

  const handleListSuccess = () => {
    setListModal(false);
    if (tab === "mine") fetchMine();
    else { setTab("mine"); }
  };

  const currentList = tab === "browse" ? items : myItems;

  return (
    <div style={s.page}>
      <style>{CSS}</style>
      <Navbar />

      <main style={s.main}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.3rem" }}>
              <div style={s.headerIcon}>
                <Icon d={I.market} size={20} color="#b39ddb" />
              </div>
              <h1 style={s.title}>Marketplace</h1>
            </div>
            <p style={s.subtitle}>Browse and buy digital items with BBZ tokens. Every purchase is recorded on the blockchain.</p>
          </div>
          <button className="mp-list-btn" onClick={() => setListModal(true)} id="btn-list-item">
            <Icon d={I.plus} size={16} />
            List Item
          </button>
        </div>

        {/* ── Tabs ── */}
        <div style={s.tabRow}>
          <button className={`mp-tab-btn ${tab === "browse" ? "active" : ""}`} onClick={() => setTab("browse")} id="tab-browse">
            Browse Items {items.length > 0 && tab === "browse" && <span style={s.tabCount}>{items.length}</span>}
          </button>
          <button className={`mp-tab-btn ${tab === "mine" ? "active" : ""}`} onClick={() => setTab("mine")} id="tab-my-listings">
            My Listings {myItems.length > 0 && tab === "mine" && <span style={s.tabCount}>{myItems.length}</span>}
          </button>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={s.grid}>
            {[1,2,3,4,5,6].map(k => <SkeletonCard key={k} />)}
          </div>
        ) : error ? (
          <div style={s.errorCard}>
            <Icon d={I.alert} size={18} color="#ff8080" />
            <div>
              <strong style={{ color: "#ff9999" }}>Could not load items</strong>
              <p style={{ margin: "0.2rem 0 0", color: "#cc7070", fontSize: "0.88rem" }}>{error}</p>
            </div>
            <button onClick={tab === "browse" ? fetchBrowse : fetchMine} style={{ marginLeft: "auto", padding: "0.35rem 0.9rem", borderRadius: 6, border: "1px solid rgba(255,100,100,0.3)", background: "transparent", color: "#cc7070", cursor: "pointer", fontSize: "0.83rem" }}>
              Retry
            </button>
          </div>
        ) : currentList.length === 0 ? (
          tab === "browse" ? (
            <EmptyState icon={I.market} title="No items available" sub="Be the first to list something for sale." />
          ) : (
            <EmptyState icon={I.tag} title="You haven't listed anything yet" sub={'Click \u201cList Item\u201d to sell something in the marketplace.'} />
          )
        ) : (
          <div style={s.grid}>
            {tab === "browse"
              ? currentList.map((item, i) => (
                  <ItemCard
                    key={item.itemId}
                    item={item}
                    currentUsername={user?.username}
                    onBuy={setBuyTarget}
                    index={i}
                  />
                ))
              : currentList.map((item, i) => (
                  <MyListingCard key={item.itemId} item={item} index={i} />
                ))
            }
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {showListModal && (
        <ListItemModal
          onClose={() => setListModal(false)}
          onSuccess={handleListSuccess}
        />
      )}
      {buyTarget && (
        <BuyModal
          item={buyTarget}
          onClose={() => setBuyTarget(null)}
          onSuccess={handleBuySuccess}
        />
      )}
    </div>
  );
}

// ─── Page styles ───────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#1a1a2e 0%,#0d1b35 100%)",
    color: "#eee",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "2.2rem 1.5rem 4rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.8rem",
    flexWrap: "wrap",
    gap: "1rem",
    animation: "fadeUp 0.35s ease",
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "linear-gradient(135deg,rgba(106,27,154,0.4),rgba(74,20,140,0.4))",
    border: "1px solid rgba(179,157,219,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.65rem",
    fontWeight: 800,
    color: "#ddeeff",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    margin: 0,
    color: "#4a6a84",
    fontSize: "0.88rem",
    lineHeight: 1.5,
    maxWidth: 520,
  },
  tabRow: {
    display: "flex",
    gap: "0.6rem",
    marginBottom: "1.6rem",
    animation: "fadeUp 0.4s ease",
  },
  tabCount: {
    display: "inline-block",
    background: "rgba(79,195,247,0.15)",
    color: "#4fc3f7",
    fontSize: "0.72rem",
    padding: "0px 6px",
    borderRadius: 999,
    marginLeft: 5,
    fontWeight: 700,
    verticalAlign: "middle",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "1.1rem",
  },
  errorCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    background: "rgba(140,30,30,0.15)",
    border: "1px solid rgba(255,100,100,0.3)",
    borderRadius: 12,
    padding: "1.2rem 1.5rem",
    flexWrap: "wrap",
  },
};

// ─── Modal styles ──────────────────────────────────────────────────────────────
const ms = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(5,10,25,0.75)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
    animation: "fadeIn 0.2s ease",
  },
  modal: {
    background: "linear-gradient(160deg,rgba(18,28,55,0.98) 0%,rgba(10,18,40,0.98) 100%)",
    border: "1px solid rgba(79,195,247,0.18)",
    borderRadius: 20,
    padding: "1.8rem",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(79,195,247,0.08)",
    animation: "modalSlide 0.25s ease",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.4rem",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#ddeeff",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#4a6a84",
    cursor: "pointer",
    padding: 4,
    lineHeight: 0,
    transition: "color 0.15s",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#4a7a94",
    marginBottom: "0.45rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  hint: {
    fontSize: "0.72rem",
    color: "#2a4060",
    marginTop: "0.3rem",
    textAlign: "right",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(140,30,30,0.2)",
    border: "1px solid rgba(255,100,100,0.25)",
    borderRadius: 8,
    padding: "0.65rem 0.9rem",
    color: "#ff9090",
    fontSize: "0.85rem",
  },
  warnBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    background: "rgba(255,167,38,0.08)",
    border: "1px solid rgba(255,167,38,0.2)",
    borderRadius: 8,
    padding: "0.7rem 0.9rem",
    color: "#c8a060",
    fontSize: "0.82rem",
    lineHeight: 1.5,
    marginBottom: "0.6rem",
  },
  confirmDetail: {
    background: "rgba(10,20,45,0.5)",
    border: "1px solid rgba(79,195,247,0.1)",
    borderRadius: 10,
    padding: "1rem 1.1rem",
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  confirmRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confirmKey: { color: "#4a6a84", fontSize: "0.83rem" },
  confirmVal: { color: "#c0d8f0", fontWeight: 600, fontSize: "0.9rem", textAlign: "right", maxWidth: "60%", wordBreak: "break-word" },
  proofBox: {
    background: "rgba(10,20,45,0.6)",
    border: "1px solid rgba(79,195,247,0.12)",
    borderRadius: 10,
    padding: "0.9rem 1rem",
    width: "100%",
  },
  proofLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    color: "#4a6a84",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
  },
  proofHash: {
    display: "block",
    fontSize: "0.72rem",
    color: "#4fc3f7",
    wordBreak: "break-all",
    fontFamily: "'Courier New', monospace",
    lineHeight: 1.6,
    opacity: 0.85,
  },
};
