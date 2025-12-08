-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_goalId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
