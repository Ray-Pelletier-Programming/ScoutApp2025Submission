'use server';

import { matchTypes } from '@/app/ui/constants/match-type';
import { CustomMatchSchedule } from '@/db/models/custom-match-schedule';
import {
  addEventSchedule,
  UpsertEventScheduleTeams,
  getEventMatchesForEvent,
} from '@/db/queries/match-schedule-queries';
import { InsertEventMatch, InsertEventMatchTeam } from '@/db/schema';

export async function getEventMatchSchedule(
  event_id: string,
  matchType: string
) {
  return getEventMatchesForEvent({ eventId: event_id, matchType: matchType });
}

export async function saveManualMatchSchedule(
  eventId: string,
  matchData: CustomMatchSchedule[]
) {
  if (matchData.length > 0) {
    const data: InsertEventMatch[] = matchData.map((s) => ({
      eventMatchId:
        eventId + matchTypes.qual + s.matchNumber.toString().padStart(3, '0'),
      eventId: eventId,
      matchType: matchTypes.qual,
      matchNumber: s.matchNumber,
      scheduledStartTime: null,
    }));

    await addEventSchedule(data);

    const result: InsertEventMatchTeam[] = [];

    matchData.forEach((match) => {
      //const matchId = match.matchNumber.toString().padStart(3, '0');
      const eventMatchId =
        eventId +
        matchTypes.qual +
        match.matchNumber.toString().padStart(3, '0');
      result.push(
        {
          eventMatchId: eventMatchId,
          allianceColor: 'b',
          alliancePosition: 1,
          teamNumber: match.blue1!,
        },
        {
          eventMatchId: eventMatchId,
          allianceColor: 'b',
          alliancePosition: 2,
          teamNumber: match.blue2!,
        },
        {
          eventMatchId: eventMatchId,
          allianceColor: 'b',
          alliancePosition: 3,
          teamNumber: match.blue3!,
        },
        {
          eventMatchId: eventMatchId,
          allianceColor: 'r',
          alliancePosition: 1,
          teamNumber: match.red1!,
        },
        {
          eventMatchId: eventMatchId,
          allianceColor: 'r',
          alliancePosition: 2,
          teamNumber: match.red2!,
        },
        {
          eventMatchId: eventMatchId,
          allianceColor: 'r',
          alliancePosition: 3,
          teamNumber: match.red3!,
        }
      );
    });
    const teamData: InsertEventMatchTeam[] = result;

    await UpsertEventScheduleTeams(teamData);
    return getEventMatchSchedule(eventId, matchTypes.qual);
    //console.log(event);
  } else {
    console.log('Event not found.');
    return [];
  }
}
