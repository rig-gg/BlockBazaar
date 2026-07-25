import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
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

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed. Username or email may already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background Decorative Ambient Glows */}
      <div style={styles.glowTopRight} />
      <div style={styles.glowBottomLeft} />

      <div className="glass-card animate-fade-up" style={styles.card}>
        {/* Brand Header */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join BlockBazaar to trade, transfer tokens, and verify block hashes.</p>
        </div>

        {error && (
          <div style={styles.errorAlert} className="animate-scale-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successAlert} className="animate-scale-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              id="input-register-username"
              className="bb-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              disabled={loading}
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              id="input-register-email"
              className="bb-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={loading}
            />
          </div>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                id="input-register-password"
                className="bb-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                disabled={loading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                id="input-register-confirm"
                className="bb-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                disabled={loading}
              />
            </div>
          </div>

          <button
            id="btn-register-submit"
            type="submit"
            className="bb-btn bb-btn-emerald"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Registering...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Already have an account?</span>{" "}
          <Link to="/login" style={styles.loginLink} id="link-login">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    position: "relative",
    overflow: "hidden",
  },
  glowTopRight: {
    position: "absolute",
    top: "-10%",
    right: "-10%",
    width: "450px",
    height: "450px",
    background: "radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glowBottomLeft: {
    position: "absolute",
    bottom: "-10%",
    left: "-10%",
    width: "450px",
    height: "450px",
    background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.4rem",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoBadge: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)",
    border: "1px solid rgba(52, 211, 153, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#34D399",
    marginBottom: "0.5rem",
    boxShadow: "0 0 20px rgba(52, 211, 153, 0.25)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #F8FAFC 0%, #34D399 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "0.88rem",
    color: "#94A3B8",
    lineHeight: "1.4",
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.8rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#CBD5E1",
  },
  submitBtn: {
    marginTop: "0.4rem",
    padding: "0.85rem",
    fontSize: "0.95rem",
    width: "100%",
  },
  footer: {
    textAlign: "center",
    fontSize: "0.88rem",
    color: "#94A3B8",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    paddingTop: "1.2rem",
  },
  loginLink: {
    color: "#34D399",
    fontWeight: "600",
    textDecoration: "none",
    transition: "color 0.2s",
  },
};

export default Register;