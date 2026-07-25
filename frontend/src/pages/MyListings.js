import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
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
  tag:     "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  plus:    "M12 5v14 M5 12h14",
  alert:   "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  check:   "M20 6L9 17l-5-5",
  clock:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
};

export default function MyListings() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const currentUsername = user?.username;

  const fetchListings = async () => {
    setLoading(true);
    setListError("");
    try {
      const { data } = await api.get("/marketplace/items/mine");
      setListings(data.items || []);
    } catch (err) {
      setListError(err.response?.data?.message || err.message || "Could not load your listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUsername) {
      fetchListings();
    }
  }, [currentUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!name.trim()) {
      setFormError("Please enter an item title.");
      return;
    }
    const numericPrice = Number(price);
    if (!price || isNaN(numericPrice) || numericPrice <= 0) {
      setFormError("Please enter a price greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/marketplace/items", { name: name.trim(), price: numericPrice });
      setFormSuccess("Item successfully listed on BlockBazaar!");
      setName("");
      setPrice("");
      fetchListings();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Failed to list item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <main className="bb-container animate-fade-up">
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <span className="bb-badge bb-badge-cyan">Seller Portal</span>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "700", marginTop: "0.4rem" }}>My Listings</h1>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginTop: "0.3rem" }}>
              Manage items you are selling across the BlockBazaar decentralized marketplace.
            </p>
          </div>
        </div>

        {/* Content Layout: Form on Left/Top, Listings Grid on Right */}
        <div style={styles.layoutGrid}>
          {/* Create Listing Form */}
          <div className="glass-card" style={styles.formCard}>
            <div style={styles.formHeader}>
              <div style={styles.iconCircle}>
                <Icon d={ICONS.plus} size={18} color="#38BDF8" />
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>List New Asset</h2>
            </div>

            {formError && (
              <div style={styles.errorAlert} className="animate-scale-in">
                <Icon d={ICONS.alert} size={16} color="#FB7185" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div style={styles.successAlert} className="animate-scale-in">
                <Icon d={ICONS.check} size={16} color="#34D399" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div>
                <label style={styles.label}>Item Title</label>
                <input
                  id="input-my-item-name"
                  className="bb-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rare Cyber Deck #104"
                  disabled={submitting}
                />
              </div>

              <div>
                <label style={styles.label}>Price (MKT)</label>
                <input
                  id="input-my-item-price"
                  className="bb-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={submitting}
                />
              </div>

              <button
                id="btn-submit-listing"
                type="submit"
                className="bb-btn bb-btn-primary"
                disabled={submitting}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {submitting ? "Publishing Listing..." : "Publish to Marketplace"}
              </button>
            </form>
          </div>

          {/* Active Listings Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#F8FAFC" }}>
              Active Items ({listings.length})
            </h2>

            {loading ? (
              <div style={styles.listingsGrid}>
                {[1, 2].map((k) => (
                  <div key={k} className="glass-card" style={{ height: "140px" }} />
                ))}
              </div>
            ) : listError ? (
              <div className="glass-card" style={styles.errorAlert}>
                <Icon d={ICONS.alert} size={18} color="#FB7185" />
                <span>{listError}</span>
              </div>
            ) : listings.length === 0 ? (
              <div className="glass-card" style={styles.emptyBox}>
                <Icon d={ICONS.tag} size={28} color="#38BDF8" />
                <h3 style={{ fontSize: "1rem", fontWeight: "600" }}>No Active Listings</h3>
                <p style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
                  Fill out the form on the left to list your first item for sale.
                </p>
              </div>
            ) : (
              <div style={styles.listingsGrid}>
                {listings.map((item) => {
                  const isSold = item.status === "Sold";
                  return (
                    <div key={item.itemId} className="glass-card glass-card-interactive" style={styles.itemCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={styles.itemTitle}>{item.name}</h3>
                          <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Listing ID #{item.itemId}</span>
                        </div>
                        <span className={`bb-badge ${isSold ? "bb-badge-rose" : "bb-badge-emerald"}`}>
                          {isSold ? "Sold" : "Available"}
                        </span>
                      </div>

                      <div style={styles.priceContainer}>
                        <span style={styles.priceNum}>{Number(item.price).toFixed(2)}</span>
                        <span style={styles.priceUnit}>MKT</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
  layoutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "1.8rem",
    alignItems: "flex-start",
  },
  formCard: {
    padding: "1.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  formHeader: {
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
    gap: "1rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#CBD5E1",
    marginBottom: "0.35rem",
    display: "block",
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
  listingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1rem",
  },
  itemCard: {
    padding: "1.4rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "1rem",
  },
  itemTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#F8FAFC",
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.35rem",
  },
  priceNum: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.6rem",
    fontWeight: "800",
    color: "#38BDF8",
  },
  priceUnit: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#94A3B8",
  },
  emptyBox: {
    padding: "3rem 1.5rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.8rem",
  },
};
