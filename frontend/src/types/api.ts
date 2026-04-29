export interface Error {
  message: string;
}

export interface EventType {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface CreateEventTypeRequest {
  name: string;
  description: string;
  durationMinutes: number;
}

export interface UpdateEventTypeRequest {
  name?: string;
  description?: string;
  durationMinutes?: number;
}

export interface Slot {
  id: number;
  startTime: string;
  durationMinutes: number;
  isAvailable: boolean;
}

export interface Booking {
  id: number;
  slotId: number;
  eventTypeId: number;
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

export interface GuestBookingRequest {
  slotId: number;
  eventTypeId: number;
  guestName: string;
  guestEmail: string;
}