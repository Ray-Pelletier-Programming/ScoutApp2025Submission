'use server';
import { drizzleClientHttp as db } from '@/db/client';
import { eq, sql, desc, lte, gt, and, max } from 'drizzle-orm';

import {
  EventMatches2025TbaResult,
  eventMatchesTable,
  EventMatchTeams2025Result,
  eventMatchTeamsTable,
  eventsTable,
  eventTeamsTable,
  match2025DataTable,
} from '../schema';
import { DcmpPrescoutData } from '../models/dcmp-prescout-data';
import { CmpPrescoutData } from '../models/cmp-prescout-data';

export async function get2025DcmpPrescoutList(
  jsonArrayString: string,
  dcmpDate: Date,
  matchType: string
): Promise<Array<DcmpPrescoutData>> {
  const cteScheuleQuery = db.$with('TeamScheduleMatches').as(
    db
      .select({
        startDate: eventsTable.startDate,
        eventMatchId: eventMatchTeamsTable.eventMatchId,
        eventName: eventsTable.eventName,
        eventCode: eventsTable.eventCode,
        matchNumber: eventMatchesTable.matchNumber,
        teamNumber: eventMatchTeamsTable.teamNumber,
        allianceColor: eventMatchTeamsTable.allianceColor,
        alliancePosition: eventMatchTeamsTable.alliancePosition,

        source: match2025DataTable.source,
        scoutName: match2025DataTable.scoutName,

        rank: sql<number>`ROW_NUMBER() OVER(PARTITION BY "EventMatchTeams"."Team_Number"
            ORDER by "Events"."Date_Start" desc, "EventMatches"."Match_Number" desc)`.as(
          'rank'
        ),
      })
      .from(eventMatchTeamsTable)
      .innerJoin(
        eventMatchesTable,
        eq(eventMatchTeamsTable.eventMatchId, eventMatchesTable.eventMatchId)
      )
      .innerJoin(
        eventsTable,
        eq(eventMatchesTable.eventId, eventsTable.eventId)
      )
      .leftJoin(
        match2025DataTable,
        and(
          eq(eventsTable.eventId, match2025DataTable.eventId),
          eq(eventMatchesTable.matchType, match2025DataTable.matchType),
          eq(eventMatchesTable.matchNumber, match2025DataTable.matchNumber),
          eq(eventMatchTeamsTable.teamNumber, match2025DataTable.teamNumber)
        )
      )
      .where(
        and(
          eq(eventsTable.season, dcmpDate.getFullYear()),
          eq(eventMatchesTable.matchType, matchType)
        )
      )
  );

  const teamsWithFutureEvents = db
    .select({
      teamNumber: eventTeamsTable.teamNumber,
      lastEventStartDate: max(eventsTable.startDate).as('lastEventStartDate'),
    })
    .from(eventsTable)
    .innerJoin(
      eventTeamsTable,
      eq(eventsTable.eventId, eventTeamsTable.eventId)
    )
    .where(lte(eventsTable.startDate, dcmpDate))
    .groupBy(eventTeamsTable.teamNumber)
    .as('teamsWithFutureEvents');

  const query = await db
    .with(cteScheuleQuery)
    .select({
      startDate: cteScheuleQuery.startDate,
      eventMatchId: cteScheuleQuery.eventMatchId,
      eventName: cteScheuleQuery.eventName,
      eventCode: cteScheuleQuery.eventCode,
      matchNumber: cteScheuleQuery.matchNumber,
      teamNumber: cteScheuleQuery.teamNumber,
      allianceColor: cteScheuleQuery.allianceColor,
      alliancePosition: cteScheuleQuery.alliancePosition,

      source: cteScheuleQuery.source,
      scoutName: cteScheuleQuery.scoutName,
      totalDcmpPoints: sql<number>`jsondata->>'totalDcmpPoints'`,
      dcmpLocked: sql<string>`jsondata->>'lockedStatus'`,
      lockedVal: sql<number>`jsondata->>'lockedVal'`,
      primarySort: sql<number>`jsondata->>'primarySort'`,
      hasUnplayedEvent: sql<boolean>`CASE WHEN ${teamsWithFutureEvents.lastEventStartDate} IS NOT NULL THEN true ELSE false END`,
      lastEventStartDate: teamsWithFutureEvents.lastEventStartDate,
    })
    .from(cteScheuleQuery)
    .innerJoin(
      sql`jsonb_array_elements(${jsonArrayString}::jsonb) as jsondata`,
      eq(
        cteScheuleQuery.teamNumber,
        sql`Cast(jsondata->>'teamNumber' AS SMALLINT)`
      )
    )
    .leftJoin(
      teamsWithFutureEvents,
      and(
        gt(teamsWithFutureEvents.lastEventStartDate, cteScheuleQuery.startDate),
        eq(teamsWithFutureEvents.teamNumber, cteScheuleQuery.teamNumber)
      )
    )

    .where(lte(cteScheuleQuery.rank, 6))
    .orderBy(
      desc(sql<number>`Cast(jsondata->>'primarySort' AS SMALLINT)`),
      desc(sql<number>`Cast(jsondata->>'totalDcmpPoints' AS SMALLINT)`),
      desc(sql<number>`Cast(jsondata->>'lockedVal' AS DECIMAL)`),
      desc(cteScheuleQuery.teamNumber),
      desc(cteScheuleQuery.eventMatchId)
    );

  //console.log(JSON.stringify(query));
  return query;
}

export async function get2025CmpPrescoutList(
  cmpDate: Date,
  season: number,
  eventCode: string,
  matchType: string
): Promise<Array<CmpPrescoutData>> {
  const cteScheuleQuery = db.$with('TeamScheduleMatches').as(
    db
      .select({
        startDate: eventsTable.startDate,
        eventMatchId: eventMatchTeamsTable.eventMatchId,
        eventName: eventsTable.eventName,
        eventCode: eventsTable.eventCode,
        matchNumber: eventMatchesTable.matchNumber,
        teamNumber: eventMatchTeamsTable.teamNumber,
        allianceColor: eventMatchTeamsTable.allianceColor,
        alliancePosition: eventMatchTeamsTable.alliancePosition,

        source: match2025DataTable.source,
        scoutName: match2025DataTable.scoutName,
        leave: EventMatchTeams2025Result.leave,
        endgame: EventMatchTeams2025Result.endgame,
        matchVideo:
          sql<string>`CASE "EventMatches2025TbaResult"."videoType" WHEN 'youtube' THEN concat('https://youtube.com/watch?v=', "EventMatches2025TbaResult"."videoKey")
        ELSE '' END`.as('matchVideo'),
        rank: sql<number>`ROW_NUMBER() OVER(PARTITION BY "EventMatchTeams"."Team_Number"
            ORDER by "Events"."Date_Start" desc, "EventMatches"."Match_Number" desc)`.as(
          'rank'
        ),
      })
      .from(eventMatchTeamsTable)
      .innerJoin(
        eventMatchesTable,
        eq(eventMatchTeamsTable.eventMatchId, eventMatchesTable.eventMatchId)
      )
      .innerJoin(
        eventsTable,
        eq(eventMatchesTable.eventId, eventsTable.eventId)
      )
      .leftJoin(
        match2025DataTable,
        and(
          eq(eventsTable.eventId, match2025DataTable.eventId),
          eq(eventMatchesTable.matchType, match2025DataTable.matchType),
          eq(eventMatchesTable.matchNumber, match2025DataTable.matchNumber),
          eq(eventMatchTeamsTable.teamNumber, match2025DataTable.teamNumber)
        )
      )
      .leftJoin(
        EventMatches2025TbaResult,
        eq(
          eventMatchesTable.eventMatchId,
          EventMatches2025TbaResult.eventMatchId
        )
      )
      .leftJoin(
        EventMatchTeams2025Result,
        and(
          eq(
            eventMatchesTable.eventMatchId,
            EventMatchTeams2025Result.eventMatchId
          ),
          eq(
            eventMatchTeamsTable.allianceColor,
            EventMatchTeams2025Result.allianceColor
          ),
          eq(
            eventMatchTeamsTable.alliancePosition,
            EventMatchTeams2025Result.alliancePosition
          )
        )
      )
      .where(
        and(
          eq(eventsTable.season, season),
          eq(eventMatchesTable.matchType, matchType)
        )
      )
  );

  const teamsWithFutureEvents = db
    .select({
      teamNumber: eventTeamsTable.teamNumber,
      lastEventStartDate: max(eventsTable.startDate).as('lastEventStartDate'),
    })
    .from(eventsTable)
    .innerJoin(
      eventTeamsTable,
      eq(eventsTable.eventId, eventTeamsTable.eventId)
    )
    .where(lte(eventsTable.startDate, cmpDate))
    .groupBy(eventTeamsTable.teamNumber)
    .as('teamsWithFutureEvents');

  const query = await db
    .with(cteScheuleQuery)
    .select({
      startDate: cteScheuleQuery.startDate,
      eventMatchId: cteScheuleQuery.eventMatchId,
      eventName: cteScheuleQuery.eventName,
      eventCode: cteScheuleQuery.eventCode,
      matchNumber: cteScheuleQuery.matchNumber,
      teamNumber: cteScheuleQuery.teamNumber,
      allianceColor: cteScheuleQuery.allianceColor,
      alliancePosition: cteScheuleQuery.alliancePosition,

      source: cteScheuleQuery.source,
      scoutName: cteScheuleQuery.scoutName,
      lastEventStartDate: teamsWithFutureEvents.lastEventStartDate,
      leave: cteScheuleQuery.leave,
      endgame: cteScheuleQuery.endgame,
      matchVideo: cteScheuleQuery.matchVideo,
    })
    .from(cteScheuleQuery)
    .innerJoin(
      eventTeamsTable,
      and(
        eq(cteScheuleQuery.teamNumber, eventTeamsTable.teamNumber),
        eq(eventTeamsTable.eventId, `${season}${eventCode}`)
      )
    )
    .leftJoin(
      teamsWithFutureEvents,
      and(
        gt(teamsWithFutureEvents.lastEventStartDate, cteScheuleQuery.startDate),
        eq(teamsWithFutureEvents.teamNumber, cteScheuleQuery.teamNumber)
      )
    )

    .where(lte(cteScheuleQuery.rank, 6))
    .orderBy(
      desc(cteScheuleQuery.teamNumber),
      desc(cteScheuleQuery.eventMatchId)
    );

  console.log(JSON.stringify(query));
  return query;
}
