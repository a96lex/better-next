import { z } from "zod";
import { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type UserRouterOutput = inferRouterOutputs<typeof userRouter>;
export type Me = NonNullable<UserRouterOutput["me"]>;

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        image: true,
        isAnonymous: true,
      },
    });
    return user;
  }),

  updateName: protectedProcedure
    .input(z.object({ name: z.string().trim().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name, displayName: input.name },
        select: {
          id: true,
          name: true,
          displayName: true,
          email: true,
          image: true,
          isAnonymous: true,
        },
      });
      return user;
    }),
});
