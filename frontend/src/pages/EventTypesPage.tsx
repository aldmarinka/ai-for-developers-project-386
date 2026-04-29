import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { EventType } from '../types/api'

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.eventTypes.list()
      .then(setEventTypes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading...</div>

  if (error) return <div className="error-message">Error: {error}</div>

  if (eventTypes.length === 0) {
    return <div className="empty-state">No event types available</div>
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Available Events</h2>
      <div className="grid grid-2">
        {eventTypes.map((eventType) => (
          <div key={eventType.id} className="card">
            <h2>{eventType.name}</h2>
            <p>{eventType.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-secondary">{eventType.durationMinutes} min</span>
              <Link to={`/event/${eventType.id}`} className="btn btn-primary">
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}