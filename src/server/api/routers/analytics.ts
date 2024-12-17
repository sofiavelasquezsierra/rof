import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { clubs, studentClubs, students } from "~/server/db/schema"; 
import { auth, clerkClient } from "@clerk/nextjs/server";

export const analyticsRouter = createTRPCRouter({
  getUserClubAnalytics: publicProcedure
    .input(z.object({}).optional()) 
    .query(async ({ ctx }) => {
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

      const userClubs = await ctx.db
        .select()
        .from(clubs)
        .where(eq(clubs.adminEmail, userEmail));

      return {
        message: userClubs.length
          ? "User club analytics fetched successfully."
          : "No clubs found for this user.",
        clubData: userClubs,
      };
    }),

  getAggregatedAnalytics: publicProcedure
  .input(z.object({}).optional()) 
  .query(async ({ ctx }) => {
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

    const yearCounts = studentsInClub.reduce((acc: { [key: string]: number }, student) => {
      acc[student.year] = (acc[student.year] || 0) + 1;
      return acc;
    }, {});

    return {
      club: {
      clubId: adminClub[0]!.clubId,
      clubName: adminClub[0]!.clubName,
      },
      totalStudents: studentsInClub.length,
      yearCounts: {
      U0: yearCounts["U0"] || 0,
      U1: yearCounts["U1"] || 0,
      U2: yearCounts["U2"] || 0,
      U3: yearCounts["U3"] || 0,
      "U3+": yearCounts["U3+"] || 0,
      },
    };
  }),
});
