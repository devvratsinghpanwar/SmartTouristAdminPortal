import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// This function handles the distress signal from the mobile app
export async function PATCH(
  request: Request,
  { params }: { params: { digitalId: string } }
) {
  try {
    const { digitalId } = params;

    if (!digitalId) {
      return NextResponse.json({ message: 'Missing digitalId' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('tourists').updateOne(
      { digitalId: digitalId },
      {
        $set: {
          safetyStatus: 'danger', // The critical change!
          lastUpdated: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Tourist not found' }, { status: 404 });
    }

    console.log(`[API] PANIC ALERT received from ${digitalId}`);

    return NextResponse.json({ message: 'Alert status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Alert update failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
