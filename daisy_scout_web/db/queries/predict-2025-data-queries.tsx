import { eq, and, sql, inArray, ne, like, lte } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  EventMatchTeams2025Result,
  SelectMatch2025Data,
  eventsTable,
  leader2025DataTable,
  match2025DataTable,
  pit2025DataTable,
} from '@/db/schema';
import { Predict2025Data } from '../models/predict-2025-data';

export async function getPredict2025Results(
  eventId: SelectMatch2025Data['eventId'],
  blue1TeamNumber: SelectMatch2025Data['teamNumber'],
  blue2TeamNumber: SelectMatch2025Data['teamNumber'],
  blue3TeamNumber: SelectMatch2025Data['teamNumber'],
  red1TeamNumber: SelectMatch2025Data['teamNumber'],
  red2TeamNumber: SelectMatch2025Data['teamNumber'],
  red3TeamNumber: SelectMatch2025Data['teamNumber'],
  lastNMatches: number = 32767,
  allSeasonHistory: boolean = false
): Promise<Array<Predict2025Data> | undefined> {
  const season = parseInt(eventId.substring(0, 4));
  const coreQuery = db.select({
    eventId: match2025DataTable.eventId,
    teamNumber: match2025DataTable.teamNumber,
    matchNumber: match2025DataTable.matchNumber,
    matchType: match2025DataTable.matchType,
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
    break: leader2025DataTable.break,
    role: leader2025DataTable.primaryRole,
    netShotsMade: leader2025DataTable.netShotsMade,
    netShotsMissed: leader2025DataTable.netShotsMissed,
    startDate: eventsTable.startDate,
    rank: sql<number>`ROW_NUMBER() OVER(PARTITION BY "Match2025Data"."Team_Number", "Match2025Data"."Match_Type"
                        ORDER by "Events"."Date_Start" desc, "Match2025Data"."Match_Number" desc)`.as(
      'rank'
    ),
  });

  //  blue team members
  const blueDataQueryBase = coreQuery
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

  let blueRawData = blueDataQueryBase.where(
    and(
      eq(match2025DataTable.eventId, eventId),
      inArray(match2025DataTable.teamNumber, [
        blue1TeamNumber,
        blue2TeamNumber,
        blue3TeamNumber,
      ])
    )
  );

  if (allSeasonHistory) {
    blueRawData = blueDataQueryBase.where(
      and(
        ne(match2025DataTable.eventId, `${season}WEEK0`),
        like(match2025DataTable.eventId, `${season}%`),
        inArray(match2025DataTable.teamNumber, [
          blue1TeamNumber,
          blue2TeamNumber,
          blue3TeamNumber,
        ])
      )
    );
  }

  const blueWith = db.$with('blueWith').as(blueRawData);

  const blueData = db
    .with(blueWith)
    .select({
      eventId: blueWith.eventId,
      teamNumber: blueWith.teamNumber,
      autoStartLocAlliance:
        sql<number>`Round(avg(CASE "blueWith"."Auto_Start_Loc" WHEN 'Alliance Barge' then 1 else 0 END), 1)`.as(
          'autoStartLocAlliance'
        ),
      autoStartLocCenter:
        sql<number>`Round(avg(CASE "blueWith"."Auto_Start_Loc" WHEN 'Center' then 1 else 0 END), 1)`.as(
          'autoStartLocCenter'
        ),
      autoStartLocOpposing:
        sql<number>`Round(avg(CASE "blueWith"."Auto_Start_Loc" WHEN 'Opponent Barge' then 1 else 0 END), 1)`.as(
          'autoStartLocOpposing'
        ),
      autoStartLocNoShow:
        sql<number>`Round(avg(CASE "blueWith"."Auto_Start_Loc" WHEN 'No Show' then 1 else 0 END), 1)`.as(
          'autoStartLocNoShow'
        ),
      autoReefL1: sql<number>`round(avg("blueWith"."Auto_Reef_L1"), 1)`.as(
        'autoReefL1'
      ),
      autoReefL2: sql<number>`round(avg("blueWith"."Auto_Reef_L2"), 1)`.as(
        'autoReefL2'
      ),
      autoReefL3: sql<number>`round(avg("blueWith"."Auto_Reef_L3"), 1)`.as(
        'autoReefL3'
      ),
      autoReefL4: sql<number>`round(avg("blueWith"."Auto_Reef_L4"), 1)`.as(
        'autoReefL4'
      ),
      autoLevel:
        sql<string>`concat(round(avg("blueWith"."Auto_Reef_L1"), 1), ' / ', round(avg("blueWith"."Auto_Reef_L2"), 1), ' / ', round(avg("blueWith"."Auto_Reef_L3"), 1), ' / ', round(avg("blueWith"."Auto_Reef_L4"), 1))`.as(
          'autoLevel'
        ),
      coralA: sql<number>`round(avg("blueWith"."Coral_A"), 1)`.as('coralA'),
      coralB: sql<number>`round(avg("blueWith"."Coral_B"), 1)`.as('coralB'),
      coralC: sql<number>`round(avg("blueWith"."Coral_C"), 1)`.as('coralC'),
      coralD: sql<number>`round(avg("blueWith"."Coral_D"), 1)`.as('coralD'),
      coralE: sql<number>`round(avg("blueWith"."Coral_E"), 1)`.as('coralE'),
      coralF: sql<number>`round(avg("blueWith"."Coral_F"), 1)`.as('coralF'),
      autoReef:
        sql<string>`concat(round(avg("blueWith"."Coral_A"), 1), ' / ', round(avg("blueWith"."Coral_B"), 1), ' / ', round(avg("blueWith"."Coral_C"), 1), ' / ', round(avg("blueWith"."Coral_D"), 1), ' / ', round(avg("blueWith"."Coral_E"), 1), ' / ', round(avg("blueWith"."Coral_F"), 1))`.as(
          'autoReef'
        ),
      leave:
        sql<number>`Round(avg(CASE "blueWith"."Leave" WHEN 'Yes' then 1 else 0 END), 1)`.as(
          'leave'
        ),
      autoNet: sql<number>`round(avg("blueWith"."Auto_Net"), 1)`.as('autoNet'),
      autoProcessor: sql<number>`round(avg("blueWith"."Auto_Processor"), 1)`.as(
        'autoProcessor'
      ),
      teleopReefL1: sql<number>`round(avg("blueWith"."Teleop_Reef_L1"), 1)`.as(
        'teleopReefL1'
      ),
      teleopReefL2: sql<number>`round(avg("blueWith"."Teleop_Reef_L2"), 1)`.as(
        'teleopReefL2'
      ),
      teleopReefL3: sql<number>`round(avg("blueWith"."Teleop_Reef_L3"), 1)`.as(
        'teleopReefL3'
      ),
      teleopReefL4: sql<number>`round(avg("blueWith"."Teleop_Reef_L4"), 1)`.as(
        'teleopReefL4'
      ),
      teleopLevel:
        sql<string>`concat(round(avg("blueWith"."Teleop_Reef_L1"), 1), ' / ', round(avg("blueWith"."Teleop_Reef_L2"), 1), ' / ', round(avg("blueWith"."Teleop_Reef_L3"), 1), ' / ', round(avg("blueWith"."Teleop_Reef_L4"), 1))`.as(
          'teleopLevel'
        ),
      teleopProcessor:
        sql<number>`round(avg("blueWith"."Teleop_Processor"), 1)`.as(
          'teleopProcessor'
        ),
      teleopNet: sql<number>`round(avg("blueWith"."Teleop_Net"), 1)`.as(
        'teleopNet'
      ),
      teleopAlgaeRemoved:
        sql<number>`round(avg("blueWith"."Teleop_Algae_Removed"), 1)`.as(
          'teleopAlgaeRemoved'
        ),
      endgamePark:
        sql<number>`Round(avg(CASE "blueWith"."Endgame" WHEN 'Park' then 1 else 0 END), 1)`.as(
          'endgamePark'
        ),
      endgameShallow:
        sql<number>`Round(avg(CASE "blueWith"."Endgame" WHEN 'Shallow' then 1 else 0 END), 1)`.as(
          'endgameShallow'
        ),
      endgameDeep:
        sql<number>`Round(avg(CASE "blueWith"."Endgame" WHEN 'Deep' then 1 else 0 END), 1)`.as(
          'endgameDeep'
        ),
      endgameNone:
        sql<number>`Round(avg(CASE "blueWith"."Endgame" WHEN 'None' then 1 else 0 END), 1)`.as(
          'endgameNone'
        ),
      endgame:
        sql<string>`concat(Round(avg(CASE "blueWith"."Endgame" WHEN 'Deep' then 1 else 0 END), 1), ' / ', Round(avg(CASE "blueWith"."Endgame" WHEN 'Shallow' then 1 else 0 END), 1), ' / ', Round(avg(CASE "blueWith"."Endgame" WHEN 'Park' then 1 else 0 END), 1), ' / ', Round(avg(CASE "blueWith"."Endgame" WHEN 'None' then 1 else 0 END), 1))`.as(
          'endgame'
        ),
      driverAbility: sql<number>`Round(avg("blueWith"."Driver_Ability"), 1)`.as(
        'driverAbility'
      ),
      operability:
        sql<string>`concat(Round(avg(CASE "blueWith"."Break" WHEN 'Working' then 1 else 0 END), 1), ' / ', Round(avg(CASE "blueWith"."Break" WHEN 'Broken' then 1 else 0 END), 1), ' / ', Round(avg(CASE "blueWith"."Break" WHEN 'Dead' then 1 else 0 END), 1), ' / ', Round(avg(CASE "blueWith"."Break" WHEN 'No Show' then 1 else 0 END), 1))`.as(
          'operability'
        ),
      role: sql<string>`concat(Round(avg(CASE WHEN "blueWith"."Primary_Role" ILike '%Coral%' then 1 else 0 END), 1), ' / ', Round(avg(CASE WHEN "blueWith"."Primary_Role" ILike '%Algae%' then 1 else 0 END), 1), ' / ', Round(avg(CASE WHEN "blueWith"."Primary_Role" ILike '%Defense%' then 1 else 0 END), 1))`.as(
        'role'
      ),
      hpNetShots:
        sql<string>`concat(round(avg("blueWith"."Net_Shots_Made"), 1), ' / ', round(avg("blueWith"."Net_Shots_Missed"), 1))`.as(
          'hpNetShots'
        ),
      hpNetMade: sql<number>`round(avg("blueWith"."Net_Shots_Made"), 1)`.as(
        'hpNet'
      ),
    })
    .from(blueWith)
    .where(lte(blueWith.rank, lastNMatches))
    .groupBy(blueWith.eventId, blueWith.teamNumber);

  //  red team members
  const redDataQueryBase = coreQuery
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

  let redRawData = redDataQueryBase.where(
    and(
      eq(match2025DataTable.eventId, eventId),
      inArray(match2025DataTable.teamNumber, [
        red1TeamNumber,
        red2TeamNumber,
        red3TeamNumber,
      ])
    )
  );

  if (allSeasonHistory) {
    redRawData = redDataQueryBase.where(
      and(
        ne(match2025DataTable.eventId, `${season}WEEK0`),
        like(match2025DataTable.eventId, `${season}%`),
        inArray(match2025DataTable.teamNumber, [
          red1TeamNumber,
          red2TeamNumber,
          red3TeamNumber,
        ])
      )
    );
  }

  const redWith = db.$with('redWith').as(redRawData);

  const redData = db
    .with(redWith)
    .select({
      eventId: redWith.eventId,
      teamNumber: redWith.teamNumber,
      autoStartLocAlliance:
        sql<number>`Round(avg(CASE "redWith"."Auto_Start_Loc" WHEN 'Alliance Barge' then 1 else 0 END), 1)`.as(
          'autoStartLocAlliance'
        ),
      autoStartLocCenter:
        sql<number>`Round(avg(CASE "redWith"."Auto_Start_Loc" WHEN 'Center' then 1 else 0 END), 1)`.as(
          'autoStartLocCenter'
        ),
      autoStartLocOpposing:
        sql<number>`Round(avg(CASE "redWith"."Auto_Start_Loc" WHEN 'Opponent Barge' then 1 else 0 END), 1)`.as(
          'autoStartLocOpposing'
        ),
      autoStartLocNoShow:
        sql<number>`Round(avg(CASE "redWith"."Auto_Start_Loc" WHEN 'No Show' then 1 else 0 END), 1)`.as(
          'autoStartLocNoShow'
        ),
      autoReefL1: sql<number>`round(avg("redWith"."Auto_Reef_L1"), 1)`.as(
        'autoReefL1'
      ),
      autoReefL2: sql<number>`round(avg("redWith"."Auto_Reef_L2"), 1)`.as(
        'autoReefL2'
      ),
      autoReefL3: sql<number>`round(avg("redWith"."Auto_Reef_L3"), 1)`.as(
        'autoReefL3'
      ),
      autoReefL4: sql<number>`round(avg("redWith"."Auto_Reef_L4"), 1)`.as(
        'autoReefL4'
      ),
      autoLevel:
        sql<string>`concat(round(avg("redWith"."Auto_Reef_L1"), 1), ' / ', round(avg("redWith"."Auto_Reef_L2"), 1), ' / ', round(avg("redWith"."Auto_Reef_L3"), 1), ' / ', round(avg("redWith"."Auto_Reef_L4"), 1))`.as(
          'autoLevel'
        ),
      coralA: sql<number>`round(avg("redWith"."Coral_A"), 1)`.as('coralA'),
      coralB: sql<number>`round(avg("redWith"."Coral_B"), 1)`.as('coralB'),
      coralC: sql<number>`round(avg("redWith"."Coral_C"), 1)`.as('coralC'),
      coralD: sql<number>`round(avg("redWith"."Coral_D"), 1)`.as('coralD'),
      coralE: sql<number>`round(avg("redWith"."Coral_E"), 1)`.as('coralE'),
      coralF: sql<number>`round(avg("redWith"."Coral_F"), 1)`.as('coralF'),
      autoReef:
        sql<string>`concat(round(avg("redWith"."Coral_A"), 1), ' / ', round(avg("redWith"."Coral_B"), 1), ' / ', round(avg("redWith"."Coral_C"), 1), ' / ', round(avg("redWith"."Coral_D"), 1), ' / ', round(avg("redWith"."Coral_E"), 1), ' / ', round(avg("redWith"."Coral_F"), 1))`.as(
          'autoReef'
        ),
      leave:
        sql<number>`Round(avg(CASE "redWith"."Leave" WHEN 'Yes' then 1 else 0 END), 1)`.as(
          'leave'
        ),
      autoNet: sql<number>`round(avg("redWith"."Auto_Net"), 1)`.as('autoNet'),
      autoProcessor: sql<number>`round(avg("redWith"."Auto_Processor"), 1)`.as(
        'autoProcessor'
      ),
      teleopReefL1: sql<number>`round(avg("redWith"."Teleop_Reef_L1"), 1)`.as(
        'teleopReefL1'
      ),
      teleopReefL2: sql<number>`round(avg("redWith"."Teleop_Reef_L2"), 1)`.as(
        'teleopReefL2'
      ),
      teleopReefL3: sql<number>`round(avg("redWith"."Teleop_Reef_L3"), 1)`.as(
        'teleopReefL3'
      ),
      teleopReefL4: sql<number>`round(avg("redWith"."Teleop_Reef_L4"), 1)`.as(
        'teleopReefL4'
      ),
      teleopLevel:
        sql<string>`concat(round(avg("redWith"."Teleop_Reef_L1"), 1), ' / ', round(avg("redWith"."Teleop_Reef_L2"), 1), ' / ', round(avg("redWith"."Teleop_Reef_L3"), 1), ' / ', round(avg("redWith"."Teleop_Reef_L4"), 1))`.as(
          'teleopLevel'
        ),
      teleopProcessor:
        sql<number>`round(avg("redWith"."Teleop_Processor"), 1)`.as(
          'teleopProcessor'
        ),
      teleopNet: sql<number>`round(avg("redWith"."Teleop_Net"), 1)`.as(
        'teleopNet'
      ),
      teleopAlgaeRemoved:
        sql<number>`round(avg("redWith"."Teleop_Algae_Removed"), 1)`.as(
          'teleopAlgaeRemoved'
        ),
      endgamePark:
        sql<number>`Round(avg(CASE "redWith"."Endgame" WHEN 'Park' then 1 else 0 END), 1)`.as(
          'endgamePark'
        ),
      endgameShallow:
        sql<number>`Round(avg(CASE "redWith"."Endgame" WHEN 'Shallow' then 1 else 0 END), 1)`.as(
          'endgameShallow'
        ),
      endgameDeep:
        sql<number>`Round(avg(CASE "redWith"."Endgame" WHEN 'Deep' then 1 else 0 END), 1)`.as(
          'endgameDeep'
        ),
      endgameNone:
        sql<number>`Round(avg(CASE "redWith"."Endgame" WHEN 'None' then 1 else 0 END), 1)`.as(
          'endgameNone'
        ),
      endgame:
        sql<string>`concat(Round(avg(CASE "redWith"."Endgame" WHEN 'Deep' then 1 else 0 END), 1), ' / ', Round(avg(CASE "redWith"."Endgame" WHEN 'Shallow' then 1 else 0 END), 1), ' / ', Round(avg(CASE "redWith"."Endgame" WHEN 'Park' then 1 else 0 END), 1), ' / ', Round(avg(CASE "redWith"."Endgame" WHEN 'None' then 1 else 0 END), 1))`.as(
          'endgame'
        ),
      driverAbility: sql<number>`Round(avg("redWith"."Driver_Ability"), 1)`.as(
        'driverAbility'
      ),
      operability:
        sql<string>`concat(Round(avg(CASE "redWith"."Break" WHEN 'Working' then 1 else 0 END), 1), ' / ', Round(avg(CASE "redWith"."Break" WHEN 'Broken' then 1 else 0 END), 1), ' / ', Round(avg(CASE "redWith"."Break" WHEN 'Dead' then 1 else 0 END), 1), ' / ', Round(avg(CASE "redWith"."Break" WHEN 'No Show' then 1 else 0 END), 1))`.as(
          'operability'
        ),
      role: sql<string>`concat(Round(avg(CASE WHEN "redWith"."Primary_Role" ILike '%Coral%' then 1 else 0 END), 1), ' / ', Round(avg(CASE WHEN "redWith"."Primary_Role" ILike '%Algae%' then 1 else 0 END), 1), ' / ', Round(avg(CASE WHEN "redWith"."Primary_Role" ILike '%Defense%' then 1 else 0 END), 1))`.as(
        'role'
      ),
      hpNetShots:
        sql<string>`concat(round(avg("redWith"."Net_Shots_Made"), 1), ' / ', round(avg("redWith"."Net_Shots_Missed"), 1))`.as(
          'hpNetShots'
        ),
      hpNetMade: sql<number>`round(avg("redWith"."Net_Shots_Made"), 1)`.as(
        'hpNet'
      ),
    })
    .from(redWith)
    .where(lte(redWith.rank, lastNMatches))
    .groupBy(redWith.eventId, redWith.teamNumber);

  const query = await db
    .select({
      eventId: sql<string>`combined."Event_Id"`,
      teamNumber: sql<number>`combined."Team_Number"`,
      autoStartLocAlliance: sql<number>`combined."autoStartLocAlliance"`,
      autoStartLocCenter: sql<number>`combined."autoStartLocCenter"`,
      autoStartLocOpposing: sql<number>`combined."autoStartLocOpposing"`,
      autoStartLocNoShow: sql<number>`combined."autoStartLocNoShow"`,
      autoReefL1: sql<number>`combined."autoReefL1"`,
      autoReefL2: sql<number>`combined."autoReefL2"`,
      autoReefL3: sql<number>`combined."autoReefL3"`,
      autoReefL4: sql<number>`combined."autoReefL4"`,
      autoLevel: sql<string>`combined."autoLevel"`,
      coralA: sql<number>`combined."coralA"`,
      coralB: sql<number>`combined."coralB"`,
      coralC: sql<number>`combined."coralC"`,
      coralD: sql<number>`combined."coralD"`,
      coralE: sql<number>`combined."coralE"`,
      coralF: sql<number>`combined."coralF"`,
      autoReef: sql<string>`combined."autoReef"`,
      leave: sql<number>`combined."leave"`,
      autoNet: sql<number>`combined."autoNet"`,
      autoProcessor: sql<number>`combined."autoProcessor"`,
      teleopReefL1: sql<number>`combined."teleopReefL1"`,
      teleopReefL2: sql<number>`combined."teleopReefL2"`,
      teleopReefL3: sql<number>`combined."teleopReefL3"`,
      teleopReefL4: sql<number>`combined."teleopReefL4"`,
      teleopLevel: sql<string>`combined."teleopLevel"`,
      teleopProcessor: sql<number>`combined."teleopProcessor"`,
      teleopNet: sql<number>`combined."teleopNet"`,
      teleopAlgaeRemoved: sql<number>`combined."teleopAlgaeRemoved"`,
      endgamePark: sql<number>`combined."endgamePark"`,
      endgameShallow: sql<number>`combined."endgameShallow"`,
      endgameDeep: sql<number>`combined."endgameDeep"`,
      endgameNone: sql<number>`combined."endgameNone"`,
      endgame: sql<string>`combined."endgame"`,
      driverAbility: sql<number>`combined."driverAbility"`,
      operability: sql<string>`combined."operability"`,
      role: sql<string>`combined."role"`,
      hpNetShots: sql<string>`combined."hpNetShots"`,
      hpNetMade: sql<number>`combined."hpNet"`,
    })
    .from(sql`(${blueData} UNION ALL ${redData}) as combined`)
    .leftJoin(
      pit2025DataTable,
      and(
        sql`combined."Event_Id" = ${pit2025DataTable.eventId}`,
        sql`combined."Team_Number" = ${pit2025DataTable.teamNumber}`
      )
    );

  if (query.length > 0) {
    return query;
  } else {
    return;
  }
}
