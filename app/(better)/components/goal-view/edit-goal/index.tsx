"use client";

import { api } from "@/app/lib/trpc/client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpandedGoal } from "@/app/server/routers/goal";
import ModalWrapper from "../../shared/modal-wrapper";
import { Pencil } from "lucide-react";

interface EditGoalProps {
  goal: ExpandedGoal;
}

export default function EditGoal({ goal }: EditGoalProps) {
  const [name, setName] = useState(goal.name);
  const [description, setDescription] = useState(goal.description || "");
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const t = useTranslations("goal.edit");

  const updateGoalMutation = api.goal.update.useMutation();

  const handleUpdate = () => {
    updateGoalMutation.mutate(
      {
        goalId: goal.id,
        name,
        description: description || null,
      },
      {
        onSuccess: () => {
          utils.goal.getAll.invalidate();
          setOpen(false);
        },
      }
    );
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title={t("title")}
      actionLabel={t("save")}
      onAction={handleUpdate}
      trigger={
        <button className="hover:bg-foreground/10 rounded-lg p-2">
          <Pencil className="h-4 w-4" />
        </button>
      }
      isPending={updateGoalMutation.isPending}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div>
          <Label htmlFor="description">{t("description")}</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            placeholder={t("descriptionPlaceholder")}
            disabled={updateGoalMutation.isPending}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
