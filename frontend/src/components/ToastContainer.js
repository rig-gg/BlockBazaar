import Icon from "./Icon";
import ICONS from "../constants/icons";

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="bb-toast-container">
      {toasts.map(({ id, type, message, closing }) => (
        <div
          key={id}
          className={`bb-toast bb-toast-${type} ${closing ? "bb-toast-exit" : "animate-scale-in"}`}
        >
          <Icon d={type === "success" ? ICONS.check : ICONS.alertCircle} size={18} />
          <span className="bb-toast-message">{message}</span>
          <button
            type="button"
            className="bb-toast-close"
            onClick={() => onDismiss(id)}
            aria-label="Dismiss notification"
          >
            <Icon d={ICONS.x} size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
