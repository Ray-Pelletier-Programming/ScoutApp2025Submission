'use server';

import { matchTypes } from '@/app/ui/constants/match-type';
import { resetSingleEventMatch } from '@/db/queries/admin-queries';
import { addEvent, getEventById } from '@/db/queries/event-queries';
import { addEventTeams } from '@/db/queries/event-team-queries';
import { InsertEvent, InsertEventTeam, SelectEventTeam } from '@/db/schema';
import { dataSyncMode } from '@/util/envHelper';

export async function haveEventData(event_id: string) {
  return getEventById(event_id);
}

interface Team {
  teamNumber: number;
}

interface EventTeams {
  teams: Team[];
}

async function getFrcEventTeamsFromApi(season: string, eventCode: string) {
  const vals = process.env.FRCAPI_User + ':' + process.env.FRCAPI_Pass;
  const token = Buffer.from(vals).toString('base64');

  const response = await fetch(
    `https://frc-api.firstinspires.org/v3.0/${season}/teams?eventCode=${eventCode}`,
    {
      method: 'GET',
      headers: {
        //'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
      //body: JSON.stringify({ comment }),
    }
  );
  if (response.status !== 200) {
    console.log('Error fetching team data:', response.text());
    return false;
  }
  const result = await response.json();
  if (result.teamCountTotal > 0) {
    // build array from result.teams
    const teamData: InsertEventTeam[] = (result as EventTeams).teams.map(
      ({ teamNumber }: Team) => ({
        eventId: season + eventCode.toUpperCase(),
        teamNumber: teamNumber,
      })
    ); // no error

    await addEventTeams(teamData);
    return true;

    //console.log(event);
  } else {
    console.log('Event not found.');
    return false;
  }
}

async function getFrcEvent(season: string, eventCode: string) {
  const vals = process.env.FRCAPI_User + ':' + process.env.FRCAPI_Pass;
  const token = Buffer.from(vals).toString('base64');

  const response = await fetch(
    `https://frc-api.firstinspires.org/v3.0/${season}/events/${eventCode}`,
    {
      method: 'GET',
      headers: {
        //'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
      //body: JSON.stringify({ comment }),
    }
  );
  if (response.status !== 200) {
    console.log('Error fetching event data:', response.text());
    return false;
  }
  const result = await response.json();
  if (result.eventCount > 0) {
    const event = result.Events[0];

    const newEvent: InsertEvent = {
      eventId: season + event.code,
      season: parseInt(season),
      eventCode: event.code,
      eventName: event.name,
      eventType: event.type,
      districtCode: event.districtCode,
      divisionCode: event.divisionCode,
      startDate: new Date(event.dateStart),
      endDate: new Date(event.dateEnd),
    };

    await addEvent(newEvent);

    return true;

    //console.log(event);
  } else {
    console.log('Event not found.');
    return false;
  }
}

export async function pullFrcEventWithTeamsFromApi(
  season: string,
  eventCode: string
) {
  // if we are running in the cloud, get the schedule from the FMS API
  const gotEvent = await getFrcEvent(season, eventCode);
  if (!gotEvent) {
    console.log('Event not found.');
    return false;
  }

  // now get teams...
  return await getFrcEventTeamsFromApi(season, eventCode);
}

export async function pullEventFromApi(season: string, eventCode: string) {
  let gotEvent;

  if (dataSyncMode === 'fms') {
    gotEvent = await pullFrcEventWithTeamsFromApi(season, eventCode);
  } else {
    // otherwise call PREVIEW or PROD env Daisy Scout Api
    //TODO: need remot API call top get data...
    gotEvent = await getRemoteEvent(season, eventCode);
  }

  if (gotEvent) {
    //console.log(event);
    return true;
  } else {
    console.log('Event not found.');
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resetMatch(prevState: any, formData: FormData) {
  const match = formData.get('matchNum');
  const eventId = formData.get('eventId');

  if (!match || !eventId) {
    return;
  }

  return await resetSingleEventMatch(
    eventId!.toString(),
    matchTypes.qual,
    parseInt(match!.toString())
  );
}

export async function getRemoteEvent(season: string, eventCode: string) {
  const eventId = season + eventCode.toUpperCase();

  // dataSyncMode === 'prod'
  let url = `https://daisy-scout-web.vercel.app/api/events/${eventId}/full-details`;
  if (dataSyncMode === 'preview') {
    url = `https://daisy-scout-web-tgeorge73-tgeorge73s-projects.vercel.app/api/events/${eventId}/full-details`;
  }

  console.log(`fetching from cloud ${url}`);

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.status !== 200) {
    console.log('Error fetching schedule for event:', response.text());
    return false;
  }

  const result = await response.json();

  console.log(result);

  if (result) {
    const data: InsertEvent = {
      eventId: result.eventId,
      season: result.season,
      eventCode: result.eventCode,
      eventName: result.eventName,
      eventType: result.eventType,
      districtCode: result.districtCode,
      divisionCode: result.divisionCode,
      startDate: new Date(result.startDate),
      endDate: new Date(result.endDate),
    };

    await addEvent(data);

    const teamData: InsertEventTeam[] = result.teams.map(
      (team: SelectEventTeam) => ({
        eventId: team.eventId,
        teamNumber: team.teamNumber,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        syncedAt: team.syncedAt,
      })
    ); // no error

    console.log(teamData);

    await addEventTeams(teamData);
    return true;
    //console.log(event);
  } else {
    console.log('Event not found.');
    return false;
  }
}
