'use server';

import { matchTypes } from '@/app/ui/constants/match-type';
import {
  addEventSchedule,
  addEventScheduleTeams,
  getEventMatchesForEvent,
} from '@/db/queries/match-schedule-queries';
import { InsertEventMatch, InsertEventMatchTeam } from '@/db/schema';
import { dataSyncMode } from '@/util/envHelper';

export async function getEventMatchSchedule(
  event_id: string,
  matchType: string
) {
  return getEventMatchesForEvent({ eventId: event_id, matchType: matchType });
}

interface EventTeam {
  teamNumber: number;
  allianceColor: string;
  alliancePosition: number;
  eventMatchId: string;
}

interface EventMatch {
  matchNumber: string;
  startTime: Date;
  teams: EventTeam[];
}

interface Team {
  teamNumber: number;
  station: string;
}

interface Match {
  matchNumber: string;
  startTime: Date;
  teams: Team[];
}

interface Schedule {
  Schedule: Match[];
}

// Called from event Schedule page if no schedule is loaded for event and button is clicked
// called from db-stats page for pulling schedule for a single event
// called from db-stats page as part of cmptx load action
export async function pullScheduleFromApi(season: string, eventCode: string) {
  let gotEvent;

  if (dataSyncMode === 'fms') {
    // if we are running in the cloud, get the schedule from the FMS API
    gotEvent = await getFrcApiEventSchedule(season, eventCode);
  } else {
    // otherwise call PREVIEW or PROD env Daisy Scout Api
    gotEvent = await getRemoteEventSchedule(season, eventCode);
  }

  // if we got a schedule, then get the event match schedule
  // and return it
  if (gotEvent) {
    return getEventMatchSchedule(
      season + eventCode.toUpperCase(),
      matchTypes.qual
    );
  } else {
    return [];
  }
}

export async function getFrcApiEventSchedule(
  season: string,
  eventCode: string
) {
  const eventId = season + eventCode.toUpperCase();
  const vals = process.env.FRCAPI_User + ':' + process.env.FRCAPI_Pass;
  const token = Buffer.from(vals).toString('base64');
  console.log(
    `https://frc-api.firstinspires.org/v3.0/${season}/schedule/${eventCode}?tournamentLevel=${matchTypes.qual}`
  );
  const response = await fetch(
    `https://frc-api.firstinspires.org/v3.0/${season}/schedule/${eventCode}?tournamentLevel=${matchTypes.qual}`,
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
    console.log('Error fetching schedule for event:', response.text());
    return false;
  }

  const result = await response.json();

  if (result.Schedule.length > 0) {
    const data: InsertEventMatch[] = result.Schedule.map(
      (s: { matchNumber: string; startTime: Date }) => ({
        eventMatchId:
          eventId + matchTypes.qual + s.matchNumber.toString().padStart(3, '0'),
        eventId: eventId,
        matchType: matchTypes.qual,
        matchNumber: s.matchNumber,
        scheduledStartTime: new Date(s.startTime),
      })
    ); // no error

    await addEventSchedule(data);

    const teamData: InsertEventMatchTeam[] = (
      result as Schedule
    ).Schedule.flatMap((match: Match) =>
      match.teams.map(({ teamNumber, station }: Team) => ({
        eventMatchId:
          eventId +
          matchTypes.qual +
          match.matchNumber.toString().padStart(3, '0'),
        allianceColor: station.includes('Red') ? 'r' : 'b',
        alliancePosition: parseInt(
          station.substring(station.length - 1, station.length)
        ),
        teamNumber: teamNumber,
      }))
    ); // no error

    await addEventScheduleTeams(teamData);
    return true;
    //console.log(event);
  } else {
    console.log('Event not found.');
    return false;
  }
}

export async function getRemoteEventSchedule(
  season: string,
  eventCode: string
) {
  const eventId = season + eventCode.toUpperCase();

  // dataSyncMode === 'prod'
  let url = `https://daisy-scout-web.vercel.app/api/events/${eventId}/match-schedule-json`;
  if (dataSyncMode === 'preview') {
    url = `https://daisy-scout-web-tgeorge73-tgeorge73s-projects.vercel.app/api/events/${eventId}/match-schedule-json`;
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

  if (result.length > 0) {
    const data: InsertEventMatch[] = result.map(
      (s: { matchNumber: string; scheduledStartTime: Date }) => ({
        eventMatchId:
          eventId + matchTypes.qual + s.matchNumber.toString().padStart(3, '0'),
        eventId: eventId,
        matchType: matchTypes.qual,
        matchNumber: s.matchNumber,
        scheduledStartTime: new Date(s.scheduledStartTime),
      })
    ); // no error

    await addEventSchedule(data);

    const teamData: InsertEventMatchTeam[] = result.flatMap(
      (match: EventMatch) =>
        match.teams.map(
          ({
            eventMatchId,
            allianceColor,
            alliancePosition,
            teamNumber,
          }: EventTeam) => ({
            eventMatchId: eventMatchId,
            allianceColor: allianceColor,
            alliancePosition: alliancePosition,
            teamNumber: teamNumber,
          })
        )
    ); // no error

    await addEventScheduleTeams(teamData);
    return true;
    //console.log(event);
  } else {
    console.log('Event not found.');
    return false;
  }
}
