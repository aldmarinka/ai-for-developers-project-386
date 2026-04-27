import "@typespec/http";
import "@typespec/rest";

using Http;
using Rest;

@service({
  title: "Calendar Booking API"
})
namespace CalendarBooking;

model Error {
  message: string;
}

model EventType {
  id: int32;
  name: string;
  description: string;
  durationMinutes: int32;
}

model CreateEventTypeRequest {
  name: string;
  description: string;
  durationMinutes: int32;
}

model UpdateEventTypeRequest {
  name?: string;
  description?: string;
  durationMinutes?: int32;
}

model Slot {
  id: int32;
  startTime: utcDateTime;
  durationMinutes: int32;
  isAvailable: boolean;
}

model Booking {
  id: int32;
  slotId: int32;
  eventTypeId: int32;
  guestName: string;
  guestEmail: string;
  createdAt: utcDateTime;
}

model GuestBookingRequest {
  slotId: int32;
  eventTypeId: int32;
  guestName: string;
  guestEmail: string;
}

@route("/event-types")
@tag("Event Types (Public)")
interface PublicEventTypes {
  @get listEventTypes(): EventType[];
  
  @get readEventType(@path id: int32): EventType | Error;
}

@route("/slots")
@tag("Slots (Public)")
interface PublicSlots {
  @get listSlots(
    @query from: string,
    @query to: string
  ): Slot[] | Error;
}

@route("/bookings")
@tag("Bookings (Public)")
interface PublicBookings {
  @post createBooking(@body request: GuestBookingRequest): Booking | Error;
}

@route("/admin/event-types")
@tag("Event Types (Admin)")
interface AdminEventTypes {
  @get list(): EventType[];
  
  @post create(@body request: CreateEventTypeRequest): EventType | Error;
  
  @put update(@path id: int32, @body request: UpdateEventTypeRequest): EventType | Error;
  
  @delete delete(@path id: int32): void | Error;
}

@route("/admin/bookings")
@tag("Bookings (Admin)")
interface AdminBookings {
  @get list(@query upcoming?: boolean): Booking[];
}