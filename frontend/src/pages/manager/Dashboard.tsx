import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Hotel {
  id: string;
  name: string;
  city?: string;
  address?: string;
  rooms?: Room[];
  bookings?: Booking[];
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
}

interface Booking {
  id: string;
  guestName?: string;
  guestEmail?: string;
  checkIn: string;
  checkOut: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  room: Room;
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hotelRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/api/manager/hotel`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch(`${API_URL}/api/manager/bookings`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
      ]);

      if (hotelRes.status === 401 || bookingsRes.status === 401) {
        navigate('/manager/login');
        return;
      }

      const hotelData = await hotelRes.json();
      const bookingsData = await bookingsRes.json();
      
      setHotel(hotelData || null);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (e) {
      console.error('Failed to fetch data:', e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/api/manager/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to update booking');
      }
    } catch (e) {
      console.error('Error updating booking:', e);
      alert('Error updating booking');
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/manager/login');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!hotel) return <div className="p-8 text-center">No hotel assigned. Contact admin.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold truncate">{hotel.name}</h1>
            {hotel.city && <p className="text-xs sm:text-sm text-gray-600">📍 {hotel.city}</p>}
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">Logout</Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Hotel Info */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base sm:text-lg font-bold">Hotel Overview</h2>
            <Button 
              onClick={() => navigate('/manager/rooms')}
              size="sm"
            >
              Manage Rooms
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded">
              <p className="text-xs sm:text-sm text-gray-600">Rooms</p>
              <p className="text-xl sm:text-2xl font-bold">{hotel.rooms?.length || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded">
              <p className="text-xs sm:text-sm text-gray-600">Total Bookings</p>
              <p className="text-xl sm:text-2xl font-bold">{Array.isArray(bookings) ? bookings.length : 0}</p>
            </div>
            <div className="bg-yellow-50 p-3 sm:p-4 rounded">
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {Array.isArray(bookings) ? bookings.filter(b => b.status === 'PENDING').length : 0}
              </p>
            </div>
            <div className="bg-green-50 p-3 sm:p-4 rounded">
              <p className="text-xs sm:text-sm text-gray-600">Confirmed</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {Array.isArray(bookings) ? bookings.filter(b => b.status === 'CONFIRMED').length : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-base sm:text-lg font-bold">Bookings</h2>
          </div>
          {!Array.isArray(bookings) || bookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">No bookings yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left font-semibold">Guest</th>
                    <th className="px-3 sm:px-6 py-3 text-left font-semibold hidden sm:table-cell">Room</th>
                    <th className="px-3 sm:px-6 py-3 text-left font-semibold hidden md:table-cell">Check-in</th>
                    <th className="px-3 sm:px-6 py-3 text-left font-semibold hidden md:table-cell">Check-out</th>
                    <th className="px-3 sm:px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4">
                        <div>
                          <p className="font-medium text-xs sm:text-sm">{booking.guestName || 'Guest'}</p>
                          <p className="text-xs text-gray-600 hidden sm:block">{booking.guestEmail || '-'}</p>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden sm:table-cell text-xs sm:text-sm">{booking.room?.name || 'N/A'}</td>
                      <td className="px-3 sm:px-6 py-4 hidden md:table-cell text-xs">{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td className="px-3 sm:px-6 py-4 hidden md:table-cell text-xs">{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td className="px-3 sm:px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        {booking.status === 'PENDING' && (
                          <Button 
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            Confirm
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
