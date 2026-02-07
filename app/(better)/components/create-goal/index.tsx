"use client";

import { api } from "@/app/lib/trpc/client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NameInput from "./name-input";
import ModalWrapper from "../shared/modal-wrapper";

export default function CreateGoal() {
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const t = useTranslations("goal.create");

  const createGoalMutation = api.goal.create.useMutation();
  const handleCreateGoal = () => {
    createGoalMutation.mutate(
      {
        name: newGoalName,
        description: newGoalDescription ?? null,
      },
      {
        onSuccess: () => {
          utils.goal.getAll.invalidate();
          setNewGoalName("");
          setNewGoalDescription("");
          setOpen(false);
        },
        onError: (error) => {
          console.error("Creation failed:", error);
        },
      }
    );
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title={t("new")}
      actionLabel={t("create")}
      onAction={handleCreateGoal}
      trigger={
        <Button
          size="lg"
          className="fixed right-6 bottom-6 h-14 w-14 rounded-full p-0 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      }
      isPending={createGoalMutation.isPending}
    >
      <NameInput value={newGoalName} setValue={setNewGoalName} />
      <div className="space-y-4">
        <Label htmlFor="description">{t("description")}</Label>
        <Input
          value={newGoalDescription}
          onChange={(e) => setNewGoalDescription(e.target.value)}
          id="description"
          className="bg-accent"
        />
      </div>
    </ModalWrapper>
  );
}
