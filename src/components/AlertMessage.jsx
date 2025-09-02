
import { useEffect } from "react";
import { pageShell } from "../utils/styles";

export default function AlertMessage({ type = "info", message, onClose, autoClose = 3000 }) {
  if (!message) return null;

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => onClose(), autoClose);
      return () => clearTimeout(timer);
    }
  }, [message, autoClose, onClose]);

  const bg = type === "error" ? "#fee2e2" : type === "success" ? "#dcfce7" : "#e0f2fe";
  const color = type === "error" ? "#b91c1c" : type === "success" ? "#15803d" : "#075985";

  return (
    <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
      <div style={{ background: bg, color, padding: "10px 16px", borderRadius: 10, border: `1px solid ${color}22`, display: "flex", alignItems: "center" }}>
        <strong style={{ marginRight: 8 }}>{type.toUpperCase()}</strong>
        <span>{message}</span>
        <button onClick={onClose} style={{ marginLeft: 12, ...pageShell.lightBtn }}>×</button>
      </div>
    </div>
  );
}
