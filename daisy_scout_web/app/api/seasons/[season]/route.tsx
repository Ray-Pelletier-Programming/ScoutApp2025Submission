//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { getSeasonById } from '@/db/queries/season-queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ season: number }> }
) {
  const { season } = await params;
  return NextResponse.json(await getSeasonById(season));
}
