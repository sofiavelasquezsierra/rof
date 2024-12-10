CREATE TABLE "rof_club" (
	"club_id" varchar(255) PRIMARY KEY NOT NULL,
	"club_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_clubs" (
	"id" varchar NOT NULL,
	"club_id" varchar NOT NULL,
	CONSTRAINT "student_clubs_id_club_id_pk" PRIMARY KEY("id","club_id")
);
--> statement-breakpoint
CREATE TABLE "rof_student" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"fname" varchar(255) NOT NULL,
	"lname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
