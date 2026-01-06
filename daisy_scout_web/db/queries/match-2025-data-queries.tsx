//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import {
  eq,
  and,
  sql,
  desc,
  inArray,
  lte,
  sum,
  max,
  ne,
  like,
} from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  SelectMatch2025Data,
  match2025DataTable,
  InsertMatch2025Data,
  leader2025DataTable,
  eventMatchTeamsTable,
  eventMatchesTable,
  eventTeamsTable,
  eventsTable,
  EventMatchTeams2025Result,
} from '@/db/schema';
import { TeamMatch2025Performance } from '../models/team-match-2025-performance';
import { TeamMatch2025Data } from '../models/team-match-2025-data';
import { TeamMatch2025Autos } from '../models/team-match-2025-autos';
import { Match2025Data } from '../models/match-2025-data';
import { SharableMatch2025Data } from '../models/sharable-match-2025-data';

export async function getMatchDataFor2025Event({
  eventId,
  matchType,
}: {
  eventId: SelectMatch2025Data['eventId'];
  matchType: SelectMatch2025Data['matchType'];
}): Promise<Array<Match2025Data>> {
  const query = await db
    .select({
      eventId: match2025DataTable.eventId,
      matchType: match2025DataTable.matchType,
      matchNumber: match2025DataTable.matchNumber,
      source: match2025DataTable.source,
      teamNumber: match2025DataTable.teamNumber,
      scoutName: match2025DataTable.scoutName,
      allianceColor: match2025DataTable.allianceColor,
      alliancePosition: match2025DataTable.alliancePosition,

      autoStartLoc: match2025DataTable.autoStartLoc,
      autoReefL1: match2025DataTable.autoReefL1,
      autoReefL2: match2025DataTable.autoReefL2,
      autoReefL3: match2025DataTable.autoReefL3,
      autoReefL4: match2025DataTable.autoReefL4,
      coralA: match2025DataTable.coralA,
      coralB: match2025DataTable.coralB,
      coralC: match2025DataTable.coralC,
      coralD: match2025DataTable.coralD,
      coralE: match2025DataTable.coralE,
      coralF: match2025DataTable.coralF,
      leave: match2025DataTable.leave,
      autoNet: match2025DataTable.autoNet,
      autoProcessor: match2025DataTable.autoProcessor,
      teleopReefL1: match2025DataTable.teleopReefL1,
      teleopReefL2: match2025DataTable.teleopReefL2,
      teleopReefL3: match2025DataTable.teleopReefL3,
      teleopReefL4: match2025DataTable.teleopReefL4,
      teleopProcessor: match2025DataTable.teleopProcessor,
      teleopNet: match2025DataTable.teleopNet,
      teleopAlgaeRemoved: match2025DataTable.teleopAlgaeRemoved,
      endgame: match2025DataTable.endgame,

      createdAt: match2025DataTable.createdAt,
      updatedAt: match2025DataTable.updatedAt,
    })
    .from(match2025DataTable)
    .where(
      and(
        eq(match2025DataTable.eventId, eventId),
        eq(match2025DataTable.matchType, matchType)
      )
    )
    .orderBy(
      match2025DataTable.matchType,
      match2025DataTable.matchNumber,
      match2025DataTable.allianceColor,
      match2025DataTable.alliancePosition
    );
  return query;
}

export async function getMatchAveragesFor2025Event(
  eventId: SelectMatch2025Data['eventId'],
  matchType: SelectMatch2025Data['matchType'],
  lastNMatches: number = 32767,
  allSeasonHistory: boolean = false
): Promise<TeamMatch2025Performance[]> {
  const season = parseInt(eventId.substring(0, 4));

  const withquery = db
    .select({
      eventId: match2025DataTable.eventId,
      matchType: match2025DataTable.matchType,
      matchNumber: match2025DataTable.matchNumber,
      teamNumber: match2025DataTable.teamNumber,

      Rank: sql<number>`ROW_NUMBER() OVER(PARTITION BY "Match2025Data"."Team_Number", "Match2025Data"."Match_Type"
                    ORDER by "Events"."Date_Start" desc, "Match2025Data"."Match_Number" desc)`.as(
        'Rank'
      ),
      matchSource: match2025DataTable.source,
      matchScout: match2025DataTable.scoutName,
      allianceColor: match2025DataTable.allianceColor,
      alliancePosition: match2025DataTable.alliancePosition,
      autoStartLoc: match2025DataTable.autoStartLoc,
      autoStartLocAlliance: sql<number>`CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Alliance Barge' then 1 else 0 END as "autoStartLocAlliance"`,
      autoStartLocCenter: sql<number>`CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Center' then 1 else 0 END as "autoStartLocCenter"`,
      autoStartLocOpponent: sql<number>`CASE "Match2025Data"."Auto_Start_Loc" WHEN 'Opponent Barge' then 1 else 0 END as "autoStartLocOpponent"`,
      autoStartLocNoShow: sql<number>`CASE "Match2025Data"."Auto_Start_Loc" WHEN 'No Show' then 1 else 0 END as "autoStartLocNoShow"`,
      autoReefL1: match2025DataTable.autoReefL1,
      autoReefL2: match2025DataTable.autoReefL2,
      autoReefL3: match2025DataTable.autoReefL3,
      autoReefL4: match2025DataTable.autoReefL4,
      coralA: match2025DataTable.coralA,
      coralB: match2025DataTable.coralB,
      coralC: match2025DataTable.coralC,
      coralD: match2025DataTable.coralD,
      coralE: match2025DataTable.coralE,
      coralF: match2025DataTable.coralF,
      leave: EventMatchTeams2025Result.leave ?? match2025DataTable.leave,
      leaveNum:
        sql<number>`CASE COALESCE("EventMatchTeams2025Result"."Leave", "Match2025Data"."Leave") WHEN 'Yes' then 1 else 0 END`.as(
          'leaveNum'
        ),
      autoNet: match2025DataTable.autoNet,
      autoProcessor: match2025DataTable.autoProcessor,
      teleopReefL1: match2025DataTable.teleopReefL1,
      teleopReefL2: match2025DataTable.teleopReefL2,
      teleopReefL3: match2025DataTable.teleopReefL3,
      teleopReefL4: match2025DataTable.teleopReefL4,
      teleopProcessor: match2025DataTable.teleopProcessor,
      teleopNet: match2025DataTable.teleopNet,
      teleopAlgaeRemoved:
        sql<number>`coalesce("Match2025Data"."Teleop_Algae_Removed", 0)`.as(
          'Teleop_Algae_Removed'
        ),
      endgame: sql<string>`Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 )`.as('endgame'),
      endgamePark: sql<number>`CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Park' then 1 else 0 END`.as('endgamePark'),
      endgameShallow: sql<number>`CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Shallow' then 1 else 0 END`.as('endgameShallow'),
      endgameDeep: sql<number>`CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'Deep' then 1 else 0 END`.as('endgameDeep'),
      endgameNone: sql<number>`CASE Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 ) WHEN 'None' then 1 else 0 END`.as('endgameNone'),

      leaderSource: leader2025DataTable.source,
      leaderScout: leader2025DataTable.scoutName,
      driverAbility: leader2025DataTable.driverAbility,
      sourceTime: leader2025DataTable.sourceTime,
      operability: leader2025DataTable.break,
      operability_Working:
        sql<number>`CASE "Leader2025Data"."Break" WHEN 'Working' then 1 else 0 END`.as(
          'operability_Working'
        ),
      operability_Broken:
        sql<number>`CASE "Leader2025Data"."Break" WHEN 'Broken' then 1 else 0 END`.as(
          'operability_Broken'
        ),
      operability_Dead:
        sql<number>`CASE "Leader2025Data"."Break" WHEN 'Dead' then 1 else 0 END`.as(
          'operability_Dead'
        ),
      operability_NoShow:
        sql<number>`CASE "Leader2025Data"."Break" WHEN 'No Show' then 1 else 0 END`.as(
          'operability_NoShow'
        ),

      role: leader2025DataTable.primaryRole,
      role_Coral:
        sql<number>`CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Coral%' then 1 else 0 END`.as(
          'role_Coral'
        ),
      role_Algae:
        sql<number>`CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Algae%' then 1 else 0 END`.as(
          'role_Algae'
        ),
      role_Defense:
        sql<number>`CASE WHEN "Leader2025Data"."Primary_Role" ILike '%Defense%' then 1 else 0 END`.as(
          'role_Defense'
        ),
      netShotsMade: leader2025DataTable.netShotsMade,
      netShotsMissed: leader2025DataTable.netShotsMissed,
      otherNotes: leader2025DataTable.otherNotes,
    })
    .from(match2025DataTable)
    .innerJoin(eventsTable, eq(match2025DataTable.eventId, eventsTable.eventId))
    .leftJoin(
      leader2025DataTable,
      and(
        eq(match2025DataTable.eventId, leader2025DataTable.eventId),
        eq(match2025DataTable.matchType, leader2025DataTable.matchType),
        eq(match2025DataTable.matchNumber, leader2025DataTable.matchNumber),
        eq(match2025DataTable.teamNumber, leader2025DataTable.teamNumber)
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
    );

  let queryWithWhere = withquery.where(
    and(
      eq(match2025DataTable.eventId, eventId),
      eq(match2025DataTable.matchType, matchType)
    )
  );
  if (allSeasonHistory) {
    queryWithWhere = withquery.where(
      and(
        ne(match2025DataTable.eventId, `${season}WEEK0`),
        like(match2025DataTable.eventId, `${season}%`),
        eq(match2025DataTable.matchType, matchType)
      )
    );
  }

  const RankedMatchLeaderData = db
    .$with('RankedMatchLeaderData')
    .as(queryWithWhere);

  const query = await db
    .with(RankedMatchLeaderData)
    .select({
      //eventId: RankedMatchLeaderData.eventId,
      teamNumber: eventTeamsTable.teamNumber,
      numMatches:
        sql<number>`sum(case when "RankedMatchLeaderData"."autoStartLocAlliance" is null then 0 else 1 end)`.as(
          'numMatches'
        ),
      //autoStartLoc: RankedMatchLeaderData.autoStartLoc,
      autoStartLocAlliance: sql<number>`round(avg("RankedMatchLeaderData"."autoStartLocAlliance"),1)`,
      autoStartLocCenter: sql<number>`round(avg("RankedMatchLeaderData"."autoStartLocCenter"), 1)`,
      autoStartLocOpponent: sql<number>`round(avg("RankedMatchLeaderData"."autoStartLocOpponent"), 1)`,
      autoStartLocNoShow: sql<number>`round(avg("RankedMatchLeaderData"."autoStartLocNoShow"), 1)`,
      autoReefL1: sql<number>`round(avg("RankedMatchLeaderData"."Auto_Reef_L1"), 1)`,
      autoReefL2: sql<number>`round(avg("RankedMatchLeaderData"."Auto_Reef_L2"), 1)`,
      autoReefL3: sql<number>`round(avg("RankedMatchLeaderData"."Auto_Reef_L3"), 1)`,
      autoReefL4: sql<number>`round(avg("RankedMatchLeaderData"."Auto_Reef_L4"), 1)`,
      autoReefLevels: sql<string>`concat(
        round(avg("RankedMatchLeaderData"."Auto_Reef_L1"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Auto_Reef_L2"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Auto_Reef_L3"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Auto_Reef_L4"), 1)
      )`,
      coralA: sql<number>`round(avg("RankedMatchLeaderData"."Coral_A"), 1)`,
      coralB: sql<number>`round(avg("RankedMatchLeaderData"."Coral_B"), 1)`,
      coralC: sql<number>`round(avg("RankedMatchLeaderData"."Coral_C"), 1)`,
      coralD: sql<number>`round(avg("RankedMatchLeaderData"."Coral_D"), 1)`,
      coralE: sql<number>`round(avg("RankedMatchLeaderData"."Coral_E"), 1)`,
      coralF: sql<number>`round(avg("RankedMatchLeaderData"."Coral_F"), 1)`,
      autoReefSides: sql<string>`concat(
        round(avg("RankedMatchLeaderData"."Coral_A"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Coral_B"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Coral_C"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Coral_D"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Coral_E"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Coral_F"), 1)
      )`,
      //leave: RankedMatchLeaderData.leave,
      leaveNum: sql<number>`round(avg("RankedMatchLeaderData"."leaveNum"), 1)`,
      autoNet: sql<number>`round(avg("RankedMatchLeaderData"."Auto_Net"), 1)`,
      autoProcessor: sql<number>`round(avg("RankedMatchLeaderData"."Auto_Processor"), 1)`,
      teleopReefL1: sql<number>`round(avg("RankedMatchLeaderData"."Teleop_Reef_L1"), 1)`,
      teleopReefL2: sql<number>`round(avg("RankedMatchLeaderData"."Teleop_Reef_L2"), 1)`,
      teleopReefL3: sql<number>`round(avg("RankedMatchLeaderData"."Teleop_Reef_L3"), 1)`,
      teleopReefL4: sql<number>`round(avg("RankedMatchLeaderData"."Teleop_Reef_L4"), 1)`,
      teleopReefLevels: sql<string>`concat(
        round(avg("RankedMatchLeaderData"."Teleop_Reef_L1"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Teleop_Reef_L2"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Teleop_Reef_L3"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."Teleop_Reef_L4"), 1)
      )`,
      teleopProcessor: sql<number>`round(avg("RankedMatchLeaderData"."Teleop_Processor"), 1)`,
      teleopNet: sql<number>`round(avg("RankedMatchLeaderData"."Teleop_Net"), 1)`,
      teleopAlgaeRemoved: sql<number>`round(avg("RankedMatchLeaderData"."Teleop_Algae_Removed"), 1)`,
      endgame: sql<string>`concat(
        round(avg("RankedMatchLeaderData"."endgameDeep"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."endgameShallow"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."endgamePark"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."endgameNone"), 1)
      )`,
      endgamePark: sql<number>`round(avg("RankedMatchLeaderData"."endgamePark"), 1)`,
      endgameShallow: sql<number>`round(avg("RankedMatchLeaderData"."endgameShallow"), 1)`,
      endgameDeep: sql<number>`round(avg("RankedMatchLeaderData"."endgameDeep"), 1)`,
      endgameNone: sql<number>`round(avg("RankedMatchLeaderData"."endgameNone"), 1)`,
      //leaderSource: RankedMatchLeaderData.leaderSource,
      //leaderScout: RankedMatchLeaderData.leaderScout,
      driverAbility: sql<number>`round(avg("RankedMatchLeaderData"."Driver_Ability"), 1)`,
      operability: sql<string>`concat(
        round(avg("RankedMatchLeaderData"."operability_Working"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."operability_Broken"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."operability_Dead"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."operability_NoShow"), 1)
      )`,
      // operability_Working: sql<number>`RankedMatchLeaderData.operability_Working), 1)`,
      // operability_Broken: sql<number>`RankedMatchLeaderData.operability_Broken), 1)`,
      // operability_Dead: sql<number>`RankedMatchLeaderData.operability_Dead), 1)`,
      // operability_NoShow: sql<number>`RankedMatchLeaderData.operability_NoShow), 1)`,
      role: sql<string>`concat(
        round(avg("RankedMatchLeaderData"."role_Coral"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."role_Algae"), 1), ' / ',
        round(avg("RankedMatchLeaderData"."role_Defense"), 1)
      )`,
      // role_Coral: sql<number>`RankedMatchLeaderData.role_Coral), 1)`,
      // role_Algae: sql<number>`RankedMatchLeaderData.role_Algae), 1)`,
      // role_Defense: sql<number>`RankedMatchLeaderData.role_Defense), 1)`,
      hpNetShots: sql<string>`concat(round(avg("RankedMatchLeaderData"."Net_Shots_Made"), 1), ' / ', round(avg("RankedMatchLeaderData"."Net_Shots_Missed"), 1))`,
      hpNetMade: sql<number>`round(avg("RankedMatchLeaderData"."Net_Shots_Made"), 1)`,
      totalRobotPieces: sql<number>`round(avg(coalesce("RankedMatchLeaderData"."Auto_Reef_L1", 0.0)), 1) + 
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Reef_L2", 0.0)), 1) + 
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Reef_L3", 0.0)), 1) + 
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Reef_L4", 0.0)), 1) + 
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Reef_L1", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Reef_L2", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Reef_L3", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Reef_L4", 0.0)), 1) +
              
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Net", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Processor", 0.0)), 1) +
              
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Net", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Processor", 0.0)), 1)
              `,
    })
    .from(eventTeamsTable)
    .leftJoin(
      RankedMatchLeaderData,
      eq(eventTeamsTable.teamNumber, RankedMatchLeaderData.teamNumber)
    )
    .where(
      and(
        eq(eventTeamsTable.eventId, eventId), //ensure to return events for currently selected event
        lte(
          sql<number>`coalesce("RankedMatchLeaderData"."Rank", 0)`,
          lastNMatches
        ) // optionally filter to last n matches
      )
    )
    .groupBy(
      //RankedMatchLeaderData.eventId,
      eventTeamsTable.teamNumber
    )
    .orderBy(
      desc(sql<number>`round(avg(coalesce("RankedMatchLeaderData"."Auto_Reef_L1", 0.0)), 1) + 
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Reef_L2", 0.0)), 1) + 
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Reef_L3", 0.0)), 1) + 
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Reef_L4", 0.0)), 1) + 
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Reef_L1", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Reef_L2", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Reef_L3", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Reef_L4", 0.0)), 1) +
              
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Net", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Auto_Processor", 0.0)), 1) +
              
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Net", 0.0)), 1) +
              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Processor", 0.0)), 1) +
              
              round(avg(coalesce("RankedMatchLeaderData"."Net_Shots_Made", 0.0)), 1)
              `),
      eventTeamsTable.teamNumber
      //              round(avg(coalesce("RankedMatchLeaderData"."Teleop_Algae_Removed", 0.0)), 1) +
    );

  return query;
}

export async function getTeamMatchDataFor2025Event(
  eventId: SelectMatch2025Data['eventId'],
  teamNumber: SelectMatch2025Data['teamNumber'],
  matchType: SelectMatch2025Data['matchType']
): Promise<TeamMatch2025Data[] | undefined> {
  const query = await db
    .select({
      eventId: eventMatchesTable.eventId,
      teamNumber: eventMatchTeamsTable.teamNumber,
      matchType: eventMatchesTable.matchType,
      matchNumber: eventMatchesTable.matchNumber,
      source: match2025DataTable.source,
      scoutName: match2025DataTable.scoutName,
      allianceColor: match2025DataTable.allianceColor,
      alliancePosition: match2025DataTable.alliancePosition,

      autoStartLoc: match2025DataTable.autoStartLoc,
      autoReefL1: match2025DataTable.autoReefL1,
      autoReefL2: match2025DataTable.autoReefL2,
      autoReefL3: match2025DataTable.autoReefL3,
      autoReefL4: match2025DataTable.autoReefL4,
      coralA: match2025DataTable.coralA,
      coralB: match2025DataTable.coralB,
      coralC: match2025DataTable.coralC,
      coralD: match2025DataTable.coralD,
      coralE: match2025DataTable.coralE,
      coralF: match2025DataTable.coralF,
      leave:
        sql<string>`COALESCE("EventMatchTeams2025Result"."Leave", "Match2025Data"."Leave")`.as(
          'Leave'
        ),
      autoNet: match2025DataTable.autoNet,
      autoProcessor: match2025DataTable.autoProcessor,
      teleopReefL1: match2025DataTable.teleopReefL1,
      teleopReefL2: match2025DataTable.teleopReefL2,
      teleopReefL3: match2025DataTable.teleopReefL3,
      teleopReefL4: match2025DataTable.teleopReefL4,
      teleopProcessor: match2025DataTable.teleopProcessor,
      teleopNet: match2025DataTable.teleopNet,
      teleopAlgaeRemoved: match2025DataTable.teleopAlgaeRemoved,
      endgame: sql<string>`Coalesce(
			CASE "EventMatchTeams2025Result"."Endgame" when 'DeepCage' then 'Deep'
			  when 'ShallowCage' then 'Shallow'
			  when 'Parked' then 'Park'
			  when 'None' then 'None'
			  else null end,
			  "Match2025Data"."Endgame"	
			 )`.as('Endgame'),
      driverAbility: leader2025DataTable.driverAbility,
      operability: leader2025DataTable.break,
      role: leader2025DataTable.primaryRole,
      hpNetMissed: leader2025DataTable.netShotsMissed,
      hpNetMade: leader2025DataTable.netShotsMade,
    })
    .from(eventMatchesTable)
    .innerJoin(
      eventMatchTeamsTable,
      eq(eventMatchesTable.eventMatchId, eventMatchTeamsTable.eventMatchId)
    )
    .leftJoin(
      match2025DataTable,
      and(
        eq(eventMatchesTable.eventId, match2025DataTable.eventId),
        eq(eventMatchTeamsTable.teamNumber, match2025DataTable.teamNumber),
        eq(eventMatchesTable.matchType, match2025DataTable.matchType),
        eq(eventMatchesTable.matchNumber, match2025DataTable.matchNumber)
      )
    )
    .leftJoin(
      leader2025DataTable,
      and(
        eq(eventMatchesTable.eventId, leader2025DataTable.eventId),
        eq(eventMatchesTable.matchType, leader2025DataTable.matchType),
        eq(eventMatchesTable.matchNumber, leader2025DataTable.matchNumber),
        eq(eventMatchTeamsTable.teamNumber, leader2025DataTable.teamNumber)
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
    .where(
      and(
        eq(eventMatchesTable.eventId, eventId),
        eq(eventMatchTeamsTable.teamNumber, teamNumber),
        eq(eventMatchesTable.matchType, matchType)
      )
    )
    .orderBy(
      eventMatchesTable.eventId,
      eventMatchTeamsTable.teamNumber,
      eventMatchesTable.matchType,
      eventMatchesTable.matchNumber
    );

  return query;
}

export async function addMatchDataFor2025Event(
  data: InsertMatch2025Data
): Promise<Array<Match2025Data>> {
  const query = await db.insert(match2025DataTable).values(data).returning();
  return query;
}

export async function get2025MatchAutosForEvent(
  eventId: SelectMatch2025Data['eventId'],
  teamNumber1: SelectMatch2025Data['teamNumber'],
  teamNumber2: SelectMatch2025Data['teamNumber'],
  teamNumber3: SelectMatch2025Data['teamNumber'],
  matchType: SelectMatch2025Data['matchType'],
  lastNMatches: number = 32767,
  allSeasonHistory: boolean = false
): Promise<Array<TeamMatch2025Autos>> {
  const season = parseInt(eventId.substring(0, 4));

  const baseQuery = db
    .select({
      eventId: match2025DataTable.eventId,
      matchType: match2025DataTable.matchType,
      matchNumber: match2025DataTable.matchNumber,
      teamNumber: match2025DataTable.teamNumber,
      autoStartLoc: match2025DataTable.autoStartLoc,
      coralA: match2025DataTable.coralA,
      coralB: match2025DataTable.coralB,
      coralC: match2025DataTable.coralC,
      coralD: match2025DataTable.coralD,
      coralE: match2025DataTable.coralE,
      coralF: match2025DataTable.coralF,
      rank: sql<number>`ROW_NUMBER() OVER(PARTITION BY "Match2025Data"."Team_Number", "Match2025Data"."Match_Type"
                    ORDER by "Events"."Date_Start" desc, "Match2025Data"."Match_Number" desc)`.as(
        'rank'
      ),
    })
    .from(match2025DataTable)
    .innerJoin(
      eventsTable,
      eq(match2025DataTable.eventId, eventsTable.eventId)
    );

  let queryWithWhere = baseQuery.where(
    and(
      eq(match2025DataTable.eventId, eventId),
      eq(match2025DataTable.matchType, matchType),
      inArray(match2025DataTable.teamNumber, [
        teamNumber1,
        teamNumber2,
        teamNumber3,
      ])
    )
  );

  if (allSeasonHistory) {
    queryWithWhere = baseQuery.where(
      and(
        ne(match2025DataTable.eventId, `${season}WEEK0`),
        like(match2025DataTable.eventId, `${season}%`),
        eq(match2025DataTable.matchType, matchType),
        inArray(match2025DataTable.teamNumber, [
          teamNumber1,
          teamNumber2,
          teamNumber3,
        ])
      )
    );
  }

  const RankedAutoData = db.$with('RankedAutoData').as(queryWithWhere);

  const query = await db
    .with(RankedAutoData)
    .select({
      eventId: RankedAutoData.eventId,
      matchType: RankedAutoData.matchType,
      matchNumber: RankedAutoData.matchNumber,
      teamNumber: RankedAutoData.teamNumber,
      autoStartLoc: RankedAutoData.autoStartLoc,
      coralA: RankedAutoData.coralA,
      coralB: RankedAutoData.coralB,
      coralC: RankedAutoData.coralC,
      coralD: RankedAutoData.coralD,
      coralE: RankedAutoData.coralE,
      coralF: RankedAutoData.coralF,
    })
    .from(RankedAutoData)
    .where(lte(RankedAutoData.rank, lastNMatches))
    .orderBy(RankedAutoData.teamNumber, RankedAutoData.matchNumber);

  return query;
}

export async function getSharableMatchDataFor2025Event({
  eventId,
  matchType,
}: {
  eventId: SelectMatch2025Data['eventId'];
  matchType: SelectMatch2025Data['matchType'];
}): Promise<Array<SharableMatch2025Data>> {
  const query = await db
    .select({
      teamNumber: match2025DataTable.teamNumber,
      asOfMatch: max(match2025DataTable.matchNumber),
      totalCoral: sql<number>`Round(Avg(
        ${match2025DataTable.autoReefL1 ?? 0} +
        ${match2025DataTable.autoReefL2 ?? 0} +
        ${match2025DataTable.autoReefL3 ?? 0} +
        ${match2025DataTable.autoReefL4 ?? 0} +
        ${match2025DataTable.teleopReefL1 ?? 0} +
        ${match2025DataTable.teleopReefL2 ?? 0} +
        ${match2025DataTable.teleopReefL3 ?? 0} +
        ${match2025DataTable.teleopReefL4 ?? 0}
        ), 1)`,

      totalAutoCoral: sql<number>`Round(Avg(
          ${match2025DataTable.autoReefL1 ?? 0} +
          ${match2025DataTable.autoReefL2 ?? 0} +
          ${match2025DataTable.autoReefL3 ?? 0} +
          ${match2025DataTable.autoReefL4 ?? 0}
        ), 1)`,
      autoReefL1: sum(match2025DataTable.autoReefL1 ?? 0),
      autoReefL2: sum(match2025DataTable.autoReefL2 ?? 0),
      autoReefL3: sum(match2025DataTable.autoReefL3 ?? 0),
      autoReefL4: sum(match2025DataTable.autoReefL4 ?? 0),

      leave: sum(
        sql<number>`CASE "Match2025Data"."Leave" WHEN 'Yes' then 1 else 0 END`
      ),
      autoNet: sum(match2025DataTable.autoNet ?? 0),
      autoProcessor: sum(match2025DataTable.autoProcessor ?? 0),

      totalTeleopCoral: sql<number>`Round(Avg(
        ${match2025DataTable.teleopReefL1 ?? 0} +
        ${match2025DataTable.teleopReefL2 ?? 0} +
        ${match2025DataTable.teleopReefL3 ?? 0} +
        ${match2025DataTable.teleopReefL4 ?? 0}
    ), 1)`,
      teleopReefL1: sum(match2025DataTable.teleopReefL1 ?? 0),
      teleopReefL2: sum(match2025DataTable.teleopReefL2 ?? 0),
      teleopReefL3: sum(match2025DataTable.teleopReefL3 ?? 0),
      teleopReefL4: sum(match2025DataTable.teleopReefL4 ?? 0),
      teleopProcessor: sum(match2025DataTable.teleopProcessor ?? 0),
      teleopNet: sum(match2025DataTable.teleopNet ?? 0),
      teleopAlgaeRemoved: sum(match2025DataTable.teleopAlgaeRemoved ?? 0),
    })
    .from(match2025DataTable)
    .where(
      and(
        eq(match2025DataTable.eventId, eventId),
        eq(match2025DataTable.matchType, matchType)
      )
    )
    .groupBy(match2025DataTable.teamNumber)
    .orderBy(match2025DataTable.teamNumber);
  return query;
}
