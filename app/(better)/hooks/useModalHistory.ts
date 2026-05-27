import { useEffect, useRef } from "react";

let modalCounter = 0;

export function useModalHistory(open: boolean, onClose: () => void) {
  const modalIdRef = useRef(`modal_${++modalCounter}`);
  const stateKey = `${modalIdRef.current}Open`;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    window.history.pushState({ ...window.history.state, [stateKey]: true }, "");

    const handleBack = (e: PopStateEvent) => {
      if (!e.state?.[stateKey]) {
        onCloseRef.current();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const dialogOpen = document.querySelector(
          '[role="dialog"][data-state="open"]'
        );
        if (!dialogOpen) {
          e.preventDefault();
          onCloseRef.current();
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
  }, [open, stateKey]);
}
