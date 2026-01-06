import { eq, sql, isNull, and } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  SelectPickList2025Data,
  pickList2025Table,
  doNotPickList2025Table,
  eventTeamsTable,
  match2025DataTable,
  leader2025DataTable,
  pit2025DataTable,
  SelectDoNotPick2025Data,
  InsertPickList2025Data,
  EventMatchTeams2025Result,
} from '@/db/schema';
import { PickList2025Data } from '../models/pickList-2025-data';
import { DoNotPickList2025Data } from '../models/do-not-pick-list-2025-data';

export async function getPickList2025(
  eventId: SelectPickList2025Data['eventId']
): Promise<Array<PickList2025Data>> {
  const existingPicklist = db
    .select({
      eventId: pickList2025Table.eventId,
      teamNumber: pickList2025Table.teamNumber,
    })
    .from(pickList2025Table)
    .where(eq(pickList2025Table.eventId, eventId));
  const existingDoNotPicklist = db
    .select({
      eventId: doNotPickList2025Table.eventId,
      teamNumber: doNotPickList2025Table.teamNumber,
    })
    .from(doNotPickList2025Table)
    .where(eq(doNotPickList2025Table.eventId, eventId));

  const existingListTeams = db
    .select({
      eventId: eventTeamsTable.eventId,
      teamNumber: eventTeamsTable.teamNumber,
      pickIndex: sql<number>`999`.as('Pick_Index'),
      allianceSelected: sql<boolean>`false`.as('Alliance_Selected'),
    })
    .from(eventTeamsTable)
    .leftJoin(
      sql<SelectPickList2025Data>`(${existingPicklist} UNION ALL ${existingDoNotPicklist}) as existing`,
      eq(eventTeamsTable.teamNumber, sql`existing."Team_Number"`)
    )
    .where(
      and(
        eq(eventTeamsTable.eventId, eventId),
        isNull(sql`existing."Team_Number"`)
      )
    );

  const loadQuery = db.insert(pickList2025Table).select(
    db
      .select({
        eventId: sql<string>`"existingListTeams"."Event_Id"`.as(
          pickList2025Table.eventId.name
        ),
        teamNumber: sql<string>`"existingListTeams"."Team_Number"`.as(
          pickList2025Table.teamNumber.name
        ),
        pickIndex: sql<string>`"existingListTeams"."Pick_Index"`.as(
          pickList2025Table.pickIndex.name
        ),
        allianceSelected:
          sql<string>`"existingListTeams"."Alliance_Selected"`.as(
            pickList2025Table.allianceSelected.name
          ),
        createdAt: sql<Date>`now()`.as(pickList2025Table.createdAt.name),
        updatedAt: sql<Date>`now()`.as(pickList2025Table.updatedAt.name),
        syncedAt: sql<Date>`null`.as(pickList2025Table.syncedAt.name),
      })
      .from(existingListTeams.as('existingListTeams'))
  );

  await loadQuery;

  //now return the data
  const query = await db
    .select({
      eventId: pickList2025Table.eventId,
      teamNumber: pickList2025Table.teamNumber,
      pickIndex: pickList2025Table.pickIndex,
      allianceSelected: pickList2025Table.allianceSelected,
      rank: sql<number>`ROW_NUMBER() OVER(PARTITION BY "PickList2025"."Event_Id" 
            ORDER by AVG( coalesce("Match2025Data"."Auto_Reef_L1", 0) + 
                          coalesce("Match2025Data"."Auto_Reef_L2", 0) + 
                          coalesce("Match2025Data"."Auto_Reef_L3", 0) + 
                          coalesce("Match2025Data"."Auto_Reef_L4", 0) + 
                          coalesce("Match2025Data"."Teleop_Reef_L1", 0) + 
                          coalesce("Match2025Data"."Teleop_Reef_L2", 0) + 
                          coalesce("Match2025Data"."Teleop_Reef_L3", 0) + 
                          coalesce("Match2025Data"."Teleop_Reef_L4", 0)
                          ) desc, "PickList2025"."Team_Number" asc) as "Rank"`,
      autoStart: sql<string>`concat(
        Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Alliance Barge' then 1 else 0 END), 1), ' / ',
        Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Center' then 1 else 0 END), 1), ' / ',
        Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Opponent Barge' then 1 else 0 END), 1), ' / ',
        Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'No Show' then 1 else 0 END), 1)
        ) as "autoStart"`,
      autoStartLocAlliance: sql<number>`Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Alliance Barge' then 1 else 0 END), 1) as "autoStartLocAlliance"`,
      autoStartLocCenter: sql<number>`Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Center' then 1 else 0 END), 1) as "autoStartLocCenter"`,
      autoStartLocOpposing: sql<number>`Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Opponent Barge' then 1 else 0 END), 1) as "autoStartLocOpposing"`,
      autoStartLocNoShow: sql<number>`Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'No Show' then 1 else 0 END), 1) as "autoStartLocNoShow"`,
      autoCoral: sql<number>`round(avg("Match2025Data"."Auto_Reef_L1"+"Match2025Data"."Auto_Reef_L2"+"Match2025Data"."Auto_Reef_L3"+"Match2025Data"."Auto_Reef_L4"), 1) as "autoCoral"`,
      autoReefL1: sql<number>`round(avg("Match2025Data"."Auto_Reef_L1"), 1) as "autoReefL1"`,
      autoReefL2: sql<number>`round(avg("Match2025Data"."Auto_Reef_L2"), 1) as "autoReefL2"`,
      autoReefL3: sql<number>`round(avg("Match2025Data"."Auto_Reef_L3"), 1) as "autoReefL3"`,
      autoReefL4: sql<number>`round(avg("Match2025Data"."Auto_Reef_L4"), 1) as "autoReefL4"`,
      autoLevel: sql<string>`concat(round(avg("Match2025Data"."Auto_Reef_L1"), 1), ' / ', round(avg("Match2025Data"."Auto_Reef_L2"), 1), ' / ', round(avg("Match2025Data"."Auto_Reef_L3"), 1), ' / ', round(avg("Match2025Data"."Auto_Reef_L4"), 1)) as "autoLevel"`,
      coralA: sql<number>`round(avg("Match2025Data"."Coral_A"), 1) as "coralA"`,
      coralB: sql<number>`round(avg("Match2025Data"."Coral_B"), 1) as "coralB"`,
      coralC: sql<number>`round(avg("Match2025Data"."Coral_C"), 1) as "coralC"`,
      coralD: sql<number>`round(avg("Match2025Data"."Coral_D"), 1) as "coralD"`,
      coralE: sql<number>`round(avg("Match2025Data"."Coral_E"), 1) as "coralE"`,
      coralF: sql<number>`round(avg("Match2025Data"."Coral_F"), 1) as "coralF"`,
      autoReef: sql<string>`concat(coalesce(round(avg("Match2025Data"."Coral_A"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_B"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_C"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_D"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_E"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_F"), 1), 0.0)) as "autoReef"`,
      leave: sql<number>`Round(avg(CASE COALESCE("EventMatchTeams2025Result"."Leave", "Match2025Data"."Leave") WHEN 'Yes' then 1 else 0 END), 1) as "leave"`,
      autoNet: sql<number>`round(avg("Match2025Data"."Auto_Net"), 1) as "autoNet"`,
      autoProcessor: sql<number>`round(avg("Match2025Data"."Auto_Processor"), 1) as "autoProcessor"`,
      teleopCoral: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L1"+"Match2025Data"."Teleop_Reef_L2"+"Match2025Data"."Teleop_Reef_L3"+"Match2025Data"."Teleop_Reef_L4"), 1) as "teleopCoral"`,
      teleopReefL1: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L1"), 1) as "teleopReefL1"`,
      teleopReefL2: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L2"), 1) as "teleopReefL2"`,
      teleopReefL3: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L3"), 1) as "teleopReefL3"`,
      teleopReefL4: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L4"), 1) as "teleopReefL4"`,
      teleopLevel: sql<string>`concat(round(avg("Match2025Data"."Teleop_Reef_L1"), 1), ' / ', round(avg("Match2025Data"."Teleop_Reef_L2"), 1), ' / ', round(avg("Match2025Data"."Teleop_Reef_L3"), 1), ' / ', round(avg("Match2025Data"."Teleop_Reef_L4"), 1)) as "teleopLevel"`,
      teleopProcessor: sql<number>`round(avg("Match2025Data"."Teleop_Processor"), 1) as "teleopProcessor"`,
      teleopNet: sql<number>`round(avg("Match2025Data"."Teleop_Net"), 1) as "teleopNet"`,
      teleopAlgaeRemoved: sql<number>`round(avg("Match2025Data"."Teleop_Algae_Removed"), 1) as "teleopAlgaeRemoved"`,
      endgamePark: sql<number>`Round(avg(CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Park' then 1 else 0 END), 1)`.as('endgamePark'),
      endgameShallow: sql<number>`Round(avg(CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Shallow' then 1 else 0 END), 1)`.as('endgameShallow'),
      endgameDeep: sql<number>`Round(avg(CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Deep' then 1 else 0 END), 1)`.as('endgameDeep'),
      endgameNone: sql<number>`Round(avg(CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'None' then 1 else 0 END), 1)`.as('endgameNone'),
      endgame: sql<string>`concat(Round(avg(CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Deep' then 1 else 0 END), 1), ' / ', Round(avg(CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Shallow' then 1 else 0 END), 1), ' / ', Round(avg(CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Park' then 1 else 0 END), 1), ' / ', Round(avg(CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'None' then 1 else 0 END), 1)) as "endgame"`,
      driverAbility: sql<number>`Round(avg("Leader2025Data"."Driver_Ability"), 1) as "driverAbility"`,
      operability: sql<string>`concat(Round(avg(CASE "Leader2025Data"."Break" WHEN 'Working' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Leader2025Data"."Break" WHEN 'Broken' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Leader2025Data"."Break" WHEN 'Dead' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Leader2025Data"."Break" WHEN 'No Show' then 1 else 0 END), 1)) as "operability"`,
      role: sql<string>`concat(Round(avg(CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Coral%' then 1 else 0 END), 1), ' / ', Round(avg(CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Algae%' then 1 else 0 END), 1), ' / ', Round(avg(CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Defense%' then 1 else 0 END), 1)) as role`,
      hpNetShots: sql<string>`concat(coalesce(round(avg("Leader2025Data"."Net_Shots_Made"), 1), 0.0), ' / ', coalesce(round(avg("Leader2025Data"."Net_Shots_Missed"), 1), 0.0)) as "hpNetShots"`,
      hpNetMade: sql<number>`round(avg("Leader2025Data"."Net_Shots_Made"), 1) as "hpNet"`,
      driveTrain: pit2025DataTable.driveTrain,
    })
    .from(pickList2025Table)
    .leftJoin(
      match2025DataTable,
      and(
        eq(pickList2025Table.eventId, match2025DataTable.eventId),
        eq(pickList2025Table.teamNumber, match2025DataTable.teamNumber)
      )
    )
    .leftJoin(
      leader2025DataTable,
      and(
        eq(pickList2025Table.eventId, leader2025DataTable.eventId),
        eq(pickList2025Table.teamNumber, leader2025DataTable.teamNumber)
      )
    )
    .leftJoin(
      pit2025DataTable,
      and(
        eq(pickList2025Table.eventId, pit2025DataTable.eventId),
        eq(pickList2025Table.teamNumber, pit2025DataTable.teamNumber)
      )
    )
    .leftJoin(
      EventMatchTeams2025Result,
      and(
        eq(
          sql<string>`concat("Match2025Data"."Event_Id","Match2025Data"."Match_Type", LPAD("Match2025Data"."Match_Number"::text, 3, '0'))`,
          EventMatchTeams2025Result.eventMatchId
        ),
        eq(
          match2025DataTable.allianceColor,
          sql<string>`UPPER("EventMatchTeams2025Result"."Alliance_Color")`
        ),
        eq(
          match2025DataTable.alliancePosition,
          EventMatchTeams2025Result.alliancePosition
        )
      )
    )
    .where(eq(pickList2025Table.eventId, eventId))
    .groupBy(
      pickList2025Table.eventId,
      pickList2025Table.teamNumber,
      pickList2025Table.pickIndex,
      pickList2025Table.allianceSelected,
      pit2025DataTable.driveTrain
    )
    .orderBy(pickList2025Table.pickIndex, sql<number>`"Rank"`);

  return query;
}

export async function getDoNotPickList2025(
  eventId: SelectPickList2025Data['eventId']
): Promise<Array<DoNotPickList2025Data>> {
  //now return the data
  const query = await db
    .select({
      eventId: doNotPickList2025Table.eventId,
      teamNumber: doNotPickList2025Table.teamNumber,
      reason: doNotPickList2025Table.reason,
      autoStart: sql<string>`concat(
        Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Alliance Barge' then 1 else 0 END), 1), ' / ',
        Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Center' then 1 else 0 END), 1), ' / ',
        Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Opponent Barge' then 1 else 0 END), 1), ' / ',
        Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'No Show' then 1 else 0 END), 1)
        ) as "autoStart"`,
      autoStartLocAlliance: sql<number>`Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Alliance Barge' then 1 else 0 END), 1) as "autoStartLocAlliance"`,
      autoStartLocCenter: sql<number>`Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Center' then 1 else 0 END), 1) as "autoStartLocCenter"`,
      autoStartLocOpposing: sql<number>`Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Opponent Barge' then 1 else 0 END), 1) as "autoStartLocOpposing"`,
      autoStartLocNoShow: sql<number>`Round(avg(CASE "Match2025Data"."Auto_Start_Loc" WHEN 'No Show' then 1 else 0 END), 1) as "autoStartLocNoShow"`,
      autoCoral: sql<number>`round(avg("Match2025Data"."Auto_Reef_L1"+"Match2025Data"."Auto_Reef_L2"+"Match2025Data"."Auto_Reef_L3"+"Match2025Data"."Auto_Reef_L4"), 1) as "autoCoral"`,
      autoReefL1: sql<number>`round(avg("Match2025Data"."Auto_Reef_L1"), 1) as "autoReefL1"`,
      autoReefL2: sql<number>`round(avg("Match2025Data"."Auto_Reef_L2"), 1) as "autoReefL2"`,
      autoReefL3: sql<number>`round(avg("Match2025Data"."Auto_Reef_L3"), 1) as "autoReefL3"`,
      autoReefL4: sql<number>`round(avg("Match2025Data"."Auto_Reef_L4"), 1) as "autoReefL4"`,
      autoLevel: sql<string>`concat(round(avg("Match2025Data"."Auto_Reef_L1"), 1), ' / ', round(avg("Match2025Data"."Auto_Reef_L2"), 1), ' / ', round(avg("Match2025Data"."Auto_Reef_L3"), 1), ' / ', round(avg("Match2025Data"."Auto_Reef_L4"), 1)) as "autoLevel"`,
      coralA: sql<number>`round(avg("Match2025Data"."Coral_A"), 1) as "coralA"`,
      coralB: sql<number>`round(avg("Match2025Data"."Coral_B"), 1) as "coralB"`,
      coralC: sql<number>`round(avg("Match2025Data"."Coral_C"), 1) as "coralC"`,
      coralD: sql<number>`round(avg("Match2025Data"."Coral_D"), 1) as "coralD"`,
      coralE: sql<number>`round(avg("Match2025Data"."Coral_E"), 1) as "coralE"`,
      coralF: sql<number>`round(avg("Match2025Data"."Coral_F"), 1) as "coralF"`,
      autoReef: sql<string>`concat(coalesce(round(avg("Match2025Data"."Coral_A"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_B"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_C"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_D"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_E"), 1), 0.0), ' / ', coalesce(round(avg("Match2025Data"."Coral_F"), 1), 0.0)) as "autoReef"`,
      leave: sql<number>`Round(avg(CASE "Match2025Data"."Leave" WHEN 'Yes' then 1 else 0 END), 1) as "leave"`,
      autoNet: sql<number>`round(avg("Match2025Data"."Auto_Net"), 1) as "autoNet"`,
      autoProcessor: sql<number>`round(avg("Match2025Data"."Auto_Processor"), 1) as "autoProcessor"`,
      teleopCoral: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L1"+"Match2025Data"."Teleop_Reef_L2"+"Match2025Data"."Teleop_Reef_L3"+"Match2025Data"."Teleop_Reef_L4"), 1) as "teleopCoral"`,
      teleopReefL1: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L1"), 1) as "teleopReefL1"`,
      teleopReefL2: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L2"), 1) as "teleopReefL2"`,
      teleopReefL3: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L3"), 1) as "teleopReefL3"`,
      teleopReefL4: sql<number>`round(avg("Match2025Data"."Teleop_Reef_L4"), 1) as "teleopReefL4"`,
      teleopLevel: sql<string>`concat(round(avg("Match2025Data"."Teleop_Reef_L1"), 1), ' / ', round(avg("Match2025Data"."Teleop_Reef_L2"), 1), ' / ', round(avg("Match2025Data"."Teleop_Reef_L3"), 1), ' / ', round(avg("Match2025Data"."Teleop_Reef_L4"), 1)) as "teleopLevel"`,
      teleopProcessor: sql<number>`round(avg("Match2025Data"."Teleop_Processor"), 1) as "teleopProcessor"`,
      teleopNet: sql<number>`round(avg("Match2025Data"."Teleop_Net"), 1) as "teleopNet"`,
      teleopAlgaeRemoved: sql<number>`round(avg("Match2025Data"."Teleop_Algae_Removed"), 1) as "teleopAlgaeRemoved"`,
      endgamePark: sql<number>`Round(avg(CASE "Match2025Data"."Endgame" WHEN 'Park' then 1 else 0 END), 1) as "endgamePark"`,
      endgameShallow: sql<number>`Round(avg(CASE "Match2025Data"."Endgame" WHEN 'Shallow' then 1 else 0 END), 1) as "endgameShallow"`,
      endgameDeep: sql<number>`Round(avg(CASE "Match2025Data"."Endgame" WHEN 'Deep' then 1 else 0 END), 1) as "endgameDeep"`,
      endgameNone: sql<number>`Round(avg(CASE "Match2025Data"."Endgame" WHEN 'None' then 1 else 0 END), 1) as "endgameNone"`,
      endgame: sql<string>`concat(Round(avg(CASE "Match2025Data"."Endgame" WHEN 'Deep' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Match2025Data"."Endgame" WHEN 'Shallow' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Match2025Data"."Endgame" WHEN 'Park' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Match2025Data"."Endgame" WHEN 'None' then 1 else 0 END), 1)) as "endgame"`,
      driverAbility: sql<number>`Round(avg("Leader2025Data"."Driver_Ability"), 1) as "driverAbility"`,
      operability: sql<string>`concat(Round(avg(CASE "Leader2025Data"."Break" WHEN 'Working' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Leader2025Data"."Break" WHEN 'Broken' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Leader2025Data"."Break" WHEN 'Dead' then 1 else 0 END), 1), ' / ', Round(avg(CASE "Leader2025Data"."Break" WHEN 'No Show' then 1 else 0 END), 1)) as "operability"`,
      role: sql<string>`concat(Round(avg(CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Coral%' then 1 else 0 END), 1), ' / ', Round(avg(CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Algae%' then 1 else 0 END), 1), ' / ', Round(avg(CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Defense%' then 1 else 0 END), 1)) as role`,
      hpNetShots: sql<string>`concat(coalesce(round(avg("Leader2025Data"."Net_Shots_Made"), 1), 0.0), ' / ', coalesce(round(avg("Leader2025Data"."Net_Shots_Missed"), 1), 0.0)) as "hpNetShots"`,
      hpNetMade: sql<number>`round(avg("Leader2025Data"."Net_Shots_Made"), 1) as "hpNet"`,
      driveTrain: pit2025DataTable.driveTrain,
    })
    .from(doNotPickList2025Table)
    .leftJoin(
      match2025DataTable,
      and(
        eq(doNotPickList2025Table.eventId, match2025DataTable.eventId),
        eq(doNotPickList2025Table.teamNumber, match2025DataTable.teamNumber)
      )
    )
    .leftJoin(
      leader2025DataTable,
      and(
        eq(doNotPickList2025Table.eventId, leader2025DataTable.eventId),
        eq(doNotPickList2025Table.teamNumber, leader2025DataTable.teamNumber)
      )
    )
    .leftJoin(
      pit2025DataTable,
      and(
        eq(doNotPickList2025Table.eventId, pit2025DataTable.eventId),
        eq(doNotPickList2025Table.teamNumber, pit2025DataTable.teamNumber)
      )
    )
    .where(eq(doNotPickList2025Table.eventId, eventId))
    .groupBy(
      doNotPickList2025Table.eventId,
      doNotPickList2025Table.teamNumber,
      doNotPickList2025Table.reason,
      pit2025DataTable.driveTrain
    )
    .orderBy(doNotPickList2025Table.teamNumber);

  return query;
}

export async function toggleSelected2025(
  eventId: SelectPickList2025Data['eventId'],
  teamNumber: SelectPickList2025Data['teamNumber'],
  allianceSelected: SelectPickList2025Data['allianceSelected']
): Promise<void> {
  await db
    .update(pickList2025Table)
    .set({ allianceSelected: allianceSelected })
    .where(
      and(
        eq(pickList2025Table.eventId, eventId),
        eq(pickList2025Table.teamNumber, teamNumber)
      )
    );
  return;
}

export async function addTo2025DnpList(
  eventId: SelectDoNotPick2025Data['eventId'],
  teamNumber: SelectDoNotPick2025Data['teamNumber'],
  reason: SelectDoNotPick2025Data['reason']
): Promise<void> {
  await db
    .insert(doNotPickList2025Table)
    .values({ eventId, teamNumber, reason })
    .onConflictDoNothing();

  await db
    .delete(pickList2025Table)
    .where(
      and(
        eq(pickList2025Table.eventId, eventId),
        eq(pickList2025Table.teamNumber, teamNumber)
      )
    );
}

export async function removeFrom2025DnpList(
  eventId: SelectPickList2025Data['eventId'],
  teamNumber: SelectPickList2025Data['teamNumber']
): Promise<void> {
  await db
    .insert(pickList2025Table)
    .values({ eventId, teamNumber, pickIndex: 999 })
    .onConflictDoNothing();

  await db
    .delete(doNotPickList2025Table)
    .where(
      and(
        eq(doNotPickList2025Table.eventId, eventId),
        eq(doNotPickList2025Table.teamNumber, teamNumber)
      )
    );
}

export async function move2025Team(
  eventId: SelectPickList2025Data['eventId'],
  teamNumber: SelectPickList2025Data['teamNumber'],
  pickIndex: SelectPickList2025Data['pickIndex']
): Promise<void> {
  await db
    .update(pickList2025Table)
    .set({ pickIndex: pickIndex })
    .where(
      and(
        eq(pickList2025Table.eventId, eventId),
        eq(pickList2025Table.teamNumber, teamNumber)
      )
    );
}

export async function move2025TeamOrder(
  moves: InsertPickList2025Data[]
): Promise<void> {
  await db
    .insert(pickList2025Table)
    .values(moves)
    .onConflictDoUpdate({
      target: [pickList2025Table.eventId, pickList2025Table.teamNumber],
      set: { pickIndex: sql.raw(`excluded."Pick_Index"`) },
    });
}
