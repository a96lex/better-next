import { createCallerFactory, createTRPCRouter } from "./trpc";
import { goalRouter } from "./routers/goal";

export const appRouter = createTRPCRouter({
  goal: goalRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
