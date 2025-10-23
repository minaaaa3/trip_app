export interface Trip {
  id: number;
  title: string;
  created_by: number;
  created_at: string;
  updated_at?: string;
  member_count?: number;
}

export interface Spot {
  id: number;
  trip_id: number;
  name: string;
  url?: string;
  memo?: string;
  lat?: number;
  lng?: number;
  created_by: number;
  created_at: string;
  updated_at?: string;
}
