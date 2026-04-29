import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import EventTypesPage from './pages/EventTypesPage'
import EventDetailPage from './pages/EventDetailPage'
import BookingPage from './pages/BookingPage'
import AdminEventTypesPage from './pages/AdminEventTypesPage'
import AdminBookingsPage from './pages/AdminBookingsPage'

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <div className="container">
            <h1>Calendar Booking</h1>
            <nav>
              <Link to="/">Events</Link>
              <Link to="/admin/event-types">Admin Events</Link>
              <Link to="/admin/bookings">Admin Bookings</Link>
            </nav>
          </div>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<EventTypesPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/admin/event-types" element={<AdminEventTypesPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App