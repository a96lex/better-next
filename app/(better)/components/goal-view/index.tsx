import { RotateCcw } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useTranslations } from "next-intl";
import { ExpandedGoal } from "@/app/server/routers/goal";

export default function GoalItem({
  goal,
  idx,
}: {
  goal: ExpandedGoal;
  idx: number;
}) {
  const t = useTranslations("goal.list");

  return (
    <div>
      <div
        className={`bg-goal-${idx % 6} flex items-end justify-between rounded-xl p-2 text-goal-foreground-${idx % 6} h-28`}
      >
        <div>
          <h1>{differenceInDays(new Date(), goal.events?.[0].timestamp)}</h1>
          <p>{t("days")}</p>
        </div>
        <RotateCcw className="bg-foreground/10 h-8 w-14 rounded-full p-1" />
      </div>
      <h2 className="mt-1 pl-1">{goal.name}</h2>
      {/* <h2 className="mt-1 pl-1">{goal.description}</h2> */}
    </div>
  );
}
