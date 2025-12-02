import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  photos: string[];
  currency: string;
  timezone: string;
  subdomain: string;
  createdAt: string;
  updatedAt: string;
}

interface Room {
  id: string;
  code: string;
  name: string;
  capacity: number;
  pricePerNight: number;
}

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  room?: Room;
}

interface AdminHotelDetailsProps {
  hotelId?: string;
}

export default function AdminHotelDetails({ hotelId }: AdminHotelDetailsProps) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const hotelIdToUse = hotelId || paramId;
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'rooms' | 'bookings' | 'photos'>('info');
  
  // Edit form state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Hotel>>({});
  
  // Room form state
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomForm, setRoomForm] = useState({
    code: '',
    name: '',
    capacity: 1,
    pricePerNight: 0
  });

  useEffect(() => {
    fetchHotelDetails();
  }, [hotelIdToUse]);

  const fetchHotelDetails = async () => {
    try {
      const res = await fetch(`http://localhost:7000/api/admin/hotels/${hotelIdToUse}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        setError('Failed to load hotel details');
        return;
      }
      const data = await res.json();
      setHotel(data);
      setFormData({
        name: data.name,
        city: data.city,
        address: data.address,
        description: data.description,
        currency: data.currency,
        timezone: data.timezone,
        subdomain: data.subdomain
      });
      setRooms(data.rooms || []);
      
      // Fetch bookings for this hotel
      try {
        const bookingsRes = await fetch(`http://localhost:7000/api/admin/hotels/${hotelIdToUse}/bookings`, {
          credentials: 'include'
        });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        }
      } catch (bookingError) {
        console.error('Failed to fetch bookings:', bookingError);
      }
    } catch (e) {
      console.error('Failed to fetch hotel:', e);
      setError('Error loading hotel details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHotel = async () => {
    if (!hotel) return;
    
    try {
      const res = await fetch(`http://localhost:7000/api/admin/hotels/${hotel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updated = await res.json();
        setHotel(updated);
        setEditMode(false);
        setError('');
      } else {
        setError('Failed to update hotel');
      }
    } catch (e) {
      setError('Error updating hotel');
    }
  };

  const handleAddRoom = async () => {
    if (!hotel || !roomForm.code || !roomForm.name) {
      setError('Please fill in all room fields');
      return;
    }

    try {
      const res = await fetch(`http://localhost:7000/api/admin/hotels/${hotel.id}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(roomForm)
      });

      if (res.ok) {
        const newRoom = await res.json();
        setRooms([...rooms, newRoom]);
        setRoomForm({ code: '', name: '', capacity: 1, pricePerNight: 0 });
        setShowRoomForm(false);
        setError('');
      } else {
        setError('Failed to create room');
      }
    } catch (e) {
      setError('Error creating room');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const res = await fetch(`http://localhost:7000/api/admin/hotels/${hotel?.id}/rooms/${roomId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        setRooms(rooms.filter(r => r.id !== roomId));
        setError('');
      } else {
        setError('Failed to delete room');
      }
    } catch (e) {
      setError('Error deleting room');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Hotel not found'}</p>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">Tourbnb Admin</h1>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Hotel Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{hotel.name}</h1>
              <p className="text-gray-600 mt-1">📍 {hotel.city} • {hotel.address}</p>
            </div>
            {!editMode && (
              <Button onClick={() => setEditMode(true)}>Edit Hotel</Button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-3 font-semibold text-sm sm:text-base ${
                activeTab === 'info'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hotel Info
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-3 font-semibold text-sm sm:text-base ${
                activeTab === 'rooms'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rooms ({rooms.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-3 font-semibold text-sm sm:text-base ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-3 font-semibold text-sm sm:text-base ${
                activeTab === 'photos'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Photos
            </button>
          </div>

          {/* Hotel Info Tab */}
          {activeTab === 'info' && (
            <div className="p-4 sm:p-6">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Hotel Name</label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City</label>
                      <Input
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Currency</label>
                      <Input
                        value={formData.currency || ''}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        placeholder="USD"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <Input
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Timezone</label>
                      <Input
                        value={formData.timezone || ''}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        placeholder="UTC"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Subdomain</label>
                      <Input
                        value={formData.subdomain || ''}
                        onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleUpdateHotel} className="flex-1">Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditMode(false)} className="flex-1">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Hotel Name</p>
                    <p className="text-lg font-semibold">{hotel.name}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">City</p>
                      <p className="text-lg font-semibold">{hotel.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Currency</p>
                      <p className="text-lg font-semibold">{hotel.currency}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-lg font-semibold">{hotel.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-base">{hotel.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Timezone</p>
                      <p className="text-lg font-semibold">{hotel.timezone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Subdomain</p>
                      <p className="text-lg font-semibold">{hotel.subdomain}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div className="p-4 sm:p-6">
              {!showRoomForm ? (
                <Button onClick={() => setShowRoomForm(true)} className="mb-4">
                  + Add New Room
                </Button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
                  <h3 className="font-semibold">Add New Room</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Room Code</label>
                      <Input
                        placeholder="e.g., R101"
                        value={roomForm.code}
                        onChange={(e) => setRoomForm({ ...roomForm, code: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Room Name</label>
                      <Input
                        placeholder="e.g., Deluxe Room"
                        value={roomForm.name}
                        onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Capacity</label>
                      <Input
                        type="number"
                        min="1"
                        value={roomForm.capacity}
                        onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Price per Night</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={roomForm.pricePerNight}
                        onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleAddRoom} className="flex-1">Create Room</Button>
                    <Button variant="outline" onClick={() => setShowRoomForm(false)} className="flex-1">Cancel</Button>
                  </div>
                </div>
              )}

              {/* Rooms List */}
              {rooms.length > 0 ? (
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div key={room.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{room.name} ({room.code})</p>
                        <p className="text-sm text-gray-600">
                          👥 {room.capacity} guests • ₹{room.pricePerNight}/night
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No rooms added yet</p>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="p-4 sm:p-6">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-gray-900">Guest</th>
                          <th className="px-4 py-3 font-semibold text-gray-900">Email</th>
                          <th className="px-4 py-3 font-semibold text-gray-900">Room</th>
                          <th className="px-4 py-3 font-semibold text-gray-900">Check-in</th>
                          <th className="px-4 py-3 font-semibold text-gray-900">Check-out</th>
                          <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{booking.guestName}</td>
                            <td className="px-4 py-3 text-gray-600">{booking.guestEmail}</td>
                            <td className="px-4 py-3 text-gray-600">{booking.room?.name || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-600">{new Date(booking.checkIn).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-gray-600">{new Date(booking.checkOut).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No bookings for this hotel yet</p>
              )}
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="p-4 sm:p-6">
              <p className="text-gray-600 mb-4">Photo upload feature coming soon</p>
              {hotel.photos && hotel.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {hotel.photos.map((photo, idx) => (
                    <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
