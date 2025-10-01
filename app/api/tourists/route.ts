import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const tourists = await db
      .collection('tourists')
      .find({})
      .project({ kyc: 0, emergencyContacts: 0 }) // Exclude sensitive data from the dashboard view
      .limit(1000) // Limit to avoid sending too much data
      .toArray();

    return NextResponse.json(tourists, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch tourists:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
