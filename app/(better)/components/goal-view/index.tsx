"use client";

import { useState } from "react";
import { RotateCcw, X, Pencil } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandedGoal } from "@/app/server/routers/goal";
import { DialogTrigger } from "@/components/ui/dialog";
import { useModalHistory } from "../../hooks/useModalHistory";
import AddEvent from "./add-event";
import EditGoal from "./edit-goal";
import EventListView from "./views/list";

export default function GoalItem({
  goal,
  idx,
}: {
  goal: ExpandedGoal;
  idx: number;
}) {
  const t = useTranslations("goal.list");
  const [isOpen, setIsOpen] = useState(false);

  const days = goal.events?.[0]
    ? differenceInDays(new Date(), goal.events[0].timestamp)
    : 0;

  const handleClose = () => setIsOpen(false);

  useModalHistory(isOpen, handleClose);

  const addEventButton = (
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
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-background fixed inset-4 z-45 overflow-auto rounded-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="mb-4 p-2 hover:opacity-70"
              >
                <X className="h-5 w-5" />
              </button>
              <motion.div
                layoutId={`goal-card-${goal.id}`}
                className={`bg-goal-${idx % 6} text-goal-foreground-${idx % 6} mb-6 rounded-xl p-3`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-bold">{goal.name}</h2>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <EditGoal
                      goal={goal}
                      trigger={
                        <DialogTrigger asChild>
                          <button className="hover:bg-foreground/10 rounded-lg p-2">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </DialogTrigger>
                      }
                    />
                  </motion.div>
                </div>
                {goal.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    className="my-2 text-sm"
                  >
                    {goal.description}
                  </motion.p>
                )}
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <h1 className="text-4xl leading-none font-bold">{days}</h1>
                    <p className="text-sm opacity-80">{t("days")}</p>
                  </div>
                  {addEventButton}
                </div>
              </motion.div>
              {goal.events && goal.events.length > 0 && (
                <div>
                  <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                    {t("history")}
                  </h3>
                  <EventListView goal={goal} />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          layoutId={`goal-card-${goal.id}`}
          onClick={() => {
            if (!document.querySelector('[role="dialog"][data-state="open"]')) {
              setIsOpen(true);
            }
          }}
          className={`bg-goal-${idx % 6} text-goal-foreground-${idx % 6} h-28 cursor-pointer rounded-xl p-3`}
        >
          <div className="flex h-full flex-col justify-between">
            <h2 className="text-sm font-medium opacity-90">{goal.name}</h2>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl leading-none font-bold">{days}</h1>
                <p className="text-sm opacity-80">{t("days")}</p>
              </div>
              {addEventButton}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
