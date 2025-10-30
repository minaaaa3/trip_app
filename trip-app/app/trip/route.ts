// filepath: /trip-app/trip-app/app/trip/route.ts
import { NextResponse } from 'next/server';
import { addTrip } from './actions';

export async function POST(request: Request) {
  try {
    const tripData = await request.json();
    const newTrip = await addTrip(tripData);
    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}