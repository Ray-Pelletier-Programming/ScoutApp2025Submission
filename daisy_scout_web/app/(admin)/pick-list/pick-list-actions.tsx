'use server';

import {
  getPickList2025,
  getDoNotPickList2025,
  toggleSelected2025,
  addTo2025DnpList,
  removeFrom2025DnpList,
  move2025Team,
  move2025TeamOrder,
} from '@/db/queries/picklist-2025-queries';
import { InsertPickList2025Data } from '@/db/schema';

export async function get2025PicklistForEvent(event_Id: string) {
  return getPickList2025(event_Id);
}

export async function get2025DoNotPicklistForEvent(event_Id: string) {
  return getDoNotPickList2025(event_Id);
}

export async function setAllianceSelected(
  event_Id: string,
  teamNumber: number,
  allianceSelected: boolean
) {
  return toggleSelected2025(event_Id, teamNumber, allianceSelected);
}

export async function addToDnpList(
  event_Id: string,
  teamNumber: number,
  reason: string
) {
  return addTo2025DnpList(event_Id, teamNumber, reason);
}

export async function removeFromDnpList(event_Id: string, teamNumber: number) {
  return removeFrom2025DnpList(event_Id, teamNumber);
}

export async function moveTeam(
  eventid: string,
  teamNumber: number,
  position: number
) {
  console.log(eventid, teamNumber, position);
  return await move2025Team(eventid, teamNumber, position);
}

export async function moveTeams(moves: InsertPickList2025Data[]) {
  return await move2025TeamOrder(moves);
}
