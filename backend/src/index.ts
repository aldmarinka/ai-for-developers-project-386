import express, { Request, Response } from "express";
import cors from "cors";
import { store, EventType, Slot, Booking } from "./store.js";

const app = express();
app.use(cors());
app.use(express.json());

interface ErrorResponse {
  message: string;
}

interface CreateEventTypeRequest {
  name: string;
  description: string;
  durationMinutes: number;
}

interface UpdateEventTypeRequest {
  name?: string;
  description?: string;
  durationMinutes?: number;
}

interface GuestBookingRequest {
  slotId: number;
  eventTypeId: number;
  guestName: string;
  guestEmail: string;
}

// Public Event Types
app.get("/event-types", (_req: Request, res: Response<EventType[]>) => {
  const eventTypes = Array.from(store.eventTypes.values());
  res.json(eventTypes);
});

app.get("/event-types/:id", (req: Request<{ id: string }>, res: Response<EventType | ErrorResponse>) => {
  const id = parseInt(req.params.id);
  const eventType = store.eventTypes.get(id);
  if (!eventType) {
    res.status(404).json({ message: "Event type not found" });
    return;
  }
  res.json(eventType);
});

// Public Slots
app.get("/slots", (req: Request<{}, {}, {}, { from: string; to: string }>, res: Response<Slot[] | ErrorResponse>) => {
  const { from, to } = req.query;
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    res.status(400).json({ message: "Invalid date format" });
    return;
  }

  const slots = Array.from(store.slots.values()).filter(slot => {
    const slotDate = new Date(slot.startTime);
    return slotDate >= fromDate && slotDate <= toDate;
  });
  res.json(slots);
});

// Public Bookings
app.post("/bookings", (req: Request<{}, {}, GuestBookingRequest>, res: Response<Booking | ErrorResponse>) => {
  const { slotId, eventTypeId, guestName, guestEmail } = req.body;

  if (!slotId || !eventTypeId || !guestName || !guestEmail) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const slot = store.slots.get(slotId);
  if (!slot) {
    res.status(404).json({ message: "Slot not found" });
    return;
  }

  if (!slot.isAvailable) {
    res.status(409).json({ message: "Slot is already booked" });
    return;
  }

  const eventType = store.eventTypes.get(eventTypeId);
  if (!eventType) {
    res.status(404).json({ message: "Event type not found" });
    return;
  }

  const existingBooking = Array.from(store.bookings.values()).find(b => b.slotId === slotId);
  if (existingBooking) {
    res.status(409).json({ message: "Slot is already booked" });
    return;
  }

  slot.isAvailable = false;
  const booking: Booking = {
    id: store.nextBookingId++,
    slotId,
    eventTypeId,
    guestName,
    guestEmail,
    createdAt: new Date().toISOString(),
  };
  store.bookings.set(booking.id, booking);
  res.status(201).json(booking);
});

// Admin Event Types
app.get("/admin/event-types", (_req: Request, res: Response<EventType[]>) => {
  const eventTypes = Array.from(store.eventTypes.values());
  res.json(eventTypes);
});

app.post("/admin/event-types", (req: Request<{}, {}, CreateEventTypeRequest>, res: Response<EventType | ErrorResponse>) => {
  const { name, description, durationMinutes } = req.body;

  if (!name || !description || !durationMinutes) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const eventType: EventType = {
    id: store.nextEventTypeId++,
    name,
    description,
    durationMinutes,
  };
  store.eventTypes.set(eventType.id, eventType);
  res.status(201).json(eventType);
});

app.put("/admin/event-types/:id", (req: Request<{ id: string }, {}, UpdateEventTypeRequest>, res: Response<EventType | ErrorResponse>) => {
  const id = parseInt(req.params.id);
  const eventType = store.eventTypes.get(id);

  if (!eventType) {
    res.status(404).json({ message: "Event type not found" });
    return;
  }

  const updated: EventType = {
    ...eventType,
    ...req.body,
  };
  store.eventTypes.set(id, updated);
  res.json(updated);
});

app.delete("/admin/event-types/:id", (req: Request<{ id: string }>, res: Response<void | ErrorResponse>) => {
  const id = parseInt(req.params.id);
  if (!store.eventTypes.has(id)) {
    res.status(404).json({ message: "Event type not found" });
    return;
  }
  store.eventTypes.delete(id);
  res.status(204).send();
});

// Admin Bookings
app.get("/admin/bookings", (req: Request<{}, {}, {}, { upcoming?: string }>, res: Response<Booking[]>) => {
  const upcoming = req.query.upcoming === "true";
  let bookings = Array.from(store.bookings.values());

  if (upcoming) {
    const now = new Date();
    bookings = bookings.filter(booking => {
      const slot = store.slots.get(booking.slotId);
      return slot && new Date(slot.startTime) > now;
    });
  }

  res.json(bookings);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});