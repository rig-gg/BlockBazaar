import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    if (!decoded || !decoded.exp) return false;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (err) {
    return true;
  }
}

function ProtectedRoute({ children }) {
  const { token, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const expired = isTokenExpired(token);

  useEffect(() => {
    if (expired && (token || isAuthenticated)) {
      logout();
    }
  }, [expired, token, isAuthenticated, logout]);

  if (!isAuthenticated || expired) {
    localStorage.removeItem("bb_token");
    localStorage.removeItem("bb_user");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
