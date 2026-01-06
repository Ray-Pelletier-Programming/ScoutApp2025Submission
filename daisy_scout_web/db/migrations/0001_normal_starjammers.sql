CREATE TABLE "Casino2025Data" (
	"Event_Id" varchar(20) NOT NULL,
	"Match_Type" varchar(15) NOT NULL,
	"Match_Number" smallint NOT NULL,
	"Source" varchar(10),
	"Scout_Name" varchar(40) NOT NULL,
	"Bet_Color" varchar(4),
	"Auto_Color" varchar(4),
	"Winner_Score_Over_Under" varchar(5),
	"Total_Score_Over_Under" varchar(5),
	"Bet_Amount" smallint NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL,
	"Synced_At" timestamp
);
--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Auto_Start_Loc" varchar(14) NOT NULL;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Auto_Reef_L1" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Auto_Reef_L2" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Auto_Reef_L3" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Auto_Reef_L4" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Coral_A" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Coral_B" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Coral_C" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Coral_D" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Coral_E" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Coral_F" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Leave" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Auto_Net" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Auto_Processor" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Teleop_Reef_L1" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Teleop_Reef_L2" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Teleop_Reef_L3" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Teleop_Reef_L4" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Teleop_Processor" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Teleop_Net" smallint;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Endgame" varchar(7) NOT NULL;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Bet_Color" varchar(5);--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Bet_Amount" integer;--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Over_Under" varchar(5);--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Drive_Train" varchar(7) NOT NULL;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Robot_Width" numeric(10, 3) NOT NULL;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Robot_Length" numeric(10, 3) NOT NULL;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Human_Player_Loc" varchar(15);--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Intake_Ground_Algae" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Intake_Reef_Algae" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Intake_Reef_Coral" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Intake_Ground_Coral" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Teleop_L1" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Teleop_L2" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Teleop_L3" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Teleop_L4" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Teleop_Processor" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Teleop_Net" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Auto_L1" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Auto_L2" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Auto_L3" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Auto_L4" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Auto_Processor" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Score_Auto_Net" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Pref_Start_Center" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Pref_Start_Ally_HP" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Pref_Start_Opp_HP" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Auto_Intake_HP_Coral" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Auto_Intake_Ground_Coral" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Auto_Max_Game_Pieces" smallint;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Can_Shallow_Climb" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Can_Deep_Climb" boolean;--> statement-breakpoint
ALTER TABLE "Pit2025Data" ADD COLUMN "Notable_Features" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "Casino2025Data" ADD CONSTRAINT "Casino2025Data_Event_Id_Events_Event_Id_fk" FOREIGN KEY ("Event_Id") REFERENCES "public"."Events"("Event_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_u_casino2025Data" ON "Casino2025Data" USING btree ("Event_Id","Match_Type","Match_Number","Source","Scout_Name");