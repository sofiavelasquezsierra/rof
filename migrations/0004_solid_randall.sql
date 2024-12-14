ALTER TABLE "rof_student_clubs" RENAME COLUMN "student_id" TO "id";--> statement-breakpoint
ALTER TABLE "rof_student_clubs" DROP CONSTRAINT "rof_student_clubs_student_id_club_id_pk";--> statement-breakpoint
ALTER TABLE "rof_student_clubs" ADD CONSTRAINT "rof_student_clubs_id_club_id_pk" PRIMARY KEY("id","club_id");--> statement-breakpoint
ALTER TABLE "rof_club" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "rof_club" DROP COLUMN "admin_email";--> statement-breakpoint
ALTER TABLE "rof_student_clubs" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "rof_student" DROP COLUMN "year";--> statement-breakpoint
ALTER TABLE "rof_student" DROP COLUMN "role";