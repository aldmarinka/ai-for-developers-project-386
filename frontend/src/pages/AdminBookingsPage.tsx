import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Booking } from '../types/api'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUpcoming, setShowUpcoming] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [showUpcoming])

  const loadBookings = () => {
    setLoading(true)
    api.admin.bookings.list(showUpcoming)
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  if (loading) return <div className="loading">Loading...</div>

  if (error) return <div className="error-message">Error: {error}</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Bookings (Admin)</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showUpcoming}
            onChange={(e) => setShowUpcoming(e.target.checked)}
          />
          Show upcoming only
        </label>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">No bookings found</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest Name</th>
              <th>Guest Email</th>
              <th>Slot ID</th>
              <th>Event Type ID</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.guestName}</td>
                <td>{booking.guestEmail}</td>
                <td>{booking.slotId}</td>
                <td>{booking.eventTypeId}</td>
                <td>{new Date(booking.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}