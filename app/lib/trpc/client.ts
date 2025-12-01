import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/app/server/root";

export const api = createTRPCReact<AppRouter>();
