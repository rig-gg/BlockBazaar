import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginIdentifier.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        loginIdentifier: loginIdentifier.trim(),
        password,
      });
      login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid username or password.");
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

        <label style={styles.label}>Username or Email</label>
        <input
          style={styles.input}
          type="text"
          value={loginIdentifier}
          onChange={(e) => setLoginIdentifier(e.target.value)}
          placeholder="Enter your username or email"
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <button
          style={{
            ...styles.button,
            ...(hovered && !loading ? styles.buttonHover : {}),
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          type="submit"
          disabled={loading}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p style={styles.footer}>
          Don't have an account? <a href="/register" style={{ color: "#4fc3f7" }}>Register</a>
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
    padding: "1rem",
  },
  card: {
    background: "#16213e",
    padding: "2.5rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    color: "#eee",
  },
  title: { margin: 0, textAlign: "center", color: "#4fc3f7" },
  subtitle: {
    marginTop: "0.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#aaa",
    fontSize: "0.95rem",
  },
  error: {
    background: "rgba(244,67,54,0.15)",
    color: "#e57373",
    padding: "0.6rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    marginBottom: "1rem",
    border: "1px solid rgba(244,67,54,0.3)",
    textAlign: "center",
  },
  label: {
    fontSize: "0.85rem",
    marginBottom: "0.3rem",
    color: "#ccc",
  },
  input: {
    padding: "0.7rem 0.9rem",
    borderRadius: "6px",
    border: "1px solid #0f3460",
    background: "#0f3460",
    color: "#fff",
    fontSize: "0.95rem",
    marginBottom: "1.2rem",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "none",
    background: "#00adb5",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
    transition: "background 0.2s",
  },
  buttonHover: {
    background: "#009198",
  },
  footer: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#aaa",
  },
};

export default Login;