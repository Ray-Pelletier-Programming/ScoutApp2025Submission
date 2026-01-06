CREATE TABLE "EventMatchTeams" (
	"Event_Match_Id" varchar(30) NOT NULL,
	"Alliance_Color" varchar(5) NOT NULL,
	"Alliance_Position" smallint NOT NULL,
	"Team_Number" smallint NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "EventMatches" (
	"Event_Match_Id" varchar(30) PRIMARY KEY NOT NULL,
	"Event_Id" varchar(20) NOT NULL,
	"Match_Type" varchar(15) NOT NULL,
	"Match_Number" smallint NOT NULL,
	"Scheduled_Start_Time" timestamp,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "Events" (
	"Event_Id" varchar(20) PRIMARY KEY NOT NULL,
	"Season" smallint NOT NULL,
	"Event_Code" varchar(12) NOT NULL,
	"Event_Name" varchar(150) NOT NULL,
	"Event_Type" varchar(100) NOT NULL,
	"District_Code" varchar(10),
	"Division_Code" varchar(10),
	"Date_Start" timestamp NOT NULL,
	"Date_End" timestamp NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "Leader2024Data" (
	"Event_Id" varchar(20) NOT NULL,
	"Match_Type" varchar(15) NOT NULL,
	"Match_Number" smallint NOT NULL,
	"Source" varchar(10),
	"Team_Number" smallint NOT NULL,
	"Scout_Name" varchar(40) NOT NULL,
	"Alliance_Color" varchar(5) NOT NULL,
	"Auto_Time" varchar(20),
	"Driver_Ability" integer,
	"Source_Time" integer,
	"Amp_Time" integer,
	"Break" varchar(20) NOT NULL,
	"Class" varchar(20) NOT NULL,
	"Other_Notes" varchar(500),
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "Leader2025Data" (
	"Event_Id" varchar(20) NOT NULL,
	"Match_Type" varchar(15) NOT NULL,
	"Match_Number" smallint NOT NULL,
	"Source" varchar(10),
	"Team_Number" smallint NOT NULL,
	"Scout_Name" varchar(40) NOT NULL,
	"Alliance_Color" varchar(5) NOT NULL,
	"Alliance_Position" smallint NOT NULL,
	"Driver_Ability" integer,
	"Source_Time" integer,
	"Break" varchar(20) NOT NULL,
	"Primary_Role" varchar(7),
	"Net_Shots_Made" smallint NOT NULL,
	"Net_Shots_Missed" smallint NOT NULL,
	"Other_Notes" varchar(500),
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "Match2024Data" (
	"Event_Id" varchar(20) NOT NULL,
	"Match_Type" varchar(15) NOT NULL,
	"Match_Number" smallint NOT NULL,
	"Source" varchar(10),
	"Team_Number" smallint NOT NULL,
	"Scout_Name" varchar(40) NOT NULL,
	"Alliance_Color" varchar(5) NOT NULL,
	"Robot_Leave" integer NOT NULL,
	"Auto_Start_Loc" varchar(15) NOT NULL,
	"Auto_Notes_Intook_1" varchar(2),
	"Auto_Notes_Intook_2" varchar(2),
	"Auto_Notes_Intook_3" varchar(2),
	"Auto_Notes_Intook_4" varchar(2),
	"Auto_Notes_Intook_5" varchar(2),
	"Auto_Notes_Intook_6" varchar(2),
	"Auto_Notes_Intook_7" varchar(2),
	"Auto_Notes_Intook_8" varchar(2),
	"Auto_Notes_Intook_9" varchar(2),
	"Auto_Amp_Scored" integer NOT NULL,
	"Auto_Speaker_Scored" integer NOT NULL,
	"Auto_Amp_Missed" integer NOT NULL,
	"Auto_Speaker_Missed" integer NOT NULL,
	"Tele_Amp_Scored" integer NOT NULL,
	"Tele_Speaker_Scored" integer NOT NULL,
	"Tele_Amp_Missed" integer NOT NULL,
	"Tele_Speaker_Missed" integer NOT NULL,
	"Climb_State" varchar(25) NOT NULL,
	"Ferry" integer,
	"Trap" integer NOT NULL,
	"Harmony" integer NOT NULL,
	"Bet_Color" varchar(5) NOT NULL,
	"Bet_Amount" integer NOT NULL,
	"Over_Under" varchar(5) NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "Match2025Data" (
	"Event_Id" varchar(20) NOT NULL,
	"Match_Type" varchar(15) NOT NULL,
	"Match_Number" smallint NOT NULL,
	"Source" varchar(10),
	"Team_Number" smallint NOT NULL,
	"Scout_Name" varchar(40) NOT NULL,
	"Alliance_Color" varchar(5) NOT NULL,
	"Alliance_Position" smallint NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "Pit2024Data" (
	"Event_Id" varchar(20) NOT NULL,
	"Source" varchar(10),
	"Team_Number" smallint NOT NULL,
	"Scout_Name" varchar(40) NOT NULL,
	"Drive_Train" varchar(10) NOT NULL,
	"Robot_Width" numeric(10, 3) NOT NULL,
	"Robot_Length" numeric(10, 3) NOT NULL,
	"Robot_Height" numeric(10, 3) NOT NULL,
	"Human_Player" varchar(10) NOT NULL,
	"Can_Leave" integer NOT NULL,
	"Can_Auto_Amp" integer NOT NULL,
	"Can_Auto_Speaker" integer NOT NULL,
	"Contest_Middle" integer NOT NULL,
	"Max_Notes_Auto" integer NOT NULL,
	"Intake_Location" varchar(10) NOT NULL,
	"Scoring_Pref" varchar(100) NOT NULL,
	"Can_Tele_Amp" integer NOT NULL,
	"Can_Tele_Speaker" integer NOT NULL,
	"Climb_Location" varchar(10) NOT NULL,
	"Climb_Height" numeric(10, 3) NOT NULL,
	"Can_Trap" varchar(20) NOT NULL,
	"Notable_Feat" varchar(500) NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "Pit2025Data" (
	"Event_Id" varchar(20) NOT NULL,
	"Source" varchar(10),
	"Team_Number" smallint NOT NULL,
	"Scout_Name" varchar(40) NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "Seasons" (
	"Season" smallint PRIMARY KEY NOT NULL,
	"Season_Name" varchar(200) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "EventMatchTeams" ADD CONSTRAINT "EventMatchTeams_Event_Match_Id_EventMatches_Event_Match_Id_fk" FOREIGN KEY ("Event_Match_Id") REFERENCES "public"."EventMatches"("Event_Match_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EventMatches" ADD CONSTRAINT "EventMatches_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Events" ADD CONSTRAINT "Events_Season_Seasons_Season_fk" FOREIGN KEY ("Season") REFERENCES "public"."Seasons"("Season") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Leader2024Data" ADD CONSTRAINT "Leader2024Data_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Leader2025Data" ADD CONSTRAINT "Leader2025Data_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Match2024Data" ADD CONSTRAINT "Match2024Data_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD CONSTRAINT "Match2025Data_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Pit2024Data" ADD CONSTRAINT "Pit2024Data_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD CONSTRAINT "Pit2025Data_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_eventMatchTeam" ON "EventMatchTeams" USING btree ("Event_Match_Id","Alliance_Color","Alliance_Position");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_eventMatch" ON "EventMatches" USING btree ("Event_Id","Match_Type","Match_Number");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_event" ON "Events" USING btree ("Event_Code","Season");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_leader2024Data" ON "Leader2024Data" USING btree ("Event_Id","Match_Type","Match_Number","Source","Team_Number","Scout_Name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_leader2025Data" ON "Leader2025Data" USING btree ("Event_Id","Match_Type","Match_Number","Source","Team_Number","Scout_Name","Alliance_Color","Alliance_Position");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_match2024Data" ON "Match2024Data" USING btree ("Event_Id","Match_Type","Match_Number","Source","Team_Number","Scout_Name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_match2025Data" ON "Match2025Data" USING btree ("Event_Id","Match_Type","Match_Number","Source","Team_Number","Scout_Name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_pit2024Data" ON "Pit2024Data" USING btree ("Event_Id","Source","Team_Number","Scout_Name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_pit2025Data" ON "Pit2025Data" USING btree ("Event_Id","Source","Team_Number","Scout_Name");