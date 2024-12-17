import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clubs } from "~/server/db/schema";

export const eventRouter = createTRPCRouter({
  getUserClub: publicProcedure.query(async ({ ctx }) => {
    const authResult = await auth();
    const { userId } = authResult;

    if (!userId) {
      throw new Error("Authentication required.");
    }

    const clerkClientInstance = await clerkClient();
    const user = await clerkClientInstance.users.getUser(userId);
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      throw new Error("User email not found.");
    }

    const userClub = await ctx.db
      .select({
        clubName: clubs.clubName,
      })
      .from(clubs)
      .where(eq(clubs.adminEmail, userEmail))
      .limit(1);

    if (!userClub.length) {
      throw new Error("No club associated with this user.");
    }

    return { clubName: userClub[0]?.clubName };
  }),
});
