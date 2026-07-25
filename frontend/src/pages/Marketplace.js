import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/marketplace/items",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          setError("Could not load marketplace items.");
          return;
        }

        const data = await response.json();
        setItems(data.items);
      } catch (err) {
        setError("Cannot reach the server. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleBuy = async (item) => {
    const confirmed = window.confirm(
      `Buy "${item.name}" for ${item.price} MKT?`
    );
    if (!confirmed) return;

    setMessage("");
    setError("");
    setBuyingId(item.itemId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/marketplace/items/${item.itemId}/buy`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        setError(`Purchase of "${item.name}" failed.`);
        return;
      }

      const data = await response.json();
      setMessage(data.message || `Purchased "${item.name}" successfully!`);
      setItems((prev) => prev.filter((i) => i.itemId !== item.itemId));
    } catch (err) {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <h2 style={styles.title}>Marketplace</h2>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        {loading && <p style={styles.status}>Loading items...</p>}

        {!loading && !error && items.length === 0 && (
          <p style={styles.status}>No items are listed right now.</p>
        )}

        {!loading && items.length > 0 && (
          <div style={styles.grid}>
            {items.map((item) => (
              <div key={item.itemId} style={styles.card}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemPrice}>{item.price} MKT</p>
                <button
                  style={styles.button}
                  onClick={() => handleBuy(item)}
                  disabled={buyingId === item.itemId}
                >
                  {buyingId === item.itemId ? "Buying..." : "Buy"}
                </button>
              </div>
            ))}
          </div>
        )}
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
    maxWidth: "1000px",
    margin: "0 auto",
  },
  title: {
    margin: 0,
    marginBottom: "1.5rem",
    color: "#4fc3f7",
  },
  status: {
    color: "#aaa",
  },
  error: {
    background: "#5c1a1a",
    color: "#ffb3b3",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  success: {
    background: "#1a5c2a",
    color: "#b3ffcc",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.25rem",
  },
  card: {
    background: "#16213e",
    padding: "1.5rem",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  itemName: {
    margin: 0,
    marginBottom: "0.5rem",
    fontSize: "1.1rem",
  },
  itemPrice: {
    margin: 0,
    marginBottom: "1rem",
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#4fc3f7",
  },
  button: {
    padding: "0.6rem 1.5rem",
    borderRadius: "6px",
    border: "none",
    background: "#4fc3f7",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
};

export default Marketplace;
