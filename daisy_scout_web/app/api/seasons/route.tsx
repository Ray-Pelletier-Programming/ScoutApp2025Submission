import { NextResponse } from 'next/server';
import { getSeasons } from '@/db/queries/season-queries';

export async function GET() {
  return NextResponse.json(await getSeasons());
}
