"use client";

import { signOut } from "next-auth/react";
import { api } from "@/app/lib/trpc/client";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import CreateGoal from "./components/create-goal";

export default function Home() {
  const t = useTranslations("goal.list");

  const { data: goals } = api.goal.getAll.useQuery();

  return (
    <div className="min-h-screen p-4">
      <button onClick={() => signOut()}>signout</button>
      <h1>{t("header")}</h1>
      <div className="grid grid-cols-2 gap-4">
        {goals?.map((g, idx) => {
          return (
            <div key={g.id}>
              <div
                className={`bg-goal-${idx % 6} flex items-end justify-between rounded-xl p-2 text-goal-foreground-${idx % 6} h-28`}
              >
                <div>
                  <h1>{String(g.events?.[0]?.timestamp ?? "-")}</h1>
                  <p>días</p>
                </div>
                <RotateCcw className="bg-foreground/10 h-8 w-14 rounded-full p-1" />
              </div>
              <h2 className="mt-1 pl-1">{g.name}</h2>
              {/* <h2 className="mt-1 pl-1">{g.description}</h2> */}
            </div>
          );
        })}
      </div>
      <CreateGoal />
    </div>
  );
}
