ALTER TABLE "rof_student_clubs" ALTER COLUMN "club_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "rof_student" ALTER COLUMN "email_verified" DROP DEFAULT;