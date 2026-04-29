import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'
import type { GuestBookingRequest } from '../types/api'

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const slotId = parseInt(searchParams.get('slotId') || '0', 10)
  const eventTypeId = parseInt(searchParams.get('eventTypeId') || '0', 10)

  const [form, setForm] = useState<GuestBookingRequest>({
    slotId,
    eventTypeId,
    guestName: '',
    guestEmail: '',
  })

  if (!slotId || !eventTypeId) {
    return (
      <div>
        <div className="error-message">Invalid booking parameters</div>
        <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Go to events
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await api.bookings.create(form)
      
      if ('message' in result) {
        setError(result.message)
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/'), 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#166534' }}>Booking Confirmed!</h2>
        <p>Your booking has been created successfully. Redirecting to home...</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Events
      </Link>

      <div className="card" style={{ maxWidth: '500px', margin: '1rem auto' }}>
        <h2>Complete Your Booking</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Your Name</label>
            <input
              type="text"
              className="input"
              value={form.guestName}
              onChange={(e) => setForm({ ...form, guestName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={form.guestEmail}
              onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}