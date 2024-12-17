import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { events, clubs } from "~/server/db/schema"; // Assuming events table exists
import { auth, clerkClient } from "@clerk/nextjs/server";

export const schedulerRouter = createTRPCRouter({
  // 1. Create a new event
  createEvent: publicProcedure
    .input(
      z.object({
        eventName: z.string(),
        eventDate: z.string(), // ISO date format
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Authenticate user
      const authResult = await auth();
      const { userId } = authResult;

      if (!userId) {
        throw new Error("Authentication required");
      }

      // Fetch user email
      const user = await clerkClient.users.getUser(userId);
      const userEmail = user?.emailAddresses[0]?.emailAddress;

      if (!userEmail) {
        throw new Error("User email not found.");
      }

      // Fetch the club where the user is an admin
      const adminClub = await ctx.db
        .select()
        .from(clubs)
        .where(eq(clubs.adminEmail, userEmail))
        .limit(1);

      if (adminClub.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No club found associated with your account.",
        });
      }

      const clubId = adminClub[0]!.clubId;

      // Insert new event into the events table
      await ctx.db.insert(events).values({
        clubId,
        eventName: input.eventName,
        eventDate: input.eventDate,
        description: input.description,
      });

      return { message: "Event created successfully." };
    }),

  // 2. Fetch all events for the admin's club
  getClubEvents: publicProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      // Authenticate user
      const authResult = await auth();
      const { userId } = authResult;

      if (!userId) {
        throw new Error("Authentication required");
      }

      // Fetch user email
      const user = await clerkClient.users.getUser(userId);
      const userEmail = user?.emailAddresses[0]?.emailAddress;

      if (!userEmail) {
        throw new Error("User email not found.");
      }

      // Fetch the club where the user is an admin
      const adminClub = await ctx.db
        .select()
        .from(clubs)
        .where(eq(clubs.adminEmail, userEmail))
        .limit(1);

      if (adminClub.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No club found associated with your account.",
        });
      }

      const clubId = adminClub[0]!.clubId;

      // Fetch events associated with the club
      const clubEvents = await ctx.db
        .select()
        .from(events)
        .where(eq(events.clubId, clubId));

      return {
        message: clubEvents.length
          ? "Events fetched successfully."
          : "No events found for this club.",
        events: clubEvents,
      };
    }),
});
