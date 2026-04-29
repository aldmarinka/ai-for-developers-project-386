import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { EventType, CreateEventTypeRequest, UpdateEventTypeRequest } from '../types/api'

export default function AdminEventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null)
  const [form, setForm] = useState<CreateEventTypeRequest>({
    name: '',
    description: '',
    durationMinutes: 30,
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadEventTypes()
  }, [])

  const loadEventTypes = () => {
    api.admin.eventTypes.list()
      .then(setEventTypes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const result = await api.admin.eventTypes.create(form)
      if ('message' in result) {
        setError(result.message)
      } else {
        setSuccess('Event type created successfully')
        setShowModal(false)
        setForm({ name: '', description: '', durationMinutes: 30 })
        loadEventTypes()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return
    
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const updateData: UpdateEventTypeRequest = {
        name: form.name,
        description: form.description,
        durationMinutes: form.durationMinutes,
      }
      
      const result = await api.admin.eventTypes.update(editingEvent.id, updateData)
      if ('message' in result) {
        setError(result.message)
      } else {
        setSuccess('Event type updated successfully')
        setEditingEvent(null)
        setForm({ name: '', description: '', durationMinutes: 30 })
        loadEventTypes()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event type?')) return
    
    try {
      await api.admin.eventTypes.delete(id)
      loadEventTypes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const openEditModal = (eventType: EventType) => {
    setEditingEvent(eventType)
    setForm({
      name: eventType.name,
      description: eventType.description,
      durationMinutes: eventType.durationMinutes,
    })
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Event Types (Admin)</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Event Type
        </button>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: '1rem' }}>{success}</div>}

      {eventTypes.length === 0 ? (
        <div className="empty-state">No event types created yet</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Duration (min)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventTypes.map((eventType) => (
              <tr key={eventType.id}>
                <td>{eventType.id}</td>
                <td>{eventType.name}</td>
                <td>{eventType.description}</td>
                <td>{eventType.durationMinutes}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-secondary" onClick={() => openEditModal(eventType)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(eventType.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(showModal || editingEvent) && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingEvent(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingEvent ? 'Edit Event Type' : 'Create Event Type'}</h2>
            <form onSubmit={editingEvent ? handleUpdate : handleCreate}>
              <div className="form-group">
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <input
                  type="text"
                  className="input"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Duration (minutes)</label>
                <input
                  type="number"
                  className="input"
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: parseInt(e.target.value, 10) })}
                  required
                  min="1"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingEvent(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}