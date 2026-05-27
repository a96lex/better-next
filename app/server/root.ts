import { createCallerFactory, createTRPCRouter } from "./trpc";
import { goalRouter } from "./routers/goal";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  goal: goalRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
