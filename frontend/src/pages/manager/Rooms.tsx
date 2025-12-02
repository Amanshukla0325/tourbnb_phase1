import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  currency: string;
}

interface Room {
  id: string;
  code: string;
  name: string;
  capacity: number;
  pricePerNight: number;
}

export default function ManagerRooms() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  
  const [roomForm, setRoomForm] = useState({
    code: '',
    name: '',
    capacity: 1,
    pricePerNight: 0
  });

  useEffect(() => {
    fetchHotelData();
  }, []);

  const fetchHotelData = async () => {
    try {
      const res = await fetch('http://localhost:7000/api/manager/hotel', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          navigate('/manager/login');
          return;
        }
        setError('Failed to load hotel data');
        return;
      }

      const data = await res.json();
      setHotel(data);
      setRooms(data.rooms || []);
    } catch (e) {
      console.error('Failed to fetch hotel:', e);
      setError('Error loading hotel data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async () => {
    if (!hotel || !roomForm.code || !roomForm.name) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch(`http://localhost:7000/api/manager/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          hotelId: hotel.id,
          ...roomForm
        })
      });

      if (res.ok) {
        const newRoom = await res.json();
        setRooms([...rooms, newRoom]);
        setRoomForm({ code: '', name: '', capacity: 1, pricePerNight: 0 });
        setShowRoomForm(false);
        setError('');
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to create room');
      }
    } catch (e) {
      setError('Error creating room');
    }
  };

  const handleUpdateRoom = async (roomId: string) => {
    try {
      const res = await fetch(`http://localhost:7000/api/manager/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(roomForm)
      });

      if (res.ok) {
        const updatedRoom = await res.json();
        setRooms(rooms.map(r => r.id === roomId ? updatedRoom : r));
        setRoomForm({ code: '', name: '', capacity: 1, pricePerNight: 0 });
        setEditingRoomId(null);
        setError('');
      } else {
        setError('Failed to update room');
      }
    } catch (e) {
      setError('Error updating room');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const res = await fetch(`http://localhost:7000/api/manager/rooms/${roomId}`, {
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

  const handleEditRoom = (room: Room) => {
    setRoomForm({
      code: room.code,
      name: room.name,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight
    });
    setEditingRoomId(room.id);
    setShowRoomForm(true);
  };

  const handleCancel = () => {
    setShowRoomForm(false);
    setEditingRoomId(null);
    setRoomForm({ code: '', name: '', capacity: 1, pricePerNight: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Hotel data not found'}</p>
          <Button onClick={() => navigate('/manager')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">Tourbnb Manager</h1>
          <Button variant="outline" onClick={() => navigate('/manager')}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Hotel Info */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
          <p className="text-gray-600">📍 {hotel.city} • {hotel.address}</p>
          <p className="text-gray-700 mt-3">{hotel.description}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add Room Section */}
        {!showRoomForm && (
          <div className="mb-6">
            <Button onClick={() => setShowRoomForm(true)} className="w-full sm:w-auto">
              + Add New Room
            </Button>
          </div>
        )}

        {/* Room Form */}
        {showRoomForm && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {editingRoomId ? 'Edit Room' : 'Add New Room'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Room Code *</label>
                  <Input
                    placeholder="e.g., R101"
                    value={roomForm.code}
                    onChange={(e) => setRoomForm({ ...roomForm, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Room Name *</label>
                  <Input
                    placeholder="e.g., Deluxe Room"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Guest Capacity *</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Price per Night ({hotel.currency}) *</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={roomForm.pricePerNight}
                    onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    if (editingRoomId) {
                      handleUpdateRoom(editingRoomId);
                    } else {
                      handleAddRoom();
                    }
                  }}
                  className="flex-1"
                >
                  {editingRoomId ? 'Update Room' : 'Create Room'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Rooms List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-xl sm:text-2xl font-bold">
              Rooms ({rooms.length})
            </h2>
          </div>

          {rooms.length > 0 ? (
            <div className="divide-y">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {room.name} <span className="text-sm text-gray-500">({room.code})</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      👥 {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'} • 
                      ₹ {room.pricePerNight.toFixed(2)}/night
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRoom(room)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 sm:p-6 text-center text-gray-500">
              <p>No rooms created yet. Add your first room to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
