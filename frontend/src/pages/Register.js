import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        // Backend rejects duplicates (email is unique)
        setError("Registration failed. Username or email may already be taken.");
        return;
      }

      setSuccess("Account created! You can now log in.");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
        <h2 style={styles.subtitle}>Create your account</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
        />

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />

        <label style={styles.label}>Confirm Password</label>
        <input
          style={styles.input}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-type your password"
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={styles.footer}>
          Already have an account? <a href="/login">Log in</a>
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
  success: {
    background: "#1a5c2a",
    color: "#b3ffcc",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    textAlign: "center",
  },
  footer: { textAlign: "center", fontSize: "0.85rem", marginTop: "1rem" },
};

export default Register;