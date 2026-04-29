interface EventType {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
}

interface Slot {
  id: number;
  startTime: string;
  durationMinutes: number;
  isAvailable: boolean;
}

interface Booking {
  id: number;
  slotId: number;
  eventTypeId: number;
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

class InMemoryStore {
  eventTypes: Map<number, EventType> = new Map();
  slots: Map<number, Slot> = new Map();
  bookings: Map<number, Booking> = new Map();
  nextEventTypeId = 1;
  nextSlotId = 1;
  nextBookingId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    const eventTypes: EventType[] = [
      { id: 1, name: "Consultation", description: "30-minute consultation call", durationMinutes: 30 },
      { id: 2, name: "Demo", description: "Product demo session", durationMinutes: 60 },
      { id: 3, name: "Support", description: "Technical support call", durationMinutes: 15 },
    ];
    eventTypes.forEach(et => this.eventTypes.set(et.id, et));
    this.nextEventTypeId = 4;

    const now = new Date();
    const slots: Slot[] = [];
    for (let i = 0; i < 20; i++) {
      const startTime = new Date(now.getTime() + (i + 1) * 3600000);
      slots.push({
        id: i + 1,
        startTime: startTime.toISOString(),
        durationMinutes: 30,
        isAvailable: true,
      });
    }
    slots.forEach(s => this.slots.set(s.id, s));
    this.nextSlotId = 21;
  }
}

export const store = new InMemoryStore();
export type { EventType, Slot, Booking };