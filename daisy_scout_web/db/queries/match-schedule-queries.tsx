//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { eq, and, sql } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  InsertEventMatch,
  InsertEventMatchTeam,
  SelectEventMatch,
  eventMatchTeamsTable,
  eventMatchesTable,
  eventsTable,
} from '@/db/schema';
import { alias } from 'drizzle-orm/pg-core';
import { EventMatch } from '../models/event-match';
import {
  EventMatchHierarchy,
  EventMatchHierarchyTeam,
} from '../models/event-match-hierarchy';

export async function getSingleEventMatchForEvent(
  eventId: SelectEventMatch['eventId'],
  matchType: SelectEventMatch['matchType'],
  matchNumber: SelectEventMatch['matchNumber']
): Promise<EventMatch> {
  const blueTeam1Alias = alias(eventMatchTeamsTable, 'blueTeam1');
  const blueTeam2Alias = alias(eventMatchTeamsTable, 'blueTeam2');
  const blueTeam3Alias = alias(eventMatchTeamsTable, 'blueTeam3');
  const redTeam1Alias = alias(eventMatchTeamsTable, 'redTeam1');
  const redTeam2Alias = alias(eventMatchTeamsTable, 'redTeam2');
  const redTeam3Alias = alias(eventMatchTeamsTable, 'redTeam3');

  const query = await db
    .select({
      eventMatchId: eventMatchesTable.eventMatchId,
      eventId: eventMatchesTable.eventId,
      matchType: eventMatchesTable.matchType,
      matchNumber: eventMatchesTable.matchNumber,
      blue1: blueTeam1Alias.teamNumber,
      blue2: blueTeam2Alias.teamNumber,
      blue3: blueTeam3Alias.teamNumber,
      red1: redTeam1Alias.teamNumber,
      red2: redTeam2Alias.teamNumber,
      red3: redTeam3Alias.teamNumber,
      allEvents: sql<boolean>`false`,
      scheduledStartTime: eventMatchesTable.scheduledStartTime,
    })
    .from(eventMatchesTable)
    .innerJoin(eventsTable, eq(eventMatchesTable.eventId, eventsTable.eventId))
    .innerJoin(
      blueTeam1Alias,
      and(
        eq(eventMatchesTable.eventMatchId, blueTeam1Alias.eventMatchId),
        eq(blueTeam1Alias.allianceColor, 'b'),
        eq(blueTeam1Alias.alliancePosition, 1)
      )
    )
    .innerJoin(
      blueTeam2Alias,
      and(
        eq(eventMatchesTable.eventMatchId, blueTeam2Alias.eventMatchId),
        eq(blueTeam2Alias.allianceColor, 'b'),
        eq(blueTeam2Alias.alliancePosition, 2)
      )
    )
    .innerJoin(
      blueTeam3Alias,
      and(
        eq(eventMatchesTable.eventMatchId, blueTeam3Alias.eventMatchId),
        eq(blueTeam3Alias.allianceColor, 'b'),
        eq(blueTeam3Alias.alliancePosition, 3)
      )
    )
    .innerJoin(
      redTeam1Alias,
      and(
        eq(eventMatchesTable.eventMatchId, redTeam1Alias.eventMatchId),
        eq(redTeam1Alias.allianceColor, 'r'),
        eq(redTeam1Alias.alliancePosition, 1)
      )
    )
    .innerJoin(
      redTeam2Alias,
      and(
        eq(eventMatchesTable.eventMatchId, redTeam2Alias.eventMatchId),
        eq(redTeam2Alias.allianceColor, 'r'),
        eq(redTeam2Alias.alliancePosition, 2)
      )
    )
    .innerJoin(
      redTeam3Alias,
      and(
        eq(eventMatchesTable.eventMatchId, redTeam3Alias.eventMatchId),
        eq(redTeam3Alias.allianceColor, 'r'),
        eq(redTeam3Alias.alliancePosition, 3)
      )
    )
    .where(
      and(
        eq(eventMatchesTable.eventId, eventId),
        eq(eventMatchesTable.matchNumber, matchNumber),
        eq(eventMatchesTable.matchType, matchType)
      )
    )
    .orderBy(eventMatchesTable.matchType, eventMatchesTable.matchNumber)
    .limit(1);

  if (query.length > 0) {
    return query[0];
  } else {
    return {
      eventMatchId: '',
      eventId: eventId,
      matchType: matchType,
      matchNumber: matchNumber,
      blue1: null,
      blue2: null,
      blue3: null,
      red1: null,
      red2: null,
      red3: null,
      allEvents: undefined,
      scheduledStartTime: null,
    };
  }
}

export async function getEventMatchesForEvent({
  eventId,
  matchType,
}: {
  eventId: SelectEventMatch['eventId'];
  matchType: SelectEventMatch['matchType'];
}): Promise<Array<EventMatch>> {
  const blueTeam1Alias = alias(eventMatchTeamsTable, 'blueTeam1');
  const blueTeam2Alias = alias(eventMatchTeamsTable, 'blueTeam2');
  const blueTeam3Alias = alias(eventMatchTeamsTable, 'blueTeam3');
  const redTeam1Alias = alias(eventMatchTeamsTable, 'redTeam1');
  const redTeam2Alias = alias(eventMatchTeamsTable, 'redTeam2');
  const redTeam3Alias = alias(eventMatchTeamsTable, 'redTeam3');

  const query = await db
    .select({
      eventMatchId: eventMatchesTable.eventMatchId,
      eventId: eventMatchesTable.eventId,
      matchType: eventMatchesTable.matchType,
      matchNumber: eventMatchesTable.matchNumber,
      blue1: blueTeam1Alias.teamNumber,
      blue2: blueTeam2Alias.teamNumber,
      blue3: blueTeam3Alias.teamNumber,
      red1: redTeam1Alias.teamNumber,
      red2: redTeam2Alias.teamNumber,
      red3: redTeam3Alias.teamNumber,
      allEvents: sql<boolean>`false`,
      scheduledStartTime: eventMatchesTable.scheduledStartTime,
    })
    .from(eventMatchesTable)
    .innerJoin(eventsTable, eq(eventMatchesTable.eventId, eventsTable.eventId))
    .innerJoin(
      blueTeam1Alias,
      and(
        eq(eventMatchesTable.eventMatchId, blueTeam1Alias.eventMatchId),
        eq(blueTeam1Alias.allianceColor, 'b'),
        eq(blueTeam1Alias.alliancePosition, 1)
      )
    )
    .innerJoin(
      blueTeam2Alias,
      and(
        eq(eventMatchesTable.eventMatchId, blueTeam2Alias.eventMatchId),
        eq(blueTeam2Alias.allianceColor, 'b'),
        eq(blueTeam2Alias.alliancePosition, 2)
      )
    )
    .innerJoin(
      blueTeam3Alias,
      and(
        eq(eventMatchesTable.eventMatchId, blueTeam3Alias.eventMatchId),
        eq(blueTeam3Alias.allianceColor, 'b'),
        eq(blueTeam3Alias.alliancePosition, 3)
      )
    )
    .innerJoin(
      redTeam1Alias,
      and(
        eq(eventMatchesTable.eventMatchId, redTeam1Alias.eventMatchId),
        eq(redTeam1Alias.allianceColor, 'r'),
        eq(redTeam1Alias.alliancePosition, 1)
      )
    )
    .innerJoin(
      redTeam2Alias,
      and(
        eq(eventMatchesTable.eventMatchId, redTeam2Alias.eventMatchId),
        eq(redTeam2Alias.allianceColor, 'r'),
        eq(redTeam2Alias.alliancePosition, 2)
      )
    )
    .innerJoin(
      redTeam3Alias,
      and(
        eq(eventMatchesTable.eventMatchId, redTeam3Alias.eventMatchId),
        eq(redTeam3Alias.allianceColor, 'r'),
        eq(redTeam3Alias.alliancePosition, 3)
      )
    )
    .where(
      and(
        eq(eventMatchesTable.eventId, eventId),
        eq(eventMatchesTable.matchType, matchType)
      )
    )
    .orderBy(eventMatchesTable.matchType, eventMatchesTable.matchNumber);
  return query;
}

export async function getEventMatchesWithTeamsForEvent({
  eventId,
  matchType,
}: {
  eventId: SelectEventMatch['eventId'];
  matchType: SelectEventMatch['matchType'];
}): Promise<Array<EventMatchHierarchy>> {
  const events = await db
    .select({
      eventMatchId: eventMatchesTable.eventMatchId,
      eventId: eventMatchesTable.eventId,
      matchType: eventMatchesTable.matchType,
      matchNumber: eventMatchesTable.matchNumber,
      scheduledStartTime: eventMatchesTable.scheduledStartTime,
    })
    .from(eventMatchesTable)
    .innerJoin(eventsTable, eq(eventMatchesTable.eventId, eventsTable.eventId))
    .where(
      and(
        eq(eventMatchesTable.eventId, eventId),
        eq(eventMatchesTable.matchType, matchType)
      )
    )
    .orderBy(eventMatchesTable.matchType, eventMatchesTable.matchNumber);

  const teams = await db
    .select({
      eventMatchId: eventMatchesTable.eventMatchId,
      allianceColor: eventMatchTeamsTable.allianceColor,
      alliancePosition: eventMatchTeamsTable.alliancePosition,
      teamNumber: eventMatchTeamsTable.teamNumber,
    })
    .from(eventMatchesTable)
    .innerJoin(
      eventMatchTeamsTable,
      eq(eventMatchesTable.eventMatchId, eventMatchTeamsTable.eventMatchId)
    )
    .where(
      and(
        eq(eventMatchesTable.eventId, eventId),
        eq(eventMatchesTable.matchType, matchType)
      )
    )
    .orderBy(
      eventMatchesTable.matchType,
      eventMatchesTable.matchNumber,
      eventMatchTeamsTable.allianceColor,
      eventMatchTeamsTable.alliancePosition
    );

  return constructEventMatchHierarchy(
    events.map((event) => ({ ...event, teams: [] })), // append missing collection to events...
    teams
  );
}

function constructEventMatchHierarchy(
  matches: EventMatchHierarchy[],
  teams: EventMatchHierarchyTeam[]
): EventMatchHierarchy[] {
  // Create a map to group teams by eventMatchId
  const teamsByMatchId = teams.reduce(
    (acc, team) => {
      if (!acc[team.eventMatchId]) {
        acc[team.eventMatchId] = [];
      }
      acc[team.eventMatchId].push(team);
      return acc;
    },
    {} as Record<string, EventMatchHierarchyTeam[]>
  );

  // Map over matches and attach the corresponding teams
  return matches.map((match) => ({
    ...match,
    teams: teamsByMatchId[match.eventMatchId] || [], // Attach teams or an empty array if none exist
  }));
}

export async function getEventMatch(
  eventMatchId: SelectEventMatch['eventMatchId']
): Promise<
  Array<{
    eventMatchId: string;
    eventId: string;
    matchType: string;
    matchNumber: number;
  }>
> {
  const query = await db
    .select({
      eventMatchId: eventMatchesTable.eventMatchId,
      eventId: eventMatchesTable.eventId,
      matchType: eventMatchesTable.matchType,
      matchNumber: eventMatchesTable.matchNumber,
    })
    .from(eventMatchesTable)
    .innerJoin(eventsTable, eq(eventMatchesTable.eventId, eventsTable.eventId))
    .where(eq(eventMatchesTable.eventMatchId, eventMatchId));
  return query;
}

export async function addEventSchedule(
  data: InsertEventMatch[]
): Promise<void> {
  await db
    .insert(eventMatchesTable)
    .values(data)
    .returning()
    .onConflictDoNothing();
}

export async function addEventScheduleTeams(
  data: InsertEventMatchTeam[]
): Promise<void> {
  await db
    .insert(eventMatchTeamsTable)
    .values(data)
    .returning()
    .onConflictDoNothing();
}

export async function UpsertEventScheduleTeams(
  data: InsertEventMatchTeam[]
): Promise<void> {
  await db
    .insert(eventMatchTeamsTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [
        eventMatchTeamsTable.eventMatchId,
        eventMatchTeamsTable.allianceColor,
        eventMatchTeamsTable.alliancePosition,
      ],
      set: {
        teamNumber: sql.raw(`excluded."Team_Number"`),
      },
    });
}
