'use server';

import {
  GetMatchResultsFromFms,
  GetMatchResultsFromTba,
} from '@/app/api/seasons/[season]/events/[eventId]/match-results/match-results-actions';
import {
  EventStats,
  getDb2025EventStatsForSeason,
} from '@/db/queries/admin-queries';
import {
  getEventsForSeason,
  getEventTeamNumbers,
} from '@/db/queries/event-queries';
import { pullEventFromApi } from '../settings/settings-actions';
import { pullScheduleFromApi } from '@/app/(public)/event-schedule/event-schedule-actions';

export async function get2025EventStats(): Promise<EventStats[]> {
  return await getDb2025EventStatsForSeason();
}

export async function GetSeasonEventMatchResultsFromFms(
  season: number,
  eventCode: string
) {
  return await GetMatchResultsFromFms(season, eventCode);
}

export async function GetSeasonEventMatchResultsFromTba(
  season: number,
  eventCode: string
) {
  return await GetMatchResultsFromTba(season, eventCode);
}

export async function DoCmpTxLoad(
  season: number,
  eventId: string
): Promise<void> {
  // Teams for event
  const teamNumbers = await getEventTeamNumbers(season, eventId);

  // Events known to Daisy Scout Web
  const knownEvents = await getEventsForSeason(season);

  // for each competing team
  for (const cmpTeam of teamNumbers) {
    // Get last event for team
    const lastEventCode = await getLastEventForTeam(
      season,
      cmpTeam.teamNumber,
      new Date('2025-04-14')
    );

    if (!lastEventCode) {
      console.log(`cannot find events for team ${cmpTeam.teamNumber}`);
    } else {
      // since could be undefined

      if (knownEvents.some((e) => e.eventCode === lastEventCode)) {
        // if event is known, loop
        console.log(`Event ${lastEventCode} is known, skipping`);
      } else {
        // if event is not known
        console.log(`Event ${lastEventCode} is not known, pulling`);

        // pull event and teams
        await pullEventFromApi(season.toString(), lastEventCode);

        // (?) pull event matches
        await pullScheduleFromApi(season.toString(), lastEventCode);

        // (?) pull event match results
        await GetMatchResultsFromFms(season, lastEventCode);

        // (?) pull Videos
        await GetMatchResultsFromTba(season, lastEventCode);

        // add to known events
        knownEvents.push({
          eventId: eventId,
          eventCode: lastEventCode,
          season: season,
          eventName: lastEventCode, // does not matter for this loop
          startDate: new Date(), // does not matter for this loop
          teams: undefined,
        });
      }
    }
  }

  return;
}

async function getLastEventForTeam(
  season: number,
  teamNumber: number,
  asOfDate: Date
): Promise<string | undefined> {
  const vals = process.env.FRCAPI_User + ':' + process.env.FRCAPI_Pass;
  const token = Buffer.from(vals).toString('base64');

  const response = await fetch(
    `https://frc-api.firstinspires.org/v3.0/${season}/events?teamNumber=${teamNumber}`,
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
    console.log('Error fetching last event for team:', response.text());
    return;
  }

  const result = await response.json();
  // have data
  if (result.Events.length > 0) {
    const events = result.Events as {
      dateStart: string;
      code: string;
      type: string;
    }[];

    //type DistrictChampionshipWithLevels
    const event = events.filter(
      (e: { dateStart: string; code: string; type: string }) =>
        new Date(e.dateStart) < asOfDate &&
        e.type != 'DistrictChampionshipWithLevels'
    );

    event.sort((a, b) => {
      // Sort by dateStart (descending)
      if (new Date(a.dateStart) > new Date(b.dateStart)) return -1;
      if (new Date(a.dateStart) < new Date(b.dateStart)) return 1;
      return 0;
    });
    return event[0].code;
  }
  return undefined;
}
