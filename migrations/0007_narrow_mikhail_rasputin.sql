CREATE TABLE "rof_club_event" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" varchar(255) NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"club_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rof_club_event" ADD CONSTRAINT "rof_club_event_club_id_rof_club_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."rof_club"("club_id") ON DELETE cascade ON UPDATE no action;