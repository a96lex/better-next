"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";

export default function DateTimeInput({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("goal.create");

  const getTimeString = (date: Date | undefined) => {
    if (!date) return "00:00";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setDate(undefined);
      return;
    }

    const currentDate = date || new Date();
    const updatedDate = new Date(newDate);
    updatedDate.setHours(
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds(),
      currentDate.getMilliseconds()
    );
    setDate(updatedDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    if (!timeString || !date) return;

    const [hours, minutes] = timeString.split(":").map(Number);
    const updatedDate = new Date(date);
    updatedDate.setHours(hours, minutes, 0, 0);
    setDate(updatedDate);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          {t("date")}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="bg-accent w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              hidden={{ after: new Date() }}
              onSelect={handleDateChange}
              startMonth={new Date(2000, 0)}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          {t("time")}
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="60"
          value={getTimeString(date)}
          onChange={handleTimeChange}
          className="bg-accent appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
