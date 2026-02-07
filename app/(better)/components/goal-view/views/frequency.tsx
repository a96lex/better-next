  import { ExpandedGoal } from "@/app/server/routers/goal";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Bar, BarChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function EventFrequencyView({ goal }: { goal: ExpandedGoal }) {
  const t = useTranslations("goal.list");
  const locale = useLocale();
  const [monthOffset, setMonthOffset] = useState(0);

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() - monthOffset);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const monthEvents = goal.events.filter((event) => {
    const eventDate = new Date(event.timestamp);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });

  const dateCountMap = new Map<string, number>();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    dateCountMap.set(dateKey, 0);
  }

  monthEvents.forEach((event) => {
    const eventDate = new Date(event.timestamp);
    const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`;
    if (dateCountMap.has(dateKey)) {
      dateCountMap.set(dateKey, (dateCountMap.get(dateKey) || 0) + 1);
    }
  });

  const chartData = Array.from(dateCountMap.entries())
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const chartConfig = {
    count: {
      label: "Events",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const monthName = targetDate.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const canGoForward = monthOffset > 0;

  return (
    <div className="w-full px-1">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{t("frequency")}</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonthOffset(monthOffset + 1)}
            className="hover:bg-foreground/10 rounded p-1 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-muted-foreground text-xs font-medium">
            {monthName}
          </span>
          <button
            onClick={() => setMonthOffset(monthOffset - 1)}
            disabled={!canGoForward}
            className="hover:bg-foreground/10 rounded p-1 transition-colors disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart data={chartData}>
          <XAxis
            dataKey="date"
            tickFormatter={(value, index) => {
              const day = parseInt(value.split("-")[2], 10);

              if (index === 0 || index === chartData.length - 1) {
                return day.toString();
              }

              const middleInterval = Math.floor(chartData.length / 5);
              if (middleInterval > 0 && index % middleInterval === 0) {
                return day.toString();
              }

              return "";
            }}
            tick={{ fontSize: 11 } as React.SVGProps<SVGTextElement>}
            tickLine={true}
            axisLine={false}
            height={30}
            interval={0}
          />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
