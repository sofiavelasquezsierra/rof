import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { clubsRouter } from "./clubs";
import { analyticsRouter } from "./analytics"
import { dashboardRouter } from "./dashboard"
import { studentsRouter } from "./students"
import { clubs, students } from "~/server/db/schema";
import { register } from "module";
import { eventRouter } from "./scheduler";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  clubs: clubsRouter,
  analytics: analyticsRouter,
  dashboard: dashboardRouter,
  students: studentsRouter,
  scheduler: eventRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
