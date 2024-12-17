// Sofia Velasquez-Sierra and Saiyid Kazmi
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clubs, studentClubs, students } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const studentsRouter = createTRPCRouter({

    registerStudent: publicProcedure

    .input(z.object({ 
        fname: z.string().min(1, "First name is required"), 
        lname: z.string().min(1, "Last name is required"),
        studentId: z.string().min(1, "Student ID is required"),
        year: z.string().min(1, "Year is required"),
        role: z.string().min(1, "Role is required"),
        email: z.string().email().min(1, "Email is required"),
        })
    )

    .mutation(async ({ ctx, input }) => {
        const authResult = await auth();
        const { userId } = authResult; // get the user ID
  
        if (!userId) {
          throw new Error("Authentication required");
        }

        let adminEmail = "";
        if (userId) {
          const clerkClientInstance = await clerkClient();
          const user = await clerkClientInstance.users.getUser(userId); // get the email address
          adminEmail = user?.emailAddresses[0]?.emailAddress || "";
  
          if (!adminEmail) {
            throw new Error("User email not found");
          }

        const adminClub = await ctx.db
        .select()
        .from(clubs)
        .where(eq(clubs.adminEmail, adminEmail))
        .limit(1);

        if (adminClub.length === 0) {
        throw new Error("No club found associated with your account.");
        }
        const clubId = adminClub[0]?.clubId; // Retrieve the clubId of the admin's club

        // Check if the student already exists
        const existingStudent = await ctx.db
            .select()
            .from(students)
            .where(eq(students.student_id, input.studentId))
            .limit(1);

        if (existingStudent.length > 0) {
            throw new Error("A student with this ID is already registered.");
        }
        await ctx.db.insert(students).values({
            student_id: input.studentId,
            fname: input.fname,
            email: input.email,
            lname: input.lname,
            year: input.year,
            role: input.role,
        });

        // Associate the student with the admin's club in the studentClubs table
        await ctx.db.insert(studentClubs).values({
            studentId: input.studentId,
            clubId: clubId || "",
        });
        return { success: true, message: "Student registered successfully!" };
        }
  }),


  // Verify Student
  verifyStudent: publicProcedure
  .input(
    z.object({
      studentId: z.string().nonempty(),
      email: z.string().email(),
      verificationCode: z.string().length(6), // Example static code for demo purposes
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { studentId, email, verificationCode } = input;

    // Placeholder: Check if the verification code is correct
    if (verificationCode !== "123456") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid verification code.",
      });
    }

    // Update the `emailVerified` timestamp
    const result = await ctx.db
      .update(students)
      .set({ emailVerified: new Date() })
      .where(
        and(
          eq(students.student_id, studentId),
          eq(students.email, email),
          isNull(students.emailVerified) // Ensure the student is not already verified
        )
      );

    if (result.rowCount === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Student not found or already verified.",
      });
    }

    return { success: true, message: "Student successfully verified." };
  }),


  //Get Student's Club
  getStudentClub: publicProcedure
  .input(
    z.object({
      studentId: z.string().nonempty(),
      email: z.string().email(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { studentId, email } = input;

    const student = await ctx.db
      .select({
        clubName: clubs.clubName,
      })
      .from(studentClubs)
      .innerJoin(clubs, eq(studentClubs.clubId, clubs.clubId))
      .innerJoin(students, eq(studentClubs.studentId, students.student_id))
      .where(
        and(
          eq(students.student_id, studentId),
          eq(students.email, email),
          isNull(students.emailVerified) // Ensure not verified yet
        )
      )
      .limit(1);

    // Safely handle the case where no rows are found
    if (!student || student.length === 0 || !student[0]?.clubName) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No club found for this student or the student is already verified.",
      });
    }

    return { clubName: student[0].clubName };
  }),



  //Confirm students membership
  confirmStudentMembership: publicProcedure
  .input(
    z.object({
      studentId: z.string().nonempty(),
      email: z.string().email(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { studentId, email } = input;

    const result = await ctx.db
      .update(students)
      .set({ emailVerified: new Date() })
      .where(
        and(
          eq(students.student_id, studentId),
          eq(students.email, email),
          isNull(students.emailVerified)
        )
      );

    if (result.rowCount === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Student not found or already verified.",
      });
    }

    return { success: true, message: "Membership confirmed successfully." };
  }),

});
