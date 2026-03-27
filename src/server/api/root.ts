import { createTRPCRouter } from "./trpc";
import { scraperRouter } from "./routers/scraper";

export const appRouter = createTRPCRouter({
  scraper: scraperRouter,
});

export type AppRouter = typeof appRouter;
