import { api } from "@/app/lib/trpc/client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NameInput from "./name-input";
import DateTimeInput from "./date-input";

export default function CreateGoal() {
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const t = useTranslations("goal.create");

  const getMutation = api.goal.create.useMutation();
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
          setOpen(false);
        },
        onError: (error) => {
          console.error("Creation failed:", error);
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-2 left-1/2 -translate-x-1/2 rounded-full">
          <Plus />
          {t("new")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex h-[calc(100%-2rem)] w-full flex-col items-stretch gap-2 border-none bg-slate-100 pt-2"
        showCloseButton={false}
      >
        <div className="absolute top-0 left-0 flex w-full justify-between px-6 py-4">
          <DialogClose className="text-slate-500">
            <ArrowLeftIcon className="size-5" />
          </DialogClose>
          <Button className="rounded-full" onClick={() => handleCreateGoal()}>
            {t("create")}
          </Button>
        </div>
        <NameInput value={newGoalName} setValue={setNewGoalName} />
        <DateTimeInput date={date} setDate={setDate} />
        <DialogTitle className="sr-only">{t("new")}</DialogTitle>
        <Label htmlFor="description">{t("description")}</Label>
        <Input
          value={newGoalDescription}
          onChange={(e) => setNewGoalDescription(e.target.value)}
          id="description"
        />
      </DialogContent>
    </Dialog>
  );
}
