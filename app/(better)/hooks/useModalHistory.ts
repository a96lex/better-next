import { useEffect, useRef } from "react";

let modalCounter = 0;

export function useModalHistory(open: boolean, onClose: () => void) {
  const modalIdRef = useRef(`modal_${++modalCounter}`);
  const stateKey = `${modalIdRef.current}Open`;

  useEffect(() => {
    if (!open) return;

    window.history.pushState({ ...window.history.state, [stateKey]: true }, "");

    const handleBack = (e: PopStateEvent) => {
      if (!e.state?.[stateKey]) {
        onClose();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const dialogOpen = document.querySelector(
          '[role="dialog"][data-state="open"]'
        );
        if (!dialogOpen) {
          e.preventDefault();
          onClose();
        }
      }
    };

    window.addEventListener("popstate", handleBack);
    window.addEventListener("keydown", handleEsc, { capture: true });

    return () => {
      window.removeEventListener("popstate", handleBack);
      window.removeEventListener("keydown", handleEsc, { capture: true });
      if (window.history.state?.[stateKey]) {
        window.history.back();
      }
    };
  }, [open, stateKey, onClose]);
}
