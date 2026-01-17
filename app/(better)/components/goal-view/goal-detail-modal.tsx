"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { useTranslations } from "next-intl";
import { ExpandedGoal } from "@/app/server/routers/goal";
import { DialogTrigger } from "@/components/ui/dialog";
import AddEvent from "./add-event";

interface GoalDetailModalProps {
  goal: ExpandedGoal;
  idx: number;
  onClose: () => void;
  cardRect: DOMRect | null;
}

export default function GoalDetailModal({
  goal,
  idx,
  onClose,
  cardRect,
}: GoalDetailModalProps) {
  const t = useTranslations("goal.list");
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const daysSinceLastEvent = goal.events?.[0]
    ? differenceInDays(new Date(), goal.events[0].timestamp)
    : 0;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    window.history.pushState({ modalOpen: true }, "");

    const handlePopState = (e: PopStateEvent) => {
      handleClose();

      window.history.pushState({ modalOpen: true }, "");
    };

    window.addEventListener("popstate", handlePopState);

    setTimeout(() => setIsAnimating(false), 50);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, []);

  const getInitialStyle = () => {
    if (!cardRect) return {};
    return {
      top: `${cardRect.top}px`,
      left: `${cardRect.left}px`,
      width: `${cardRect.width}px`,
      height: `${cardRect.height}px`,
    };
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className="fixed transition-all duration-300 ease-out"
        style={
          isAnimating && !isClosing
            ? getInitialStyle()
            : isClosing && cardRect
              ? getInitialStyle()
              : { top: "2rem", left: "1rem", right: "1rem", bottom: "2rem" }
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-background h-full overflow-y-auto rounded-2xl shadow-2xl">
          <div className="p-6">
            <button
              onClick={handleClose}
              className="mb-6 flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>

            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">{goal.name}</h1>
              {goal.description && (
                <p className="text-muted-foreground">{goal.description}</p>
              )}
            </div>

            <div
              className={`bg-goal-${idx % 6} text-goal-foreground-${idx % 6} mb-8 rounded-2xl p-8 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-6xl font-bold">
                    {daysSinceLastEvent}
                  </h2>
                  <p className="text-xl">{t("days")}</p>
                </div>
                <AddEvent
                  goalId={goal.id}
                  trigger={
                    <DialogTrigger asChild>
                      <button className="bg-foreground/10 hover:bg-foreground/20 h-16 w-16 rounded-full p-3 transition-colors">
                        <RotateCcw className="h-full w-full" />
                      </button>
                    </DialogTrigger>
                  }
                />
              </div>
            </div>

            <div
              className={`transition-opacity delay-150 duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}
            >
              <h3 className="mb-4 text-xl font-semibold">
                {t("eventHistory")}
              </h3>
              {goal.events && goal.events.length > 0 ? (
                <div className="space-y-3">
                  {goal.events.map((event, i) => (
                    <div
                      key={event.id}
                      className="hover:bg-muted/50 rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">
                            {format(new Date(event.timestamp), "PPP")}
                          </p>
                          {event.description && (
                            <p className="text-muted-foreground mt-1 text-sm">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm whitespace-nowrap">
                          {differenceInDays(new Date(), event.timestamp)}{" "}
                          {t("daysAgo")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noEvents")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
