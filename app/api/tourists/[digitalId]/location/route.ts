import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

interface LocationUpdateRequest {
  lat: number;
  lng: number;
}

export async function PATCH(
  request: Request,
  { params }: { params: { digitalId: string } }
) {
  try {
    const { digitalId } = params;
    const body: LocationUpdateRequest = await request.json();
    const { lat, lng } = body;

    if (!digitalId || lat === undefined || lng === undefined) {
      return NextResponse.json({ message: 'Missing digitalId or location data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('tourists').updateOne(
      { digitalId: digitalId },
      {
        $set: {
          lastLocation: { lat, lng },
          lastUpdated: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Tourist not found' }, { status: 404 });
    }

    console.log(`[API] Updated location for ${digitalId}: (${lat}, ${lng})`);

    return NextResponse.json({ message: 'Location updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Location update failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
