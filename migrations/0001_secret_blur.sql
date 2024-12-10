ALTER TABLE "student_clubs" RENAME TO "rof_student_clubs";--> statement-breakpoint
ALTER TABLE "rof_student_clubs" DROP CONSTRAINT "student_clubs_id_club_id_pk";--> statement-breakpoint
ALTER TABLE "rof_student_clubs" ADD CONSTRAINT "rof_student_clubs_id_club_id_pk" PRIMARY KEY("id","club_id");