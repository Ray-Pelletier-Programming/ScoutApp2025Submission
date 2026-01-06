import { drizzleClientHttp as db } from '@/db/client';
import {
  EventMatches2025Result,
  EventMatches2025TbaResult,
  eventMatchesTable,
  eventsTable,
  eventTeamsTable,
  leader2025DataTable,
  match2025DataTable,
} from '@/db/schema';
import { and, eq, max, sql } from 'drizzle-orm';

//TODO: make season agnostic
export async function resetSingleEventMatch(
  eventId: string,
  matchType: string,
  matchNum: number
): Promise<void> {
  await db
    .update(match2025DataTable)
    .set({ matchType: 'replay' })
    .where(
      and(
        eq(match2025DataTable.eventId, eventId),
        eq(match2025DataTable.matchType, matchType),
        eq(match2025DataTable.matchNumber, matchNum)
      )
    )
    .execute();

  await db
    .update(leader2025DataTable)
    .set({ matchType: 'replay' })
    .where(
      and(
        eq(leader2025DataTable.eventId, eventId),
        eq(leader2025DataTable.matchType, matchType),
        eq(leader2025DataTable.matchNumber, matchNum)
      )
    )
    .execute();

  return;
}

export async function getDb2025EventStatsForSeason(): Promise<EventStats[]> {
  const eventTeamStatsQuery = db
    .select({
      eventId: eventTeamsTable.eventId,
      numTeams: sql<number>`count(1)`.as('numTeams'),
      lastTeamAdd: max(eventTeamsTable.createdAt).as('lastTeamAdd'),
    })
    .from(eventTeamsTable)
    .groupBy(eventTeamsTable.eventId)
    .as('eventTeamStats');

  const eventMatchStatsQuery = db
    .select({
      eventId: eventMatchesTable.eventId,
      numMatches: sql<number>`count(1)`.as('numMatches'),
      lastMatchAdd: max(eventMatchesTable.createdAt).as('lastMatchAdd'),
    })
    .from(eventMatchesTable)
    .groupBy(eventMatchesTable.eventId)
    .as('eventMatchStats');

  const eventMatchResultStatsQuery = db
    .select({
      eventId: eventMatchesTable.eventId,
      numMatchResults: sql<number>`count(1)`.as('numMatchResults'),
      lastResultAdd: max(EventMatches2025Result.createdAt).as('lastResultAdd'),
    })
    .from(eventMatchesTable)
    .innerJoin(
      EventMatches2025Result,
      eq(eventMatchesTable.eventMatchId, EventMatches2025Result.eventMatchId)
    )
    .groupBy(eventMatchesTable.eventId)
    .as('eventMatchResultStats');

  const eventMatchTbaResultStatsQuery = db
    .select({
      eventId: eventMatchesTable.eventId,
      numMatchResults: sql<number>`count(1)`.as('numTbaMatchResults'),
      lastResultAdd: max(EventMatches2025TbaResult.createdAt).as(
        'lastTbaResultAdd'
      ),
    })
    .from(eventMatchesTable)
    .innerJoin(
      EventMatches2025TbaResult,
      eq(eventMatchesTable.eventMatchId, EventMatches2025TbaResult.eventMatchId)
    )
    .groupBy(eventMatchesTable.eventId)
    .as('eventMatchTbaResultStats');

  return await db
    .select({
      eventId: eventsTable.eventId,
      season: eventsTable.season,
      startDate: eventsTable.startDate,
      eventCode: eventsTable.eventCode,
      eventName: eventsTable.eventName,
      numTeams: eventTeamStatsQuery.numTeams,
      lastTeamAdd: eventTeamStatsQuery.lastTeamAdd,
      numMatches: eventMatchStatsQuery.numMatches,
      lastMatchAdd: eventMatchStatsQuery.lastMatchAdd,
      numMatchResults: eventMatchResultStatsQuery.numMatchResults,
      lastResultAdd: eventMatchResultStatsQuery.lastResultAdd,
      numMatchTbaResults: eventMatchTbaResultStatsQuery.numMatchResults,
      lastTbaResultAdd: eventMatchTbaResultStatsQuery.lastResultAdd,
    })
    .from(eventsTable)
    .leftJoin(
      eventTeamStatsQuery,
      eq(eventsTable.eventId, eventTeamStatsQuery.eventId)
    )
    .leftJoin(
      eventMatchStatsQuery,
      eq(eventsTable.eventId, eventMatchStatsQuery.eventId)
    )
    .leftJoin(
      eventMatchResultStatsQuery,
      eq(eventsTable.eventId, eventMatchResultStatsQuery.eventId)
    )
    .leftJoin(
      eventMatchTbaResultStatsQuery,
      eq(eventsTable.eventId, eventMatchTbaResultStatsQuery.eventId)
    )
    .where(eq(eventsTable.season, 2025))
    .execute();
}

export type EventStats = {
  eventId: string;
  season: number;
  eventCode: string;
  eventName: string;
  startDate: Date;
  numTeams: number | null;
  lastTeamAdd: Date | null;
  numMatches: number | null;
  lastMatchAdd: Date | null;
  numMatchResults: number | null;
  lastResultAdd: Date | null;
};
