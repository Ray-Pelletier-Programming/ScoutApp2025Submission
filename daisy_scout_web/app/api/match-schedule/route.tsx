//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Invalid Route, use /api/events/:eventId/matches instead' },
    { status: 400 }
  );
}
