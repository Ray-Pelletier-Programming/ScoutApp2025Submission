import { drizzleClientHttp as db } from '@/db/client';
import {
  EventMatchTeams2025Result,
  EventMatches2025Result,
  EventMatches2025TbaResult,
  InsertEventMatchTeams2025Result,
  InsertEventMatches2025Result,
  InsertEventMatches2025TbaResult,
} from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function addEventMatches2025TbaResults(
  data: InsertEventMatches2025TbaResult[]
): Promise<void> {
  if (data.length > 0) {
    await db
      .insert(EventMatches2025TbaResult)
      .values(data)
      .onConflictDoUpdate({
        target: [EventMatches2025TbaResult.eventMatchId],
        set: {
          videoKey: sql.raw(`excluded."videoKey"`),
          videoType: sql.raw(`excluded."videoType"`),
        },
      });
  }
  return;
}

export async function addEventMatches2025Results(
  data: InsertEventMatches2025Result[]
): Promise<void> {
  await db.insert(EventMatches2025Result).values(data).onConflictDoNothing();
  return;
}

export async function addEventMatchTeams2025Results(
  data: InsertEventMatchTeams2025Result[]
): Promise<void> {
  await db.insert(EventMatchTeams2025Result).values(data).onConflictDoNothing();
  return;
}
