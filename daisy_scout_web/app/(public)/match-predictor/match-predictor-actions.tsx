'use server';

import { matchTypes } from '@/app/ui/constants/match-type';
import { EventMatch } from '@/db/models/event-match';
import { get2025MatchAutosForEvent } from '@/db/queries/match-2025-data-queries';
import { getSingleEventMatchForEvent } from '@/db/queries/match-schedule-queries';
import { getPredict2024Results } from '@/db/queries/predict-2024-data-queries';
import { getPredict2025Results } from '@/db/queries/predict-2025-data-queries';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function postForm(prevState: any, formData: FormData) {
  const match = getValueFromForm(formData.get('matchNum'));
  const eventId = formData.get('eventId');

  return await getSingleEventMatchForEvent(
    eventId!.toString(),
    matchTypes.qual,
    parseInt(match!.toString())
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function post2024PredictForm(prevState: any, formData: FormData) {
  //const season = formData.get('season');
  const eventId = formData.get('eventId');

  const red1 = getValueFromForm(formData.get('red1'));
  const red2 = getValueFromForm(formData.get('red2'));
  const red3 = getValueFromForm(formData.get('red3'));

  const blue1 = getValueFromForm(formData.get('blue1'));
  const blue2 = getValueFromForm(formData.get('blue2'));
  const blue3 = getValueFromForm(formData.get('blue3'));

  return await getPredict2024Results(
    eventId!.toString(),
    parseInt(blue1.toString()),
    parseInt(blue2.toString()),
    parseInt(blue3.toString()),
    parseInt(red1.toString()),
    parseInt(red2.toString()),
    parseInt(red3.toString())
  );
}

function getValueFromForm(val: FormDataEntryValue | null): string {
  if (val === null) {
    return '0';
  }
  if (val.toString() === '') {
    return '0';
  }
  return val.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function post2025PredictForm(prevState: any, formData: FormData) {
  //const season = formData.get('season');
  const eventId = formData.get('eventId');

  const red1 = getValueFromForm(formData.get('red1'));
  const red2 = getValueFromForm(formData.get('red2'));
  const red3 = getValueFromForm(formData.get('red3'));

  const blue1 = getValueFromForm(formData.get('blue1'));
  const blue2 = getValueFromForm(formData.get('blue2'));
  const blue3 = getValueFromForm(formData.get('blue3'));

  let lastNMatches = 32767; // all matches for season
  const allSeasonHistory = formData.get('allEvents') !== null;
  if (allSeasonHistory) {
    lastNMatches = 6;
  }

  return await getPredict2025Results(
    eventId!.toString(),
    parseInt(blue1.toString()),
    parseInt(blue2.toString()),
    parseInt(blue3.toString()),
    parseInt(red1.toString()),
    parseInt(red2.toString()),
    parseInt(red3.toString()),
    lastNMatches,
    allSeasonHistory
  );
}

export async function get2025AutoTables(state: EventMatch) {
  const blueAutos = await get2025MatchAutosForEvent(
    state.eventId,
    state.blue1!,
    state.blue2!,
    state.blue3!,
    matchTypes.qual,
    state.allEvents === true ? 6 : 32700,
    state.allEvents ?? false
  );

  const redAutos = await get2025MatchAutosForEvent(
    state.eventId,
    state.red1!,
    state.red2!,
    state.red3!,
    matchTypes.qual,
    state.allEvents === true ? 6 : 32700,
    state.allEvents ?? false
  );

  return { blueAutos, redAutos };
}
