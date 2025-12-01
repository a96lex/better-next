"use client";

import { signOut } from "next-auth/react";
import { api } from "@/app/lib/trpc/client";
import { useState } from "react";

export default function Home() {
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");

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
    <div className="min-h-screen p-8">
      <button onClick={() => signOut()}>signout</button>
      {goals?.map((g) => {
        return (
          <div key={g.id}>
            {g.name} - {g.description}
          </div>
        );
      })}

      <input
        value={newGoalName}
        onChange={(e) => setNewGoalName(e.target.value)}
      />
      <input
        value={newGoalDescription}
        onChange={(e) => setNewGoalDescription(e.target.value)}
      />
      <button onClick={() => handleCreateGoal()}>create goal</button>
    </div>
  );
}
