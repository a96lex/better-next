"use client";

import { api } from "@/app/lib/trpc/client";
import { useTranslations } from "next-intl";
import CreateGoal from "./components/create-goal";
import GoalItem from "./components/goal-view";
import ProfileModal from "./components/profile-modal";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const t = useTranslations("goal.list");
  const { data: goals, isLoading } = api.goal.getAll.useQuery();

  return (
    <div className="min-h-screen p-4">
      <div className="mb-4 flex justify-between">
        <h1>{t("header")}</h1>
        <ProfileModal />
      </div>

      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {goals?.length ? (
            goals.map((g, idx) => <GoalItem key={g.id} idx={idx} goal={g} />)
          ) : (
            <div>{t("empty")}</div>
          )}
        </div>
      )}

      <CreateGoal />
    </div>
  );
}
