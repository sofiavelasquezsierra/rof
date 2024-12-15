import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clubs } from "~/server/db/schema";

export const clubsRouter = createTRPCRouter({
  createClub: publicProcedure
    .input(z.object({ clubName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const authResult = await auth();
      const { userId } = authResult; // get the user ID
      let userEmail = "";
      if (userId) {
        const clerkClientInstance = await clerkClient();
        const user = await clerkClientInstance.users.getUser(userId); // get the email address
        userEmail = user?.emailAddresses[0]?.emailAddress || "";

        if (!userEmail) {
          throw new Error("User email not found");
        }

        const existingClub = await ctx.db
          .select()
          .from(clubs)
          .where(eq(clubs.adminEmail, userEmail))
          .limit(1);

        if (existingClub.length > 0) {
          // Return an error if the user already has a club associated
          throw new Error(
            "You already have a club associated with this email.",
          );
        }
      }
      await ctx.db.insert(clubs).values({
        clubId: crypto.randomUUID(),
        clubName: input.clubName,
        adminEmail: userEmail,
      });
    }),
});
