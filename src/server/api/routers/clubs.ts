import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clubs, studentClubs, students } from "~/server/db/schema";

export const clubsRouter = createTRPCRouter({
  
  //Create a club
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
/*
  //Club Dashboard 
  clubDashboard: protectedProcedure
    .query(async ({ctx}) => {
      const authResult = await auth();
      const { userId } = authResult; // get the user ID
      let adminEmail = "";
      if (userId) {
        const clerkClientInstance = await clerkClient();
        const user = await clerkClientInstance.users.getUser(userId); // get the email address
        adminEmail = user?.emailAddresses[0]?.emailAddress || "";
      }

      if (!adminEmail) {
        throw new Error("User email not found");
      }

      //Fetch the user's club
      const adminClub = await ctx.db
        .select({
          clubId: clubs.clubId,
          clubName: clubs.clubName,
        })
        .from(clubs)
        .where(eq(clubs.adminEmail, adminEmail))
        .limit(1);

      if (adminClub.length == 0) {
        throw new Error("No Club found associated with your account");
      }

      // Use a type guard or non-null assertion
      const clubId = adminClub[0]!.clubId;

      //fetch students associated with this club
      const studentsInClub = await ctx.db
        .select({
          studentId: students.student_id,
          fname: students.fname,
          lname: students.lname,
          email: students.email,
          role: students.role,
          year: students.year,
        })
        .from(students)
        .innerJoin(studentClubs, eq(students.student_id, studentClubs.studentId))
        .where(eq(studentClubs.clubId, clubId));

      // Returns the club details (clubId, clubName) and the list of students as an array.
      return {
        club: {
          clubId: adminClub[0]!.clubId,
          clubName: adminClub[0]!.clubName,
        },
        students: studentsInClub
      };
    }), */
});
