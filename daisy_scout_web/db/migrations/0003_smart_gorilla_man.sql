CREATE TABLE "EventTeams" (
	"Event_Id" varchar(20) NOT NULL,
	"Team_Number" smallint NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
ALTER TABLE "EventTeams" ADD CONSTRAINT "EventTeams_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_eventteam" ON "EventTeams" USING btree ("Event_Id","Team_Number");