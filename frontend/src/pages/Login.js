import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Icon from "../components/Icon";
import ICONS from "../constants/icons";

function Login() {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginIdentifier.trim() || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { loginIdentifier, password });
      login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Invalid username/email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background Decorative Ambient Glows */}
      <div style={styles.glowTopLeft} />
      <div style={styles.glowBottomRight} />

      <div className="glass-card animate-fade-up" style={styles.card}>
        {/* Brand Header */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <Icon d={ICONS.cardano} size={24} strokeWidth={2.5} />
          </div>
          <h1 style={styles.title}>BlockBazaar</h1>
          <p style={styles.subtitle}>Welcome back! Sign in to access your Web3 portal.</p>
        </div>

        {error && (
          <div style={styles.errorAlert} className="animate-scale-in">
            <Icon d={ICONS.alertCircle} size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username or Email</label>
            <input
              id="input-login-identifier"
              className="bb-input"
              type="text"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              placeholder="e.g. alex or alex@example.com"
              disabled={loading}
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              id="input-login-password"
              className="bb-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              disabled={loading}
            />
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            className="bb-btn bb-btn-primary"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? (
              <>
                <Icon
                  d={ICONS.spinner}
                  size={18}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Authenticating...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Don't have an account?</span>{" "}
          <Link to="/register" style={styles.registerLink} id="link-register">
            Create an Account
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
  glowTopLeft: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "450px",
    height: "450px",
    background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glowBottomRight: {
    position: "absolute",
    bottom: "-10%",
    right: "-10%",
    width: "450px",
    height: "450px",
    background: "radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
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
    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(129, 140, 248, 0.2) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#38BDF8",
    marginBottom: "0.5rem",
    boxShadow: "0 0 20px rgba(56, 189, 248, 0.25)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #F8FAFC 0%, #38BDF8 100%)",
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
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
    marginTop: "0.5rem",
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
  registerLink: {
    color: "#38BDF8",
    fontWeight: "600",
    textDecoration: "none",
    transition: "color 0.2s",
  },
};

export default Login;