CREATE TABLE "DoNotPickList2025" (
	"Event_Id" varchar(20) NOT NULL,
	"Team_Number" smallint NOT NULL,
	"Reason" varchar NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "PickList2025" (
	"Event_Id" varchar(20) NOT NULL,
	"Team_Number" smallint NOT NULL,
	"Pick_Index" smallint NOT NULL,
	"Alliance_Selected" boolean DEFAULT false NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
ALTER TABLE "DoNotPickList2025" ADD CONSTRAINT "DoNotPickList2025_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PickList2025" ADD CONSTRAINT "PickList2025_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_donotpicklist2025" ON "DoNotPickList2025" USING btree ("Event_Id","Team_Number");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_picklist2025" ON "PickList2025" USING btree ("Event_Id","Team_Number");