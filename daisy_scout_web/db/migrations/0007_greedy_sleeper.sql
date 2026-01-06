ALTER TABLE "Leader2025Data" ALTER COLUMN "Primary_Role" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Auto_Color" varchar(5);--> statement-breakpoint
ALTER TABLE "Match2025Data" ADD COLUMN "Winner_Score_Over_Under" varchar(5);