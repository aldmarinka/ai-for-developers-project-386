import type {
  EventType,
  CreateEventTypeRequest,
  UpdateEventTypeRequest,
  Slot,
  Booking,
  GuestBookingRequest,
  Error,
} from '../types/api';

const BASE_URL = '/api';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  eventTypes: {
    list: () => fetchApi<EventType[]>('/event-types'),
    get: (id: number) => fetchApi<EventType | Error>(`/event-types/${id}`),
  },

  slots: {
    list: (from: string, to: string) =>
      fetchApi<Slot[] | Error>(`/slots?from=${from}&to=${to}`),
  },

  bookings: {
    create: (request: GuestBookingRequest) =>
      fetchApi<Booking | Error>('/bookings', {
        method: 'POST',
        body: JSON.stringify(request),
      }),
  },

  admin: {
    eventTypes: {
      list: () => fetchApi<EventType[]>('/admin/event-types'),
      create: (request: CreateEventTypeRequest) =>
        fetchApi<EventType | Error>('/admin/event-types', {
          method: 'POST',
          body: JSON.stringify(request),
        }),
      update: (id: number, request: UpdateEventTypeRequest) =>
        fetchApi<EventType | Error>(`/admin/event-types/${id}`, {
          method: 'PUT',
          body: JSON.stringify(request),
        }),
      delete: (id: number) =>
        fetchApi<void | Error>(`/admin/event-types/${id}`, {
          method: 'DELETE',
        }),
    },

    bookings: {
      list: (upcoming?: boolean) => {
        const params = upcoming ? '?upcoming=true' : '';
        return fetchApi<Booking[]>(`/admin/bookings${params}`);
      },
    },
  },
};