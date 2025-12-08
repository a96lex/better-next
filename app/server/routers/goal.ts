import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const goalRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const goals = await ctx.db.goal.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        events: {
          orderBy: { timestamp: "desc" },
          take: 1,
          select: {
            timestamp: true,
          },
        },
      },
    });

    return goals;
  }),

  get: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .query(async ({ ctx, input }) => {
      const goal = await ctx.db.goal.findUnique({
        where: { id: input.goalId, userId: ctx.session.user.id },
        include: { events: true },
      });
      return goal;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        date: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const goal = await ctx.db.goal.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          description: input.description,
        },
      });
      if (input.date) {
        await ctx.db.event.create({
          data: {
            goalId: goal.id,
            timestamp: input.date,
          },
        });
      }
      return goal;
    }),

  update: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        name: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const goal = await ctx.db.goal.update({
        where: { id: input.goalId, userId: ctx.session.user.id },
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          description: input.description,
        },
      });
      return goal;
    }),

  delete: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const goal = await ctx.db.goal.delete({
        where: { id: input.goalId, userId: ctx.session.user.id },
      });
      return goal;
    }),

  addEvent: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        timestamp: z.date().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const goal = await ctx.db.goal.findUniqueOrThrow({
        where: { id: input.goalId },
      });

      const event = await ctx.db.event.create({
        data: {
          goalId: goal.id,
          timestamp: input.timestamp ?? undefined,
        },
      });
      return event;
    }),

  editEvent: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        eventId: z.string(),
        timestamp: z.date().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const goal = await ctx.db.goal.findUniqueOrThrow({
        where: { id: input.goalId },
      });

      const event = await ctx.db.event.create({
        data: { goalId: goal.id, timestamp: input.timestamp ?? undefined },
      });
      return event;
    }),
});
