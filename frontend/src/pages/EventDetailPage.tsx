import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'
import type { EventType, Slot } from '../types/api'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [eventType, setEventType] = useState<EventType | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  useEffect(() => {
    if (!id) return

    const eventId = parseInt(id, 10)

    Promise.all([
      api.eventTypes.get(eventId),
      api.slots.list(getDefaultFrom(), getDefaultTo()),
    ])
      .then(([eventData, slotsData]) => {
        if ('message' in eventData) {
          setError(eventData.message)
        } else {
          setEventType(eventData)
        }
        
        if (Array.isArray(slotsData)) {
          setSlots(slotsData)
        } else if ('message' in slotsData) {
          console.error('Slots error:', slotsData.message)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  function getDefaultFrom() {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date.toISOString()
  }

  function getDefaultTo() {
    const date = new Date()
    date.setDate(date.getDate() + 14)
    date.setHours(23, 59, 59, 999)
    return date.toISOString()
  }

  const availableSlots = slots.filter((slot) => slot.isAvailable)

  if (loading) return <div className="loading">Loading...</div>

  if (error) return <div className="error-message">Error: {error}</div>

  if (!eventType) return <div className="error-message">Event type not found</div>

  return (
    <div>
      <Link to="/" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Events
      </Link>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>{eventType.name}</h2>
        <p>{eventType.description}</p>
        <span className="badge badge-secondary">{eventType.durationMinutes} minutes</span>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Available Slots</h3>

      {availableSlots.length === 0 ? (
        <div className="empty-state">No available slots in the next 14 days</div>
      ) : (
        <div className="grid grid-3">
          {availableSlots.map((slot) => (
            <div
              key={slot.id}
              className={`slot ${selectedSlot?.id === slot.id ? 'slot-selected' : ''}`}
              onClick={() => setSelectedSlot(slot)}
            >
              <div style={{ fontWeight: 500 }}>
                {new Date(slot.startTime).toLocaleDateString()}
              </div>
              <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSlot && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/book?slotId=${selectedSlot.id}&eventTypeId=${eventType.id}`)}
          >
            Continue with selected slot
          </button>
        </div>
      )}
    </div>
  )
}