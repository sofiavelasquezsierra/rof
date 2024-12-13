ALTER TABLE "rof_student_clubs" RENAME COLUMN "id" TO "student_id";--> statement-breakpoint
ALTER TABLE "rof_student" RENAME COLUMN "id" TO "student_id";--> statement-breakpoint
ALTER TABLE "rof_student_clubs" DROP CONSTRAINT "rof_student_clubs_id_club_id_pk";--> statement-breakpoint
ALTER TABLE "rof_student_clubs" ADD CONSTRAINT "rof_student_clubs_student_id_club_id_pk" PRIMARY KEY("student_id","club_id");--> statement-breakpoint
ALTER TABLE "rof_club" ADD COLUMN "admin_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "rof_student" ADD COLUMN "role" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "rof_student" ADD COLUMN "year" varchar(255) NOT NULL;