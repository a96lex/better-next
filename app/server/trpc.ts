import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError, treeifyError } from "zod";
import prisma from "@/app/lib/prisma";
import { getServerAuthSession } from "@/app/lib/auth";

export const createTRPCContext = async (opts?: { req?: Request }) => {
  const session = await getServerAuthSession();

  return {
    db: prisma,
    headers: opts?.req?.headers,
    session: session,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? treeifyError(error.cause) : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
