"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";
import type { Session } from "next-auth";
import { api } from "@/app/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ModalWrapper from "../shared/modal-wrapper";
import GoogleLogo from "../shared/google-logo";

export default function ProfileModal({ user }: { user: Session["user"] }) {
  const t = useTranslations("profile");
  const [name, setName] = useState(user.name ?? "");
  const [open, setOpen] = useState(false);

  const updateName = api.user.updateName.useMutation({
    onSuccess: () => setOpen(false),
  });

  const trimmed = name.trim();
  const canSave = !!trimmed && trimmed !== user.name;
  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title={t("title")}
      actionLabel={t("save")}
      onAction={() => canSave && updateName.mutate({ name: trimmed })}
      trigger={
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center rounded-full font-semibold transition-opacity hover:opacity-90"
        >
          <Settings />
        </button>
      }
      isPending={updateName.isPending}
    >
      <div className="flex flex-col gap-6 py-2">
        <div className="bg-goal-0 text-goal-foreground-0 mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold">
          {initials}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="displayName">{t("displayName")}</Label>
          <Input
            id="displayName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("displayNamePlaceholder")}
            disabled={updateName.isPending}
          />
        </div>
        {user.isAnonymous && (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <GoogleLogo />
            {t("googleSignIn")}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          className="rounded-full"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          {t("logout")}
        </Button>
      </div>
    </ModalWrapper>
  );
}
