//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { eq } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  SelectEventMatch,
  eventMatchTeamsTable,
  eventTeamsTable,
  InsertEventTeam,
} from '@/db/schema';
import { EventTeam } from '../models/event-team';

export async function getEventTeams(eventId: string): Promise<EventTeam[]> {
  const query = await db
    .select({
      eventId: eventTeamsTable.eventId,
      teamNumber: eventTeamsTable.teamNumber,
    })
    .from(eventTeamsTable)
    .where(eq(eventTeamsTable.eventId, eventId))
    .orderBy(eventTeamsTable.teamNumber);

  return query;
}

export async function getEventMatchTeams(
  eventMatchId: SelectEventMatch['eventMatchId']
): Promise<
  Array<{
    eventMatchId: string;
    allianceColor: string;
    alliancePosition: number;
    teamNumber: number;
  }>
> {
  const query = await db
    .select({
      eventMatchId: eventMatchTeamsTable.eventMatchId,
      allianceColor: eventMatchTeamsTable.allianceColor,
      alliancePosition: eventMatchTeamsTable.alliancePosition,
      teamNumber: eventMatchTeamsTable.teamNumber,
    })
    .from(eventMatchTeamsTable)
    .where(eq(eventMatchTeamsTable.eventMatchId, eventMatchId))
    .orderBy(
      eventMatchTeamsTable.allianceColor,
      eventMatchTeamsTable.alliancePosition
    );

  return query;
}

export async function addEventTeams(
  teamData: InsertEventTeam[]
): Promise<void> {
  if (teamData.length === 0) {
    // was because was getting page 2 when no page 2
    // CMP Divisions require a page 2 t o get all the
    // teams
    console.log('No team data to insert.');
    return;
  }
  await db.insert(eventTeamsTable).values(teamData).onConflictDoNothing();
}

export async function deleteEventTeams(eventId: string): Promise<void> {
  await db
    .delete(eventTeamsTable)
    .where(eq(eventTeamsTable.eventId, eventId))
    .execute();
}
