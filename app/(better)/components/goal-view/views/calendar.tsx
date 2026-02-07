import { format } from "date-fns";
import { ExpandedGoal } from "@/app/server/routers/goal";

export default function EventListView({ goal }: { goal: ExpandedGoal }) {
  return (
    <>
      {goal.events.map((event, i) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="bg-primary mt-1.5 h-2 w-2 rounded-full" />
            {i < goal.events.length - 1 && (
              <div className="bg-border mt-1 w-px flex-1" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <p className="mb-0.5 text-sm font-medium">
              {format(new Date(event.timestamp), "PPP")}
            </p>
            {event.description && (
              <p className="text-muted-foreground text-sm">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
