import { eq, and, sql, avg, inArray } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  SelectMatch2024Data,
  leader2024DataTable,
  match2024DataTable,
  pit2024DataTable,
} from '@/db/schema';

export interface Predict2024Data {
  eventId: string;
  teamNumber: number;
  climbStateAvg: number | null;
  robotLeaveAvg: number | null;

  autoAmpScoredAvg: number | null;
  autoSpeakerScoredAvg: number | null;
  autoAmpMissedAvg: number | null;
  autoSpeakerMissedAvg: number | null;

  teleAmpScoredAvg: number | null;
  teleSpeakerScoredAvg: number | null;
  teleAmpMissedAvg: number | null;
  teleSpeakerMissedAvg: number | null;

  ferryAvg: number | null;
  trapAvg: number | null;
  harmonyAvg: number | null;
  driverAbilityAvg: number | null;
  sourceTimeAvg: number | null;
  ampTimeAvg: number | null;

  operation: string | null;
  role: string | null;

  driveTrain: string | null;
  humanPlayer: string | null;
  canLeave: number | null;
  canAutoAmp: number | null;
  canAutoSpeaker: number | null;
  contestMiddle: number | null;
  maxNotesAuto: number | null;
  canTeleAmp: number | null;
  canTeleSpeaker: number | null;
  canTrap: string | null;
  intakeLocation: string | null;
  scoringPref: string | null;
  climbLocation: string | null;
  climbHeight: string | null;
  notableFeat: string | null;
}

export async function getPredict2024Results(
  eventId: SelectMatch2024Data['eventId'],
  blue1TeamNumber: SelectMatch2024Data['teamNumber'],
  blue2TeamNumber: SelectMatch2024Data['teamNumber'],
  blue3TeamNumber: SelectMatch2024Data['teamNumber'],
  red1TeamNumber: SelectMatch2024Data['teamNumber'],
  red2TeamNumber: SelectMatch2024Data['teamNumber'],
  red3TeamNumber: SelectMatch2024Data['teamNumber']
): Promise<Array<Predict2024Data>> {
  const coreQuery = db.select({
    eventId: match2024DataTable.eventId,
    teamNumber: match2024DataTable.teamNumber,
    climbStateAvg: sql`avg(CASE "Match2024Data"."Climb_State" WHEN 'Climbed Side' then 1 WHEN 'Climbed Center' then 1 else 0 END) as "climbStateAvg"`,
    robotLeaveAvg: avg(match2024DataTable.robotLeave).as('robotLeaveAvg'),
    autoAmpScoredeAvg: avg(match2024DataTable.autoAmpScored).as(
      'autoAmpScoredAvg'
    ),
    autoSpeakerScoredeAvg: avg(match2024DataTable.autoSpeakerScored).as(
      'autoSpeakerScoredAvg'
    ),
    autoAmpMissedAvg: avg(match2024DataTable.autoAmpMissed).as(
      'autoAmpMissedAvg'
    ),
    autoSpeakerMissedeAvg: avg(match2024DataTable.autoSpeakerMissed).as(
      'autoSpeakerMissedAvg'
    ),
    teleAmpScoredeAvg: avg(match2024DataTable.teleAmpScored).as(
      'teleAmpScoredAvg'
    ),
    teleSpeakerScoredeAvg: avg(match2024DataTable.teleSpeakerScored).as(
      'teleSpeakerScoredAvg'
    ),
    teleAmpMissedeAvg: avg(match2024DataTable.teleAmpMissed).as(
      'teleAmpMissedAvg'
    ),
    teleSpeakerMissedeAvg: avg(match2024DataTable.ferry).as(
      'teleSpeakerMissedAvg'
    ),
    ferryAvg: avg(match2024DataTable.ferry).as('ferryAvg'),
    trapAvg: avg(match2024DataTable.trap).as('trapAvg'),
    harmonyAvg: avg(match2024DataTable.harmony).as('harmonyAvg'),

    driverAbilityAvg: avg(leader2024DataTable.driverAbility).as(
      'driverAbilityAvg'
    ),
    sourceTimeAvg: avg(leader2024DataTable.sourceTime).as('sourceTimeAvg'),
    ampTimeAvg: avg(leader2024DataTable.ampTime).as('ampTimeAvg'),

    operation: sql`concat(
                  case when (SUM(case "Leader2024Data"."Break" when 'Working'
                       then 1.0 else 0 end)) > 0 THEN 
                   Cast(round(SUM(case "Leader2024Data"."Break" when 'Working' then 1.0 else 0 end) 
                    / count(1),1) as varchar)
                  else '-' end  
                  ,
                  '/'
                  ,
                  case when (SUM(case "Leader2024Data"."Break" when 'Broken'
                       then 1.0 else 0 end)) > 0 THEN 
                   Cast(round(SUM(case "Leader2024Data"."Break" when 'Broken' then 1.0 else 0 end) 
                    / count(1),1) as varchar)
                  else '-' end  
                  ,
                  '/'
                  ,
                  case when (SUM(case "Leader2024Data"."Break" when 'Dead'
                       then 1.0 else 0 end)) > 0 THEN 
                   Cast(round(SUM(case "Leader2024Data"."Break" when 'Dead' then 1.0 else 0 end) 
                    / count(1),1) as varchar)
                  else '-' end  
                  ) as Operation`,

    role: sql`concat(
                  case when (SUM(case "Leader2024Data"."Class" when 'Offense'
                        then 1.0 else 0 end)) > 0 THEN 
                    cast(round(SUM(case "Leader2024Data"."Class" when 'Offense'
                      then 1.0 else 0 end)
                    / count(1),1) as varchar)
                  else '-' end  
                  ,
                  '/'
                  ,
                  case when (SUM(case "Leader2024Data"."Class" when 'Defense'
                        then 1.0 else 0 end)) > 0 THEN 
                    cast(round(SUM(case "Leader2024Data"."Class" when 'Defense'
                      then 1.0 else 0 end)
                    / count(1),1) as varchar)
                  else '-' end  
                  ,
                  '/'
                  ,
                  case when (SUM(case "Leader2024Data"."Class" when  'Ferry'
                        then 1.0 else 0 end)) > 0 THEN 
                    cast(round(SUM(case "Leader2024Data"."Class" when  'Ferry' then 1.0 else 0 end) 
                    / count(1),1) as varchar)
                  else '-' end  
                  ) as Role`,
  });
  //  blue team members
  const blueData = coreQuery
    .from(match2024DataTable)
    .leftJoin(
      leader2024DataTable,
      and(
        eq(match2024DataTable.eventId, leader2024DataTable.eventId),
        eq(match2024DataTable.matchType, leader2024DataTable.matchType),
        eq(match2024DataTable.matchNumber, leader2024DataTable.matchNumber),
        eq(match2024DataTable.teamNumber, leader2024DataTable.teamNumber)
      )
    )
    .where(
      and(
        eq(match2024DataTable.eventId, eventId),
        inArray(match2024DataTable.teamNumber, [
          blue1TeamNumber,
          blue2TeamNumber,
          blue3TeamNumber,
        ])
      )
    )
    .groupBy(match2024DataTable.eventId, match2024DataTable.teamNumber);

  //  red team members
  const redData = coreQuery
    .from(match2024DataTable)
    .leftJoin(
      leader2024DataTable,
      and(
        eq(match2024DataTable.eventId, leader2024DataTable.eventId),
        eq(match2024DataTable.matchType, leader2024DataTable.matchType),
        eq(match2024DataTable.matchNumber, leader2024DataTable.matchNumber),
        eq(match2024DataTable.teamNumber, leader2024DataTable.teamNumber)
      )
    )
    .where(
      and(
        eq(match2024DataTable.eventId, eventId),
        inArray(match2024DataTable.teamNumber, [
          red1TeamNumber,
          red2TeamNumber,
          red3TeamNumber,
        ])
      )
    )
    .groupBy(match2024DataTable.eventId, match2024DataTable.teamNumber);

  const query = await db
    .select({
      eventId: sql<string>`combined."Event_Id"`,
      teamNumber: sql<number>`combined."Team_Number"`,
      climbStateAvg: sql<number>`ROUND(combined."climbStateAvg", 1)`,
      robotLeaveAvg: sql<number>`ROUND(combined."robotLeaveAvg", 1)`,

      autoAmpScoredAvg: sql<number>`ROUND(combined."autoAmpScoredAvg", 1)`,
      autoSpeakerScoredAvg: sql<number>`ROUND(combined."autoSpeakerScoredAvg", 1)`,
      autoAmpMissedAvg: sql<number>`ROUND(combined."autoAmpMissedAvg", 1)`,
      autoSpeakerMissedAvg: sql<number>`ROUND(combined."autoSpeakerMissedAvg", 1)`,

      teleAmpScoredAvg: sql<number>`ROUND(combined."teleAmpScoredAvg", 1)`,
      teleSpeakerScoredAvg: sql<number>`ROUND(combined."teleSpeakerScoredAvg", 1)`,
      teleAmpMissedAvg: sql<number>`ROUND(combined."teleAmpMissedAvg", 1)`,
      teleSpeakerMissedAvg: sql<number>`ROUND(combined."teleSpeakerMissedAvg", 1)`,

      ferryAvg: sql<number>`ROUND(combined."ferryAvg", 1)`,
      trapAvg: sql<number>`ROUND(combined."trapAvg", 1)`,
      harmonyAvg: sql<number>`ROUND(combined."harmonyAvg", 1)`,
      driverAbilityAvg: sql<number>`ROUND(combined."driverAbilityAvg", 1)`,
      sourceTimeAvg: sql<number>`ROUND(combined."sourceTimeAvg", 1)`,
      ampTimeAvg: sql<number>`ROUND(combined."ampTimeAvg", 1)`,

      operation: sql<string>`combined."operation"`,
      role: sql<string>`combined."role"`,

      driveTrain: pit2024DataTable.driveTrain,
      humanPlayer: pit2024DataTable.humanPlayer,
      canLeave: pit2024DataTable.canLeave,
      canAutoAmp: pit2024DataTable.canAutoAmp,
      canAutoSpeaker: pit2024DataTable.canAutoSpeaker,
      contestMiddle: pit2024DataTable.contestMiddle,
      maxNotesAuto: pit2024DataTable.maxNotesAuto,
      canTeleAmp: pit2024DataTable.canTeleAmp,
      canTeleSpeaker: pit2024DataTable.canTeleSpeaker,
      canTrap: pit2024DataTable.canTrap,
      intakeLocation: pit2024DataTable.intakeLocation,
      scoringPref: pit2024DataTable.scoringPref,
      climbLocation: pit2024DataTable.climbLocation,
      climbHeight: pit2024DataTable.climbHeight,
      notableFeat: pit2024DataTable.notableFeat,
    })
    .from(sql`(${blueData} UNION ALL ${redData}) as combined`)
    .leftJoin(
      pit2024DataTable,
      and(
        sql`combined."Event_Id" = ${pit2024DataTable.eventId}`,
        sql`combined."Team_Number" = ${pit2024DataTable.teamNumber}`
      )
    );

  if (query.length > 0) {
    return query;
  } else {
    return [
      {
        eventId: eventId,
        teamNumber: red1TeamNumber,
        climbStateAvg: null,
        robotLeaveAvg: null,

        autoAmpScoredAvg: null,
        autoSpeakerScoredAvg: null,
        autoAmpMissedAvg: null,
        autoSpeakerMissedAvg: null,

        teleAmpScoredAvg: null,
        teleSpeakerScoredAvg: null,
        teleAmpMissedAvg: null,
        teleSpeakerMissedAvg: null,

        ferryAvg: null,
        trapAvg: null,
        harmonyAvg: null,
        driverAbilityAvg: null,
        sourceTimeAvg: null,
        ampTimeAvg: null,

        operation: null,
        role: null,
        driveTrain: null,
        humanPlayer: null,
        canLeave: null,
        canAutoAmp: null,
        canAutoSpeaker: null,
        contestMiddle: null,
        maxNotesAuto: null,
        canTeleAmp: null,
        canTeleSpeaker: null,
        canTrap: null,
        intakeLocation: null,
        scoringPref: null,
        climbLocation: null,
        climbHeight: null,
        notableFeat: null,
      },
    ];
  }
}
