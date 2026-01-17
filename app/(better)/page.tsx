"use client";

import { signOut } from "next-auth/react";
import { api } from "@/app/lib/trpc/client";
import { useTranslations } from "next-intl";
import CreateGoal from "./components/create-goal";
import GoalItem from "./components/goal-view";

export default function Home() {
  const t = useTranslations("goal.list");

  const { data: goals } = api.goal.getAll.useQuery();

  return (
    <div className="min-h-screen p-4">
      <button onClick={() => signOut()}>signout</button>
      <h1>{t("header")}</h1>
      <div className="grid grid-cols-1 gap-4">
        {goals?.length ? (
          goals.map((g, idx) => {
            return <GoalItem key={g.id} idx={idx} goal={g} />;
          })
        ) : (
          <div>{t("empty")}</div>
        )}
      </div>
      <CreateGoal />
    </div>
  );
}
