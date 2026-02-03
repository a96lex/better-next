"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ModalWrapper from "../shared/modal-wrapper";
import { Menu } from "lucide-react";

export default function ProfileModal() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const userName = session?.user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Profile"
      actionLabel="Logout"
      onAction={() => signOut()}
      trigger={
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center rounded-full font-semibold transition-opacity hover:opacity-90"
        >
          <Menu />
        </button>
      }
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="bg-goal-0 text-goal-foreground-0 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold">
          {userInitials}
        </div>
        <h2 className="text-xl font-semibold">{userName}</h2>
      </div>
    </ModalWrapper>
  );
}
