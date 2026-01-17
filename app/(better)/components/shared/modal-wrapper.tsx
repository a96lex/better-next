import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ModalWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  actionLabel: string;
  onAction: () => void;
  trigger: ReactNode;
  children: ReactNode;
}

export default function ModalWrapper({
  open,
  onOpenChange,
  title,
  actionLabel,
  onAction,
  trigger,
  children,
}: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      {trigger}
      <DialogContent
        className="z-60 flex max-h-[80vh] w-[calc(100%-2rem)] max-w-lg flex-col gap-4 p-6"
        showCloseButton={false}
      >
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <DialogClose className="-mr-2 p-2 hover:opacity-70">
            <X className="h-5 w-5" />
          </DialogClose>
        </div>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex-1 space-y-4 overflow-auto">{children}</div>
        <div className="flex justify-end">
          <Button className="rounded-full px-6" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
