"use client";

import { signOut } from "next-auth/react";
import { api } from "@/app/lib/trpc/client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const t = useTranslations("goalList");

  const utils = api.useUtils();

  const getMutation = api.goal.create.useMutation();
  const { data: goals } = api.goal.getAll.useQuery();

  const handleCreateGoal = () => {
    getMutation.mutate(
      {
        name: newGoalName,
        description: newGoalDescription ?? null,
      },
      {
        onSuccess: () => {
          utils.goal.getAll.invalidate();
          setNewGoalName("");
          setNewGoalDescription("");
        },
        onError: (error) => {
          console.error("Creation failed:", error);
        },
      }
    );
  };

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
              <h2 className="mt-1 pl-1">{g.description}</h2>
            </div>
          );
        })}
      </div>

      <input
        value={newGoalName}
        onChange={(e) => setNewGoalName(e.target.value)}
      />
      <input
        value={newGoalDescription}
        onChange={(e) => setNewGoalDescription(e.target.value)}
      />
      <button onClick={() => handleCreateGoal()}>{t("create")}</button>
    </div>
  );
}
