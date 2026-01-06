//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

//import { ReferenceConfig } from 'drizzle-orm/mysql-core';
import { NextRequest, NextResponse } from 'next/server';
import { GetMatchResultsFromFms } from './match-results-actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ season: number; eventId: string }> }
) {
  const { season, eventId } = await params;
  await GetMatchResultsFromFms(season, eventId);
  return NextResponse.json('ok');
}
