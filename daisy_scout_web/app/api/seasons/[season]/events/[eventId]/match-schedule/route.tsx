import { NextRequest, NextResponse } from 'next/server';

// userd by tablet app when running in the browser...
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ season: number; eventId: string }> }
) {
  const { season, eventId } = await params;

  const vals = process.env.FRCAPI_User + ':' + process.env.FRCAPI_Pass;
  const token = Buffer.from(vals).toString('base64');

  const response = await fetch(
    `https://frc-api.firstinspires.org/v3.0/${season}/schedule/${eventId}?tournamentLevel=qual`,
    {
      method: 'GET',
      headers: {
        //'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
      //body: JSON.stringify({ comment }),
    }
  );

  if (response.status !== 200) {
    console.log('Error fetching match schedule via API:', response.text());
    return;
  }
  const result = await response.json();

  return NextResponse.json(result);
}
