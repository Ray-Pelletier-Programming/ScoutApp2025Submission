// https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { eq, desc } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  InsertEvent,
  SelectEvent,
  eventTeamsTable,
  eventsTable,
} from '@/db/schema';
import { EventTeam } from '../models/event-team';

export interface Event {
  eventId: string;
  season: number;
  eventCode: string;
  eventName: string;
  startDate: Date;
  teams: EventTeam[] | undefined;
}

export interface FullEvent {
  eventId: string;
  season: number;
  eventCode: string;
  eventName: string;
  startDate: Date;
  endDate: Date;
  districtCode: string | null;
  divisionCode: string | null;
  eventType: string | null;
  teams: EventTeam[] | undefined;
}

export async function getEventsForSeason(
  season: SelectEvent['season']
): Promise<Array<Event>> {
  const query = await db
    .select({
      eventId: eventsTable.eventId,
      season: eventsTable.season,
      eventCode: eventsTable.eventCode,
      eventName: eventsTable.eventName,
      startDate: eventsTable.startDate,
    })
    .from(eventsTable)
    .where(eq(eventsTable.season, season))
    .orderBy(desc(eventsTable.startDate), eventsTable.eventName);
  return query.map((event) => ({
    ...event,
    teams: undefined, // Add default value for teams
  }));
}

export async function getEventById(
  eventId: SelectEvent['eventId']
): Promise<Array<Event>> {
  const query = await db
    .select({
      eventId: eventsTable.eventId,
      season: eventsTable.season,
      eventCode: eventsTable.eventCode,
      eventName: eventsTable.eventName,
      startDate: eventsTable.startDate,
      // teams will be added later in the mapping step
    })
    .from(eventsTable)
    .where(eq(eventsTable.eventId, eventId));

  return query.map((event) => ({
    ...event,
    teams: undefined, // Add default value for teams
  }));
}

export async function addEvent(data: InsertEvent): Promise<Event> {
  const query = await db
    .insert(eventsTable)
    .values(data)
    .returning()
    .onConflictDoNothing();
  return {
    ...query[0],
    teams: undefined, // Add default value for teams
  };
}

export async function getEventTeamNumbers(
  season: SelectEvent['season'],
  eventId: SelectEvent['eventId']
): Promise<Array<{ teamNumber: number }>> {
  return await db
    .select({ teamNumber: eventTeamsTable.teamNumber })
    .from(eventTeamsTable)
    .where(eq(eventTeamsTable.eventId, eventId));
}

export async function getFullEventById(
  eventId: SelectEvent['eventId']
): Promise<Array<FullEvent>> {
  const query = await db
    .select({
      eventId: eventsTable.eventId,
      season: eventsTable.season,
      eventCode: eventsTable.eventCode,
      eventName: eventsTable.eventName,
      startDate: eventsTable.startDate,
      endDate: eventsTable.endDate,
      districtCode: eventsTable.districtCode,
      divisionCode: eventsTable.divisionCode,
      eventType: eventsTable.eventType,
      // teams will be added later in the mapping step
    })
    .from(eventsTable)
    .where(eq(eventsTable.eventId, eventId));

  return query.map((event) => ({
    ...event,
    teams: undefined, // Add default value for teams
  }));
}
