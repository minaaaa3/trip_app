export interface Trip {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Spot {
  id: string;
  tripId: string;
  name: string;
  url?: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}
