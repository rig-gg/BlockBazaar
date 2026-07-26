import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Icon from "../components/Icon";
import ICONS from "../constants/icons";
import Alert from "../components/Alert";
import { useToast } from "../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

      toast.success("Account created successfully! Redirecting to login...");
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
    <div className="bb-auth-page bb-auth-register">
      {/* Background Decorative Ambient Glows */}
      <div className="bb-auth-glow bb-auth-glow-top" />
      <div className="bb-auth-glow bb-auth-glow-bottom" />

      <div className="glass-card animate-fade-up bb-auth-card">
        {/* Brand Header */}
        <div className="bb-auth-header">
          <div className="bb-auth-logo-badge">
            <Icon d={ICONS.userPlus} size={24} strokeWidth={2.5} />
          </div>
          <h1 className="bb-auth-title">Create Account</h1>
          <p className="bb-auth-subtitle">Join BlockBazaar to trade, transfer tokens, and verify block hashes.</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="bb-auth-form">
          <div className="bb-auth-input-group">
            <label className="bb-auth-label">Username</label>
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

          <div className="bb-auth-input-group">
            <label className="bb-auth-label">Email Address</label>
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

          <div className="bb-auth-input-row">
            <div className="bb-auth-input-group">
              <label className="bb-auth-label">Password</label>
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

            <div className="bb-auth-input-group">
              <label className="bb-auth-label">Confirm Password</label>
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
            className="bb-btn bb-btn-emerald bb-auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon
                  d={ICONS.spinner}
                  size={18}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Registering...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>

        <div className="bb-auth-footer">
          <span>Already have an account?</span>{" "}
          <Link to="/login" className="bb-auth-link" id="link-login">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
