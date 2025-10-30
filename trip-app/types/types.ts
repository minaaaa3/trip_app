export interface TripInput {
  tripName: string;
  destination: string;
  date: string;
}

export interface Trip extends TripInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}