import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clubs, studentClubs, students } from "~/server/db/schema";

export const studentsRouter = createTRPCRouter({

    registerStudent: publicProcedure

    .input(z.object({ 
        fname: z.string().min(1, "First name is required"), 
        lname: z.string().min(1, "Last name is required"),
        studentId: z.string().min(1, "Student ID is required"),
        year: z.string().min(1, "Year is required"),
        role: z.string().min(1, "Role is required"),
        })
    )

    .mutation(async ({ ctx, input }) => {
        const authResult = await auth();
        const { userId } = authResult; // get the user ID
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
            email: "",
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
});
