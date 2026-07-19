import { useState } from "react";

function Login() {
  // State: what the user has typed into each field
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    setError("");

    // Basic validation before hitting the backend
    if (!username.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid username or password.");
        return;
      }

      const data = await response.json();
      // TODO (AuthContextttz):
      console.log("Login success, token:", data.token);
      alert("Login successful!");
    } catch (err) {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>BlockBazaar</h1>
        <h2 style={styles.subtitle}>Log in to your account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p style={styles.footer}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1a1a2e",
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
  title: { margin: 0, textAlign: "center", color: "#4fc3f7" },
  subtitle: {
    marginTop: "0.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: "normal",
    color: "#aaa",
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
  },
  footer: { textAlign: "center", fontSize: "0.85rem", marginTop: "1rem" },
};

export default Login;