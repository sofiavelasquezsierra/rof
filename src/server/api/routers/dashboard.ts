import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { clubs, studentClubs, students } from "~/server/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";

  
  export const dashboardRouter = createTRPCRouter({
    clubDashboard: publicProcedure
    .input(z.object({}).optional()) // Ensure it's optional or an empty object is sent
    .query(async ({ ctx }) => {
      // Use Clerk's auth to get the user ID
      const authResult = await auth();
      const { userId } = authResult;

      if (!userId) {
        throw new Error("Authentication required");
      }

      const clerkClientInstance = await clerkClient();
      const user = await clerkClientInstance.users.getUser(userId);
      const userEmail = user?.emailAddresses[0]?.emailAddress;

      if (!userEmail) {
        throw new Error("User email not found.");
      }

  
      // Fetch the admin's club
      const adminClub = await ctx.db
        .select({
          clubId: clubs.clubId,
          clubName: clubs.clubName,
        })
        .from(clubs)
        .where(eq(clubs.adminEmail, userEmail))
        .limit(1);
  
      if (adminClub.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No club found associated with your account" });
      }
  
      const clubId = adminClub[0]!.clubId;
  
      // Fetch students in the club
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
  
      return {
        club: {
          clubId: adminClub[0]!.clubId,
          clubName: adminClub[0]!.clubName,
        },
        students: studentsInClub,
      };
    }),
  });
  