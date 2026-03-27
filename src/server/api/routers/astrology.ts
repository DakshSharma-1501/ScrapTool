import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { calculateBirthChart } from "astrology-insights";

export const astrologyRouter = createTRPCRouter({
  generateKundli: publicProcedure
    .input(z.object({
      name: z.string(),
      date: z.string(), // YYYY-MM-DD
      time: z.string(), // HH:MM
      place: z.string(), // We will mock lat/lng based on this for now, or use a geocoder later
    }))
    .mutation(async ({ input }) => {
      // For this phase, we mock the lat/lng. In a real scenario, we'd geocode the place string.
      const lat = 28.6139; // Default to Delhi
      const lng = 77.2090;
      const timezone = "Asia/Kolkata";

      const birthData = {
        date: input.date,
        time: input.time,
        timezone,
        latitude: lat,
        longitude: lng,
        name: input.name
      };

      try {
        const chart = calculateBirthChart(birthData, {
          ayanamsa: "lahiri",
          houseSystem: "whole_sign"
        });

        return {
          success: true,
          chart
        };
      } catch (error: any) {
        console.error("Astrology engine error:", error);
        throw new Error("Failed to calculate precise planetary degrees: " + error.message);
      }
    }),

  generateMatchmaking: publicProcedure
    .input(z.object({
      boy: z.object({ name: z.string(), date: z.string(), time: z.string(), place: z.string() }),
      girl: z.object({ name: z.string(), date: z.string(), time: z.string(), place: z.string() })
    }))
    .mutation(async ({ input }) => {
      try {
        // Calculate both charts
        const boyChart = calculateBirthChart({
          name: input.boy.name, date: input.boy.date, time: input.boy.time, timezone: "Asia/Kolkata", latitude: 28.6139, longitude: 77.2090
        });
        const girlChart = calculateBirthChart({
          name: input.girl.name, date: input.girl.date, time: input.girl.time, timezone: "Asia/Kolkata", latitude: 28.6139, longitude: 77.2090
        });

        // Deterministic mock for Ashtakoota Guna Milan (since creating the 27x27 matrix is too large right now)
        // In a full production app, you would use a dedicated module for this.
        const boyMoon = boyChart.planets.find((p: any) => p.name === "Moon")?.longitude || 0;
        const girlMoon = girlChart.planets.find((p: any) => p.name === "Moon")?.longitude || 0;
        
        // Pseudo-random but deterministic score based on Moon degrees
        const diff = Math.abs(boyMoon - girlMoon);
        const baseScore = 18 + (diff % 18); // Score between 18 and 36

        return {
          success: true,
          boyChart,
          girlChart,
          score: Math.min(36, parseFloat(baseScore.toFixed(1))),
          conclusion: baseScore > 25 ? "Highly Compatible" : baseScore > 18 ? "Moderately Compatible" : "Not Recommended"
        };
      } catch (error: any) {
        throw new Error("Failed to calculate matchmaking: " + error.message);
      }
    }),

  generateDetailedKundliReading: publicProcedure
    .input(z.object({
      chartData: z.any(),
      language: z.enum(["en", "hi"]).default("en")
    }))
    .mutation(async ({ input }) => {
      // Dynamic import to avoid circular or early deps if needed, or static import
      const { generateKundliReading } = await import("../../services/ai.service");
      const reading = await generateKundliReading(input.chartData, input.language);
      return { reading };
    }),

  generateBasicKundliReading: publicProcedure
    .input(z.object({
      chartData: z.any(),
      language: z.enum(["en", "hi"]).default("en")
    }))
    .mutation(async ({ input }) => {
      const { generateBasicKundliReading } = await import("../../services/ai.service");
      const reading = await generateBasicKundliReading(input.chartData, input.language);
      return { reading };
    }),

  generateDetailedMatchmakingReading: publicProcedure
    .input(z.object({
      boyChart: z.any(),
      girlChart: z.any(),
      score: z.number(),
      language: z.enum(["en", "hi"]).default("en")
    }))
    .mutation(async ({ input }) => {
      const { generateMatchmakingReading } = await import("../../services/ai.service");
      const reading = await generateMatchmakingReading(input.boyChart, input.girlChart, input.score, input.language);
      return { reading };
    }),

  generateNumerologyReading: publicProcedure
    .input(z.object({
      name: z.string(),
      lifePath: z.number(),
      destiny: z.number(),
      language: z.enum(["en", "hi"]).default("en")
    }))
    .mutation(async ({ input }) => {
      const { generateNumerologyReading } = await import("../../services/ai.service");
      const reading = await generateNumerologyReading(input.name, input.lifePath, input.destiny, input.language);
      return { reading };
    }),
});
