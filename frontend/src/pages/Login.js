import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Icon from "../components/Icon";
import ICONS from "../constants/icons";
import Alert from "../components/Alert";

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
    <div className="bb-auth-page bb-auth-login">
      {/* Background Decorative Ambient Glows */}
      <div className="bb-auth-glow bb-auth-glow-top" />
      <div className="bb-auth-glow bb-auth-glow-bottom" />

      <div className="glass-card animate-fade-up bb-auth-card">
        {/* Brand Header */}
        <div className="bb-auth-header">
          <div className="bb-auth-logo-badge">
            <Icon d={ICONS.cardano} size={24} strokeWidth={2.5} />
          </div>
          <h1 className="bb-auth-title">BlockBazaar</h1>
          <p className="bb-auth-subtitle">Welcome back! Sign in to access your Web3 portal.</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="bb-auth-form">
          <div className="bb-auth-input-group">
            <label className="bb-auth-label">Username or Email</label>
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

          <div className="bb-auth-input-group">
            <label className="bb-auth-label">Password</label>
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
            className="bb-btn bb-btn-primary bb-auth-submit-btn"
            disabled={loading}
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

        <div className="bb-auth-footer">
          <span>Don't have an account?</span>{" "}
          <Link to="/register" className="bb-auth-link" id="link-register">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
