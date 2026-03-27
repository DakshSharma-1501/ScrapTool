import { createTRPCRouter } from "./trpc";
import { astrologyRouter } from "./routers/astrology";

export const appRouter = createTRPCRouter({
  astrology: astrologyRouter,
});

export type AppRouter = typeof appRouter;
