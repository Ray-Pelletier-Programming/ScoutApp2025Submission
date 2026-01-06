CREATE TABLE "EventMatches2025TbaResult" (
	"Event_Match_Id" varchar(30) NOT NULL,
	"videoKey" varchar(20),
	"videoType" varchar(50),
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
ALTER TABLE "EventMatches2025TbaResult" ADD CONSTRAINT "EventMatches2025TbaResult_Event_Match_Id_EventMatches_Event_Match_Id_fk" FOREIGN KEY ("Event_Match_Id") REFERENCES "public"."EventMatches"("Event_Match_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_eventmatches2025tbaresult" ON "EventMatches2025TbaResult" USING btree ("Event_Match_Id");