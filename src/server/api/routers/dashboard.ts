// Sofia Velasquez-Sierra
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";
import { clubs, studentClubs, students } from "~/server/db/schema";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";

  
  export const dashboardRouter = createTRPCRouter({
    
    //Fetch Students in Club
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
          emailVerified: students.emailVerified,
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


    //Delete Students from a Club
    deleteStudent: publicProcedure
    .input(
      z.object({
        studentId: z.string().nonempty("Student ID is required"),
        clubId: z.string().nonempty("Club ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { studentId, clubId } = input;

      // Check if the student is part of the specified club
      const studentInClub = await ctx.db
        .select()
        .from(studentClubs)
        .where(
          and(
            eq(studentClubs.studentId, studentId),
            eq(studentClubs.clubId, clubId)
          )
        )
        .limit(1);

      if (studentInClub.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student is not part of the specified club",
        });
      }

      // Remove the student from the club
      await ctx.db
        .delete(studentClubs)
        .where(
          and(
            eq(studentClubs.studentId, studentId),
            eq(studentClubs.clubId, clubId)
          )
        );

      return { success: true, message: "Student removed successfully" };
    }),

    //Resend verification email
  resendVerificationEmail: publicProcedure
  .input(
    z.object({
      studentId: z.string().nonempty(),
      email: z.string().email(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { studentId, email } = input;

    // Validate if the student exists and is not yet verified
    const student = await ctx.db
      .select()
      .from(students)
      .where(
        and(eq(students.student_id, studentId), eq(students.email, email), isNull(students.emailVerified))
      )
      .limit(1);

    if (!student.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Student not found or already verified.",
      });
    }

    // Simulate sending email (integrate real email service here)
    console.log(`Verification email resent to ${email}.`);

    return { success: true, message: "Verification email resent successfully." };
  }),

  });
  