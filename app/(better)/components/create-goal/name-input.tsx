import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
export default function NameInput({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) {
  const t = useTranslations("goal.create");
  const [focus, setFocus] = useState(false);

  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id="goalName"
        placeholder={t("name")}
        className="mt-16 border-none border-slate-400 text-2xl! shadow-none ring-0!"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <Separator
        className={cn(
          "-mx-6 w-[calc(100%+3rem)]! origin-top transition-all duration-300",
          focus && "scale-y-300"
        )}
      />
    </div>
  );
}
