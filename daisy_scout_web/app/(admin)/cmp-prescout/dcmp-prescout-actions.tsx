'use server';

import { getEventById } from '@/db/queries/event-queries';

export async function getCmpEvent(event_Id: string) {
  return getEventById(event_Id);
}
