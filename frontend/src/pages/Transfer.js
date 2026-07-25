import { useState } from "react";
import Navbar from "../components/Navbar";

function Transfer() {
  const [recipientUsername, setRecipientUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!recipientUsername.trim()) {
      setError("Please enter a recipient username.");
      return;
    }
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter an amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/transactions/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverUsername: recipientUsername,
            amount: numericAmount,
          }),
        }
      );

      if (!response.ok) {
        setError("Transfer failed. Please check the details and try again.");
        return;
      }

      setSuccess("Transfer successful!");
      setRecipientUsername("");
      setAmount("");
    } catch (err) {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <h2 style={styles.title}>Transfer Tokens</h2>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <label style={styles.label}>Recipient Username</label>
          <input
            style={styles.input}
            type="text"
            value={recipientUsername}
            onChange={(e) => setRecipientUsername(e.target.value)}
            placeholder="Enter recipient's username"
          />

          <label style={styles.label}>Amount</label>
          <input
            style={styles.input}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to send"
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
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
    display: "flex",
    justifyContent: "center",
    padding: "3rem 1.5rem",
  },
  card: {
    background: "#16213e",
    padding: "2.5rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    color: "#eee",
  },
  title: {
    margin: 0,
    marginBottom: "1.5rem",
    textAlign: "center",
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
};

export default Transfer;
