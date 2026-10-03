import { useEffect } from "react";
import { createPortal } from "react-dom";

import "../../styles/modal.css";

import Icon from "../ui/icon";

export default function Modal({ onClose, showClose = true, children, className = "" }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {showClose && (
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
