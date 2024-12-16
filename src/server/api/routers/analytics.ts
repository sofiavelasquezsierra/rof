import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clubs, studentClubs, students } from "~/server/db/schema"; // Include studentClubs and students
import { auth, clerkClient } from "@clerk/nextjs/server";

export const analyticsRouter = createTRPCRouter({
  getUserClubAnalytics: publicProcedure
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

  getAggregatedAnalytics: publicProcedure.query(async ({ ctx }) => {
    // Use Clerk's auth to get the user ID
    const authResult = await auth();
    const { userId } = authResult;

    if (!userId) {
      throw new Error("Authentication required.");
    }

    // Aggregated club data for admin users, with the number of students in each club
    const clubStats = await ctx.db
      .select({
        adminEmail: clubs.adminEmail,
        clubId: clubs.clubId,
        clubName: clubs.clubName, // Assuming there is a clubName field
      })
      .from(clubs)
      .leftJoin(studentClubs, eq(studentClubs.clubId, clubs.clubId)) // Join studentClubs
      .leftJoin(students, eq(studentClubs.studentId, students.student_id)) // Correct join condition using `student_id` and `studentId`
      .groupBy(clubs.adminEmail, clubs.clubId, clubs.clubName); // Group by clubId and adminEmail

    // Now, let's count the number of students per club using `$count`
    const studentCounts = await ctx.db
      .select({
        clubId: studentClubs.clubId,
        studentCount: ctx.db.$count(studentClubs.studentId).as("studentCount"), // Correct usage of $count
      })
      .from(studentClubs)
      .groupBy(studentClubs.clubId);

    // Merge the clubStats and studentCounts
    const statsWithStudentCount = clubStats.map((club) => {
      const studentCount =
        studentCounts.find((count) => count.clubId === club.clubId)
          ?.studentCount || 0;

      return {
        ...club,
        studentCount,
      };
    });

    return {
      message: "Aggregated analytics fetched successfully.",
      stats: statsWithStudentCount,
    };
  }),
});
