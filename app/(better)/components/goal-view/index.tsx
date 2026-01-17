"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, X, Pencil } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { useTranslations } from "next-intl";
import { ExpandedGoal } from "@/app/server/routers/goal";
import { DialogTrigger } from "@/components/ui/dialog";
import AddEvent from "./add-event";
import EditGoal from "./edit-goal";

export default function GoalItem({
  goal,
  idx,
}: {
  goal: ExpandedGoal;
  idx: number;
}) {
  const t = useTranslations("goal.list");
  const [isOpen, setIsOpen] = useState(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const days = goal.events?.[0]
    ? differenceInDays(new Date(), goal.events[0].timestamp)
    : 0;

  const handleOpen = () => {
    if (!cardRef.current) return;
    setCardRect(cardRef.current.getBoundingClientRect());
    setIsOpen(true);
    setTimeout(() => setIsAnimating(true), 50);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ goalModalOpen: true }, "");

    const handleBack = (e: PopStateEvent) => {
      if (!e.state?.addEventModalOpen && !e.state?.goalModalOpen) {
        handleClose();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      // Only handle ESC if no Dialog modal is open (Dialog has data-state="open")
      if (e.key === "Escape") {
        const dialogOpen = document.querySelector(
          '[role="dialog"][data-state="open"]'
        );
        if (!dialogOpen) {
          e.preventDefault();
          handleClose();
        }
      }
    };

    window.addEventListener("popstate", handleBack);
    window.addEventListener("keydown", handleEsc, { capture: true });

    return () => {
      window.removeEventListener("popstate", handleBack);
      window.removeEventListener("keydown", handleEsc, { capture: true });
      if (
        window.history.state?.goalModalOpen &&
        !window.history.state?.addEventModalOpen
      ) {
        window.history.back();
      }
    };
  }, [isOpen]);

  const card = (
    <div className="flex h-full flex-col justify-between">
      <h2 className="text-sm font-medium opacity-90">{goal.name}</h2>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl leading-none font-bold">{days}</h1>
          <p className="text-sm opacity-80">{t("days")}</p>
        </div>
        <AddEvent
          goalId={goal.id}
          trigger={
            <DialogTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="bg-foreground/10 hover:bg-foreground/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </DialogTrigger>
          }
        />
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
            style={{ opacity: isAnimating ? 1 : 0 }}
            onClick={handleClose}
          />
          <div
            className="bg-background fixed inset-4 z-45 overflow-auto rounded-xl p-4 transition-opacity duration-300"
            style={{ opacity: isAnimating ? 1 : 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="mb-4 p-2 hover:opacity-70">
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 h-28" />

            <div className="mb-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="mb-1 text-2xl font-bold">{goal.name}</h1>
                  {goal.description && (
                    <p className="text-muted-foreground text-sm">
                      {goal.description}
                    </p>
                  )}
                </div>
                <EditGoal
                  goal={goal}
                  trigger={
                    <DialogTrigger asChild>
                      <button className="hover:bg-muted rounded-lg p-2">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </DialogTrigger>
                  }
                />
              </div>
            </div>

            {goal.events && goal.events.length > 0 && (
              <div>
                <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                  History
                </h3>
                <div className="space-y-3">
                  {goal.events.map((event, i) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="bg-primary mt-1.5 h-2 w-2 rounded-full" />
                        {i < goal.events.length - 1 && (
                          <div className="bg-border mt-1 w-px flex-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="mb-0.5 text-sm font-medium">
                          {format(new Date(event.timestamp), "PPP")}
                        </p>
                        {event.description && (
                          <p className="text-muted-foreground text-sm">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className={`fixed z-50 bg-goal-${idx % 6} text-goal-foreground-${idx % 6} h-28 rounded-xl p-3 transition-all duration-300 ease-out`}
            style={
              isAnimating && cardRect
                ? { top: 80, left: 32, right: 32 }
                : cardRect
                  ? {
                      top: cardRect.top,
                      left: cardRect.left,
                      width: cardRect.width,
                    }
                  : {}
            }
          >
            {card}
          </div>
        </>
      )}

      <div ref={cardRef} style={{ visibility: isOpen ? "hidden" : "visible" }}>
        <div
          onClick={handleOpen}
          className={`bg-goal-${idx % 6} text-goal-foreground-${idx % 6} h-28 cursor-pointer rounded-xl p-3`}
        >
          {card}
        </div>
      </div>
    </>
  );
}
