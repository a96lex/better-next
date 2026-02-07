"use client";

import { api } from "@/app/lib/trpc/client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DateTimeInput from "../../create-goal/date-input";
import ModalWrapper from "../../shared/modal-wrapper";
import { RotateCcw } from "lucide-react";

interface AddEventProps {
  goalId: string;
}

export default function AddEvent({ goalId }: AddEventProps) {
  const [timestamp, setTimestamp] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const t = useTranslations("event.create");

  const addEventMutation = api.goal.addEvent.useMutation();

  const handleAddEvent = () => {
    addEventMutation.mutate(
      {
        goalId,
        timestamp: timestamp ?? null,
        description: description || null,
      },
      {
        onSuccess: () => {
          utils.goal.getAll.invalidate();
          setTimestamp(new Date());
          setDescription("");
          setOpen(false);
        },
        onError: (error) => {
          console.error("Add event failed:", error);
        },
      }
    );
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title={t("new")}
      actionLabel={t("add")}
      onAction={handleAddEvent}
      trigger={
        <button
          onClick={(e) => e.stopPropagation()}
          className="bg-foreground/10 hover:bg-foreground/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      }
      isPending={addEventMutation.isPending}
    >
      <DateTimeInput date={timestamp} setDate={setTimestamp} />
      <div className="space-y-4">
        <Label htmlFor="description">{t("description")}</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
          className="bg-accent"
          placeholder={t("descriptionPlaceholder")}
          disabled={addEventMutation.isPending}
        />
      </div>
    </ModalWrapper>
  );
}
