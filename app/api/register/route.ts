import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import mockBlockchain from "@/lib/mockBlockchain";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kyc, itinerary, emergencyContacts, tripDurationDays } = body;
    if (!kyc || !itinerary || !emergencyContacts || !tripDurationDays) {
      return NextResponse.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }
    const digitalIdData = mockBlockchain.createDigitalId(
      kyc,
      itinerary,
      emergencyContacts,
      tripDurationDays
    );
    const client = await clientPromise;
    const db = client.db();
    const touristData = {
      digitalId: digitalIdData.id,
      kyc,
      itinerary,
      emergencyContacts,
      validUntil: digitalIdData.validUntil,
      registeredAt: digitalIdData.issuedAt,
      safetyStatus: "normal",
      lastLocation: null,
      alerts: [],
    };
    const result = await db.collection("tourists").insertOne(touristData);
    console.log(
      `[API] Registered tourist and stored in DB with id: ${result.insertedId}`
    );
    return NextResponse.json(
      {
        message: "Tourist registered successfullly",
        digitalId: digitalIdData.id,
        dbId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("registration failded", error);
    return NextResponse.json(
      {
        message: "internal server error",
      },
      { status: 500 }
    );
  }
}
