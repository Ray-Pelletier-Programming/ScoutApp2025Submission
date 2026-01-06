'use server';

import { EventTeam } from '@/db/models/event-team';
import { getEventById, Event, addEvent } from '@/db/queries/event-queries';
import {
  addEventTeams,
  getEventTeams,
  deleteEventTeams,
} from '@/db/queries/event-team-queries';
import { InsertEvent, InsertEventTeam } from '@/db/schema';

export async function getEventTeamList(event_id: string) {
  return getEventTeams(event_id);
}

export async function getEventForId(event_id: string) {
  return getEventById(event_id);
}

export async function saveManualEvent(event: Event, teamList: EventTeam[]) {
  const newEvent: InsertEvent = {
    eventId: event.eventId,
    season: event.season,
    eventCode: event.eventCode,
    eventName: event.eventName,
    eventType: 'Offseason',
    districtCode: null,
    divisionCode: null,
    startDate: event.startDate,
    endDate: event.startDate,
  };

  // create the event
  await addEvent(newEvent);

  const newEventTeams: InsertEventTeam[] = teamList
    .filter((e) => e.teamNumber != null)
    .map((team) => ({
      eventId: event.eventId,
      teamNumber: team.teamNumber!,
    }));

  // add the teams to the event
  await deleteEventTeams(event.eventId);
  await addEventTeams(newEventTeams);
}
