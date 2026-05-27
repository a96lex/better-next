"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleLogo from "@/app/(better)/components/shared/google-logo";

export default function SignInPage() {
  const t = useTranslations("auth");
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleAnonymous = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setIsPending(true);
    await signIn("anonymous", { name: trimmed, callbackUrl: "/" });
  };

  const handleGoogle = async () => {
    setIsPending(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl p-6">
        <h1 className="text-center">{t("welcome")}</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnonymous();
          }}
          className="flex flex-col gap-3"
        >
          <label htmlFor="name" className="text-sm font-medium">
            {t("nameLabel")}
          </label>
          <Input
            id="name"
            type="text"
            autoComplete="nickname"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
          <Button
            type="submit"
            className="rounded-full"
            disabled={isPending || !name.trim()}
          >
            {isPending ? <Loader2 className="animate-spin" /> : t("continue")}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <span className="text-muted-foreground text-xs">{t("or")}</span>
          <div className="bg-border h-px flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={handleGoogle}
          disabled={isPending}
        >
          <GoogleLogo />
          {t("googleSignIn")}
        </Button>
      </div>
    </div>
  );
}
