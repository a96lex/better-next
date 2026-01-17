"use client";

import { api } from "@/app/lib/trpc/client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import DateTimeInput from "../../create-goal/date-input";
import ModalWrapper from "../../shared/modal-wrapper";

interface AddEventProps {
  goalId: string;
  trigger: React.ReactNode;
}

export default function AddEvent({ goalId, trigger }: AddEventProps) {
  const [timestamp, setTimestamp] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const t = useTranslations("event.create");

  useEffect(() => {
    if (!open) return;

    window.history.pushState({ addEventModalOpen: true }, "");

    const handleBack = (e: PopStateEvent) => {
      if (!e.state?.addEventModalOpen) {
        setOpen(false);
      }
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
      if (window.history.state?.addEventModalOpen) {
        window.history.back();
      }
    };
  }, [open]);

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
      trigger={trigger}
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
        />
      </div>
    </ModalWrapper>
  );
}
