import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Icon from "../components/Icon";
import ICONS from "../constants/icons";
import PageLayout from "../components/PageLayout";

function ListItemModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Item name is required."); return; }
    const p = parseFloat(price);
    if (isNaN(p) || p < 0.01) { setError("Price must be at least 0.01 MKT."); return; }

    setLoading(true);
    try {
      await api.post("/marketplace/items", { name: name.trim(), price: p });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to list item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-scale-in" style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={modalStyles.iconWrap}>
              <Icon d={ICONS.tag} size={18} color="#38BDF8" />
            </div>
            <h2 style={modalStyles.title}>Create New Listing</h2>
          </div>
          <button style={modalStyles.closeBtn} onClick={onClose} id="modal-list-close">
            <Icon d={ICONS.x} size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={modalStyles.form}>
          <div>
            <label style={modalStyles.label}>Item Title</label>
            <input id="input-item-name" className="bb-input" placeholder="e.g. Genesis Cyber Pass #042"
              value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoFocus />
            <div style={modalStyles.hint}>{name.length}/100 characters</div>
          </div>
          <div>
            <label style={modalStyles.label}>Price (MKT)</label>
            <input id="input-item-price" className="bb-input" type="number" placeholder="0.00"
              min="0.01" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          {error && (
            <div style={modalStyles.errorBox}>
              <Icon d={ICONS.alert} size={16} color="#FB7185" />
              <span>{error}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
            <button type="button" className="bb-btn bb-btn-outline" onClick={onClose} style={{ flex: 1 }} id="modal-list-cancel">Cancel</button>
            <button type="submit" className="bb-btn bb-btn-emerald" disabled={loading} style={{ flex: 1 }} id="modal-list-submit">
              {loading ? "Publishing..." : "List Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BuyModal({ item, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleBuy = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post(`/marketplace/items/${item.itemId}/buy`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Purchase failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => { onSuccess(); onClose(); };

  return (
    <div style={modalStyles.overlay} onClick={(e) => !result && e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-scale-in" style={modalStyles.modal}>
        {result ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", textAlign: "center" }}>
            <div style={modalStyles.successIconCircle}>
              <Icon d={ICONS.check} size={30} color="#34D399" strokeWidth={3} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: "700", color: "#F8FAFC" }}>Purchase Confirmed!</h2>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", marginTop: "0.3rem" }}>
                You have successfully acquired <strong style={{ color: "#38BDF8" }}>{result.itemName}</strong>.
              </p>
            </div>
            <div style={modalStyles.proofBox}>
              <div style={modalStyles.proofHeader}>
                <Icon d={ICONS.link} size={14} color="#38BDF8" />
                <span>On-Chain Transaction Proof</span>
              </div>
              <code style={modalStyles.proofHash}>{result.blockHash}</code>
            </div>
            <div style={{ width: "100%", padding: "0.8rem", background: "rgba(56, 189, 248, 0.08)", borderRadius: "10px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Updated Balance</div>
              <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#34D399", fontFamily: "var(--font-heading)" }}>
                {Number(result.newBalance).toFixed(2)} MKT
              </div>
            </div>
            <button className="bb-btn bb-btn-primary" onClick={handleDone} style={{ width: "100%" }} id="modal-buy-done">Complete</button>
          </div>
        ) : (
          <>
            <div style={modalStyles.header}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={modalStyles.iconWrap}>
                  <Icon d={ICONS.bag} size={18} color="#818CF8" />
                </div>
                <h2 style={modalStyles.title}>Confirm Purchase</h2>
              </div>
              <button style={modalStyles.closeBtn} onClick={onClose} id="modal-buy-close">
                <Icon d={ICONS.x} size={16} />
              </button>
            </div>
            <div style={modalStyles.confirmCard}>
              <div style={modalStyles.confirmRow}>
                <span style={modalStyles.confirmLabel}>Item Title</span>
                <span style={modalStyles.confirmValue}>{item.name}</span>
              </div>
              <div style={modalStyles.confirmRow}>
                <span style={modalStyles.confirmLabel}>Seller</span>
                <span style={modalStyles.confirmValue}>@{item.seller}</span>
              </div>
              <div style={{ ...modalStyles.confirmRow, borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.8rem", marginTop: "0.4rem" }}>
                <span style={modalStyles.confirmLabel}>Total Amount</span>
                <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#38BDF8", fontFamily: "var(--font-heading)" }}>
                  {Number(item.price).toFixed(2)} MKT
                </span>
              </div>
            </div>
            <div style={modalStyles.warnNote}>
              <Icon d={ICONS.alert} size={15} color="#FBBF24" />
              <span>Tokens will be transferred from your balance and recorded on-chain.</span>
            </div>
            {error && (
              <div style={modalStyles.errorBox}>
                <Icon d={ICONS.alert} size={16} color="#FB7185" />
                <span>{error}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
              <button className="bb-btn bb-btn-outline" onClick={onClose} style={{ flex: 1 }} id="modal-buy-cancel">Cancel</button>
              <button className="bb-btn bb-btn-primary" onClick={handleBuy} disabled={loading} style={{ flex: 1 }} id="modal-buy-confirm">
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Marketplace() {
  const { user } = useAuth();
  const [tab, setTab] = useState("browse");
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [buyTarget, setBuyTarget] = useState(null);
  const [showListModal, setListModal] = useState(false);

  const fetchBrowse = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/marketplace/items");
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load marketplace items.");
    } finally { setLoading(false); }
  }, []);

  const fetchMine = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/marketplace/items/mine");
      setMyItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load your listings.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (tab === "browse") fetchBrowse(); else fetchMine();
  }, [tab, fetchBrowse, fetchMine]);

  const handleBuySuccess = () => { fetchBrowse(); if (tab === "mine") fetchMine(); };
  const handleListSuccess = () => { setListModal(false); if (tab === "mine") fetchMine(); else setTab("mine"); };

  const rawList = tab === "browse" ? items : myItems;
  const searchLower = searchQuery.toLowerCase();
  const filteredList = rawList.filter((item) =>
    item.name.toLowerCase().includes(searchLower) || item.seller.toLowerCase().includes(searchLower)
  );

  return (
    <PageLayout>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.badgeWrap}>
            <span className="bb-badge bb-badge-cyan">Web3 Commerce</span>
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", marginTop: "0.4rem" }}>Marketplace</h1>
          <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            Discover digital assets listed by community members. Transactions execute securely via token consensus.
          </p>
        </div>
        <button className="bb-btn bb-btn-primary" onClick={() => setListModal(true)} id="btn-list-item">
          <Icon d={ICONS.plus} size={16} /> List Item
        </button>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.tabGroup}>
          <button id="tab-browse" onClick={() => setTab("browse")}
            className={`bb-btn ${tab === "browse" ? "bb-btn-primary" : "bb-btn-outline"}`}
            style={{ padding: "0.45rem 1.1rem", fontSize: "0.85rem" }}>
            Browse All ({items.length})
          </button>
          <button id="tab-my-listings" onClick={() => setTab("mine")}
            className={`bb-btn ${tab === "mine" ? "bb-btn-primary" : "bb-btn-outline"}`}
            style={{ padding: "0.45rem 1.1rem", fontSize: "0.85rem" }}>
            My Listings ({myItems.length})
          </button>
        </div>
        <div style={styles.searchBox}>
          <Icon d={ICONS.search} size={16} color="#94A3B8" />
          <input type="text" className="bb-input" placeholder="Search items or seller..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.4rem", height: "38px" }} />
        </div>
      </div>

      {loading ? (
        <div style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div key={k} className="glass-card" style={{ height: "210px", padding: "1.5rem" }} />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card" style={styles.errorCard}>
          <Icon d={ICONS.alert} size={20} color="#FB7185" />
          <div>
            <strong style={{ color: "#FB7185" }}>Failed to load items</strong>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>{error}</p>
          </div>
          <button onClick={tab === "browse" ? fetchBrowse : fetchMine} className="bb-btn bb-btn-outline" style={{ marginLeft: "auto" }}>Retry</button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="glass-card" style={styles.emptyCard}>
          <div style={styles.emptyIconWrap}>
            <Icon d={ICONS.market} size={30} color="#38BDF8" />
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
            {searchQuery ? "No items match your search" : tab === "browse" ? "Marketplace is currently empty" : "You have no active listings"}
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", maxWidth: "380px" }}>
            {tab === "browse" ? "Be the first seller! Click 'List Item' to post an item." : "Create your first listing to sell items on BlockBazaar."}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredList.map((item) => {
            const isOwn = item.seller === user?.username;
            const isSold = item.status === "Sold";
            return (
              <div key={item.itemId} className="glass-card glass-card-interactive" style={styles.itemCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.itemTitle}>{item.name}</h3>
                    <div style={styles.sellerRow}>
                      <Icon d={ICONS.user} size={12} color="#94A3B8" />
                      <span style={styles.sellerName}>@{item.seller}</span>
                      {isOwn && <span className="bb-badge bb-badge-cyan">You</span>}
                    </div>
                  </div>
                  {isSold && <span className="bb-badge bb-badge-rose">Sold</span>}
                </div>
                <div style={styles.priceRow}>
                  <span style={styles.priceVal}>{Number(item.price).toFixed(2)}</span>
                  <span style={styles.priceSymbol}>MKT</span>
                </div>
                {tab === "browse" ? (
                  <button className="bb-btn bb-btn-primary" onClick={() => setBuyTarget(item)}
                    disabled={isOwn || isSold} id={`btn-buy-${item.itemId}`}
                    style={{ width: "100%", marginTop: "auto", padding: "0.6rem" }}>
                    {isOwn ? "Your Item" : isSold ? "Sold Out" : "Buy Item"}
                  </button>
                ) : (
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "#64748B" }}>
                    <span>Status: <strong style={{ color: isSold ? "#FB7185" : "#34D399" }}>{item.status || "Available"}</strong></span>
                    <span>Item #{item.itemId}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showListModal && <ListItemModal onClose={() => setListModal(false)} onSuccess={handleListSuccess} />}
      {buyTarget && <BuyModal item={buyTarget} onClose={() => setBuyTarget(null)} onSuccess={handleBuySuccess} />}
    </PageLayout>
  );
}

const styles = {
  headerRow: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    gap: "1rem", flexWrap: "wrap", marginBottom: "1.8rem",
  },
  badgeWrap: { display: "inline-block" },
  toolbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "1rem", flexWrap: "wrap", marginBottom: "1.8rem",
  },
  tabGroup: { display: "flex", alignItems: "center", gap: "0.5rem" },
  searchBox: { position: "relative", width: "280px", display: "flex", alignItems: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" },
  itemCard: { padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" },
  itemTitle: { fontSize: "1.05rem", fontWeight: "700", color: "#F8FAFC" },
  sellerRow: { display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem" },
  sellerName: { fontSize: "0.8rem", color: "#94A3B8" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "0.35rem" },
  priceVal: { fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: "800", color: "#38BDF8" },
  priceSymbol: { fontSize: "0.85rem", fontWeight: "600", color: "#94A3B8" },
  errorCard: { padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" },
  emptyCard: {
    padding: "3.5rem 1.5rem", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem",
  },
  emptyIconWrap: {
    width: "60px", height: "60px", borderRadius: "50%",
    background: "rgba(56, 189, 248, 0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};

const modalStyles = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(11, 15, 25, 0.75)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
  },
  modal: { width: "100%", maxWidth: "440px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  iconWrap: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: "1.2rem", fontWeight: "700" },
  closeBtn: { background: "none", border: "none", color: "#94A3B8", cursor: "pointer" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#CBD5E1", marginBottom: "0.35rem", display: "block" },
  hint: { fontSize: "0.75rem", color: "#64748B", marginTop: "0.25rem", textAlign: "right" },
  errorBox: {
    display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.9rem",
    background: "rgba(251, 113, 133, 0.12)", border: "1px solid rgba(251, 113, 133, 0.3)",
    borderRadius: "8px", color: "#FB7185", fontSize: "0.82rem",
  },
  successIconCircle: {
    width: "60px", height: "60px", borderRadius: "50%",
    background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  proofBox: {
    width: "100%", padding: "0.8rem", background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "10px", textAlign: "left",
  },
  proofHeader: { display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: "600", color: "#94A3B8", marginBottom: "0.35rem" },
  proofHash: { fontSize: "0.75rem", color: "#38BDF8", wordBreak: "break-all" },
  confirmCard: {
    background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem",
  },
  confirmRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  confirmLabel: { fontSize: "0.82rem", color: "#94A3B8" },
  confirmValue: { fontSize: "0.9rem", fontWeight: "600", color: "#F8FAFC" },
  warnNote: {
    display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#FBBF24",
    background: "rgba(251, 191, 36, 0.08)", padding: "0.6rem 0.8rem", borderRadius: "8px",
  },
};
