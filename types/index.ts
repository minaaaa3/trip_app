export interface Trip {
  id: string;
  title: string;
  description: string;
  inviteToken?: string | null;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
}

export interface Spot {
  id: string;
  tripId: string;
  name: string;
  url?: string | null;
  memo?: string | null;
  day?: number | null;
  order?: number;
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string | null;
  spotId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  tripId: string;
  paidById: string;
  paidBy?: {
    id: string;
    email: string;
    name?: string | null;
  };
  participants: ExpenseParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseParticipant {
  expenseId: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
}
