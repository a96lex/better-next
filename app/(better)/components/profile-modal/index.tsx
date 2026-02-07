"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ModalWrapper from "../shared/modal-wrapper";
import { Settings } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const LOCALES = [
  { code: "ca", name: "Català" },
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
] as const;

export default function ProfileModal() {
  const t = useTranslations("profile");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const userName = session?.user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title={t("title")}
      actionLabel={t("logout")}
      onAction={() => signOut()}
      trigger={
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center rounded-full font-semibold transition-opacity hover:opacity-90"
        >
          <Settings />
        </button>
      }
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="bg-goal-0 text-goal-foreground-0 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold">
          {userInitials}
        </div>
        <h2 className="text-xl font-semibold">{userName}</h2>

        <div className="w-full max-w-xs">
          <label className="text-muted-foreground mb-2 block text-sm font-medium">
            {t("language")}
          </label>
          <select
            value={locale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            className="bg-background border-border w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LOCALES.map((loc) => (
              <option key={loc.code} value={loc.code}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ModalWrapper>
  );
}
