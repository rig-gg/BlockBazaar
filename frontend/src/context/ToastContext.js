import { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";
import ToastContainer from "../components/ToastContainer";

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Timing constants ─────────────────────────────────────────────────────────
const TOAST_DURATION = 4000;
const EXIT_DURATION = 200; // must match the .bb-toast-exit animation duration

// ─── Provider ────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  /** Marks a toast as closing (plays the exit animation), then removes it from state. */
  const dismissToast = useCallback((id) => {
    setToasts((current) => current.map((t) => (t.id === id ? { ...t, closing: true } : t)));
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, EXIT_DURATION);
  }, []);

  const pushToast = useCallback(
    (type, message) => {
      const id = ++nextId.current;
      setToasts((current) => [{ id, type, message, closing: false }, ...current]);
      setTimeout(() => dismissToast(id), TOAST_DURATION);
    },
    [dismissToast]
  );

  const toast = useMemo(
    () => ({
      success: (message) => pushToast("success", message),
      error: (message) => pushToast("error", message),
    }),
    [pushToast]
  );

  const value = { toast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Returns { success, error } — call toast.success(msg) / toast.error(msg) to show a toast.
 * Must be used inside <ToastProvider>.
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
}

export default ToastContext;
