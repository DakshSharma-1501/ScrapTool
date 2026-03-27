import { z } from "zod";
import { createTRPCRouter, rateLimitedProcedure } from "../trpc";
import { scrapeUrl } from "../../services/scraper.service";
import { cleanHtml } from "../../utils/htmlCleaner";
import { detectPageType } from "../../utils/typeDetector";
import { extractStructuredData } from "../../services/ai.service";
import { TRPCError } from "@trpc/server";

// In-memory cache
const cache = new Map<string, any>();

export const scraperRouter = createTRPCRouter({
  scrapeUrl: rateLimitedProcedure
    .input(z.object({ url: z.string().url("Invalid URL format") }))
    .mutation(async ({ input }) => {
      try {
        if (cache.has(input.url)) {
          return { success: true, fromCache: true, data: cache.get(input.url) };
        }

        console.log(`Scraping: ${input.url}`);

        // Layer 1 & 2 & 3
        const scraped = await scrapeUrl(input.url, 15000);
        
        // Clean
        const cleaned = cleanHtml(scraped.html);
        
        // Detect Type
        const pageType = detectPageType(scraped.html, input.url);
        
        // Extract Data via AI
        const structuredData = await extractStructuredData(cleaned, pageType);

        const result = {
          ...structuredData,
          _meta: {
            detectedType: pageType,
            scrapedAt: new Date().toISOString()
          }
        };

        cache.set(input.url, result);

        return { success: true, fromCache: false, data: result };
      } catch (error) {
        console.error("Scrape Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to scrape URL",
        });
      }
    }),
});
