import { useEffect, useRef } from "react";

let modalCounter = 0;

export function useModalHistory(open: boolean, onClose: () => void) {
  const modalIdRef = useRef(`modal_${++modalCounter}`);
  const stateKey = `${modalIdRef.current}Open`;

  useEffect(() => {
    if (!open) return;

    window.history.pushState({ [stateKey]: true }, "");

    const handleBack = (e: PopStateEvent) => {
      if (!e.state?.[stateKey]) {
        onClose();
      }
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
      if (window.history.state?.[stateKey]) {
        window.history.back();
      }
    };
  }, [open, stateKey, onClose]);
}
