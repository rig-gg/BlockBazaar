import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function MyListings() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hovered, setHovered] = useState(false);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const currentUsername = user?.username;

  const fetchListings = async () => {
    setLoading(true);
    setListError("");
    try {
      const { data } = await api.get("/marketplace/items");
      setListings((data.items || []).filter((item) => item.seller === currentUsername));
    } catch (err) {
      setListError(err.message || "Could not load your listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUsername) {
      fetchListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!name.trim()) {
      setFormError("Please enter an item name.");
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

      setFormSuccess("Item listed successfully!");
      setName("");
      setPrice("");
      fetchListings();
    } catch (err) {
      setFormError(err.message || "Could not list this item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <h2 style={styles.title}>List a New Item</h2>

          {formError && <p style={styles.error}>{formError}</p>}
          {formSuccess && <p style={styles.success}>{formSuccess}</p>}

          <label style={styles.label}>Item Name</label>
          <input
            style={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
          />

          <label style={styles.label}>Price (MKT)</label>
          <input
            style={styles.input}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />

          <button
            style={{
              ...styles.button,
              ...(hovered && !submitting ? styles.buttonHover : {}),
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
            type="submit"
            disabled={submitting}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {submitting ? "Listing..." : "List Item"}
          </button>
        </form>

        <div style={styles.listings}>
          <h2 style={styles.title}>My Active Listings</h2>

          {loading && <p style={styles.status}>Loading your listings...</p>}
          {!loading && listError && <p style={styles.error}>{listError}</p>}
          {!loading && !listError && listings.length === 0 && (
            <p style={styles.status}>
              You don't have any active listings right now.
            </p>
          )}

          {!loading && listings.length > 0 && (
            <div style={styles.grid}>
              {listings.map((item) => (
                <div key={item.itemId} style={styles.itemCard}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemPrice}>{item.price} MKT</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#1a1a2e",
    color: "#eee",
  },
  content: {
    padding: "3rem 1.5rem",
    maxWidth: "700px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
  },
  card: {
    background: "#16213e",
    padding: "2.5rem",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    color: "#eee",
  },
  title: {
    margin: 0,
    marginBottom: "1.5rem",
    color: "#4fc3f7",
  },
  label: { marginBottom: "0.25rem", fontSize: "0.9rem" },
  input: {
    padding: "0.6rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#0f3460",
    color: "#fff",
  },
  button: {
    padding: "0.7rem",
    borderRadius: "6px",
    border: "none",
    background: "#4fc3f7",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.5rem",
    transition: "background 0.15s ease",
  },
  buttonHover: {
    background: "#7fd4fa",
  },
  error: {
    background: "#5c1a1a",
    color: "#ffb3b3",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    textAlign: "center",
    marginBottom: "1rem",
  },
  success: {
    background: "#1a5c2a",
    color: "#b3ffcc",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    textAlign: "center",
    marginBottom: "1rem",
  },
  status: {
    color: "#aaa",
  },
  listings: {
    display: "flex",
    flexDirection: "column",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1.25rem",
  },
  itemCard: {
    background: "#16213e",
    padding: "1.25rem",
    borderRadius: "12px",
    textAlign: "center",
  },
  itemName: {
    margin: 0,
    marginBottom: "0.5rem",
    fontSize: "1.05rem",
  },
  itemPrice: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#4fc3f7",
  },
};

export default MyListings;
