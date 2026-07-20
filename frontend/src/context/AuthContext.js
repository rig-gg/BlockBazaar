import { createContext, useContext, useState, useCallback } from "react";

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Storage helpers (keeps token logic in one place) ────────────────────────
const TOKEN_KEY = "bb_token";
const USER_KEY  = "bb_user";

function loadFromStorage() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user  = JSON.parse(localStorage.getItem(USER_KEY));
    return token && user ? { token, user } : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => loadFromStorage());

  /**
   * Call after a successful login or register response.
   * @param {{ token: string, userId: number, username: string }} data
   */
  const login = useCallback((data) => {
    const { token, userId, username } = data;
    const user = { userId, username };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthState({ token, user });
  }, []);

  /** Clears JWT and user info from both state and localStorage. */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({ token: null, user: null });
  }, []);

  const value = {
    token: authState.token,
    user:  authState.user,
    isAuthenticated: Boolean(authState.token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Returns { token, user, isAuthenticated, login, logout }.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
