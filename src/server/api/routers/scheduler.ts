import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { clubs, clubEvents } from "~/server/db/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const eventRouter = createTRPCRouter({
  // Mutation to create an event
  createEvent: publicProcedure
    .input(
      z.object({
        eventName: z.string().min(1, "Event name is required"),
        eventDate: z.string().datetime(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authResult = await auth();
      const { userId } = authResult;

      if (!userId) {
        throw new Error("Authentication required");
      }

      const clerkClientInstance = await clerkClient();
      const user = await clerkClientInstance.users.getUser(userId);
      const userEmail = user?.emailAddresses[0]?.emailAddress;

      if (!userEmail) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Admin email not found" });
      }

      // Fetch the club associated with the signed-in admin
      const club = await ctx.db.query.clubs.findFirst({
        where: eq(clubs.adminEmail, userEmail),
      });

      if (!club) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No club found for the signed-in admin.",
        });
      }

      // Insert a new event
      await ctx.db.insert(clubEvents).values({
        eventName: input.eventName,
        eventDate: new Date(input.eventDate),
        clubId: club.clubId,
      });

      return { success: true, message: "Event created successfully!" };
    }),

  // Query to fetch events associated with the club
  getClubEvents: publicProcedure.query(async ({ ctx }) => {
    const { userId } = await auth();
  
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not signed in",
      });
    }
  
    // Fetch user email from Clerk
    const clerkClientInstance = await clerkClient();
    const user = await clerkClientInstance.users.getUser(userId);
    const userEmail = user?.emailAddresses[0]?.emailAddress;
  
    if (!userEmail) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Admin email not found",
      });
    }
  
    // Query for the club associated with the admin's email
    const adminClub = await ctx.db
      .select({
        clubId: clubs.clubId,
        clubName: clubs.clubName,
      })
      .from(clubs)
      .where(eq(clubs.adminEmail, userEmail));
  
    if (!adminClub.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No club found for the signed-in admin.",
      });
    }
  
    const clubId = adminClub[0]!.clubId;
  
    // Query for events associated with the club
    const clubEventsData = await ctx.db
      .select({
        eventId: clubEvents.eventId,
        eventName: clubEvents.eventName,
        eventDate: clubEvents.eventDate,
        clubId: clubEvents.clubId,
      })
      .from(clubEvents)
      .where(eq(clubEvents.clubId, clubId));
  
    return {
      club: {
        clubId: adminClub[0]!.clubId,
        clubName: adminClub[0]!.clubName,
      },
      events: clubEventsData,
    };
}),
});
