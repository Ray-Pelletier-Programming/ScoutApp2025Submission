//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript
//https://orm.drizzle.team/docs/tutorials/drizzle-with-neon

import { desc, eq } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import { SelectSeason, seasonsTable } from '@/db/schema';

export async function getSeasons(): Promise<
  Array<{
    season: number;
    seasonName: string;
  }>
> {
  const query = await db
    .select({
      season: seasonsTable.season,
      seasonName: seasonsTable.seasonName,
    })
    .from(seasonsTable)
    .orderBy(desc(seasonsTable.season));
  return query;
}

export async function getSeasonById(season: SelectSeason['season']): Promise<
  Array<{
    season: number;
    seasonName: string;
  }>
> {
  const query = await db
    .select({
      season: seasonsTable.season,
      seasonName: seasonsTable.seasonName,
    })
    .from(seasonsTable)
    .where(eq(seasonsTable.season, season));
  return query;
}
