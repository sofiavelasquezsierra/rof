import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";

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
      }
      await ctx.db.insert(clubs).values({
        clubId: crypto.randomUUID(),
        clubName: input.clubName,
        adminEmail: userEmail,
      });
    }),
});
