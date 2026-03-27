import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Simple in-memory rate limiting context
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export const rateLimitedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const ip = ctx.headers.get('x-forwarded-for') || ctx.headers.get('user-agent') || 'unknown';
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > 60000) {
    userData.count = 0;
    userData.lastReset = now;
  }
  userData.count += 1;
  rateLimitMap.set(ip, userData);

  if (userData.count > 10) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Rate limit exceeded (10 per min)." });
  }

  return next();
});
