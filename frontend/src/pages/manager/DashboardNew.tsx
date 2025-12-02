import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  LogOut, Plus, Bed, Users, DollarSign, TrendingUp, Edit2, Trash2, CheckCircle, Clock, AlertCircle, Menu, X
} from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  rooms?: Room[];
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
  status: string;
  room: Room;
}

const bookingStats = [
  { month: 'Jan', confirmed: 12, pending: 5, cancelled: 2 },
  { month: 'Feb', confirmed: 14, pending: 6, cancelled: 1 },
  { month: 'Mar', confirmed: 18, pending: 4, cancelled: 2 },
  { month: 'Apr', confirmed: 20, pending: 3, cancelled: 1 },
  { month: 'May', confirmed: 22, pending: 5, cancelled: 2 },
  { month: 'Jun', confirmed: 25, pending: 4, cancelled: 1 }
];

// Calculate real stats from bookings
const getBookingStats = (bookings: Booking[]) => {
  if (!bookings || bookings.length === 0) return bookingStats;
  const stats = bookings.reduce((acc, booking) => {
    const month = new Date(booking.checkIn).toLocaleString('default', { month: 'short' });
    const existing = acc.find(s => s.month === month) || { month, confirmed: 0, pending: 0, cancelled: 0 };
    
    if (booking.status === 'CONFIRMED') existing.confirmed++;
    else if (booking.status === 'PENDING') existing.pending++;
    else if (booking.status === 'CANCELLED') existing.cancelled++;
    
    return acc.some(s => s.month === month) ? acc : [...acc, existing];
  }, [] as typeof bookingStats);
  
  return stats.length > 0 ? stats : bookingStats;
};

export default function ManagerDashboardNew() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newRoom, setNewRoom] = useState({ code: '', name: '', capacity: 1, pricePerNight: 0 });
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchHotelData();
  }, []);

  const fetchHotelData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/manager/hotel`, {
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/manager/login');
          return;
        }
        throw new Error('Failed to fetch hotel');
      }

      const hotelData = await res.json();
      setHotel(hotelData);
      setRooms(hotelData.rooms || []);

      // Fetch bookings
      const bookingsRes = await fetch(`${API_URL}/api/manager/bookings`, {
        credentials: 'include'
      });

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      }
    } catch (e) {
      console.error('Error fetching hotel data:', e);
      setError('Failed to load hotel data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { credentials: 'include' });
    } finally {
      navigate('/manager/login');
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.code || newRoom.capacity < 1) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/manager/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newRoom)
      });

      if (res.ok) {
        setMessage('Room added successfully!');
        setNewRoom({ code: '', name: '', capacity: 1, pricePerNight: 0 });
        setTimeout(() => setMessage(''), 3000);
        fetchHotelData();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to add room');
      }
    } catch (e) {
      console.error('Error:', e);
      setError('An error occurred');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const res = await fetch(`${API_URL}/api/manager/rooms/${roomId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        fetchHotelData();
        setMessage('Room deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error('Error:', e);
      setError('Failed to delete room');
    }
  };

  const handleUpdateBooking = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/manager/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchHotelData();
        setMessage(`Booking ${status}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error('Error:', e);
      setError('Failed to update booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''} flex items-center justify-center bg-white dark:bg-slate-950`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-slate-700 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading hotel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 text-gray-900 dark:text-slate-100 transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-800 p-6 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bed className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 dark:text-white block">TourBnb</span>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Manager</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 mb-8">
          {['overview', 'rooms'].map((item) => (
            <button
              key={item}
              onClick={() => { setActiveTab(item); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all capitalize font-medium text-sm ${
                activeTab === item
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {item === 'overview' && <span className="flex items-center gap-2"><DollarSign size={16} /> {item}</span>}
              {item === 'rooms' && <span className="flex items-center gap-2"><Bed size={16} /> {item}</span>}
            </button>
          ))}
        </nav>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent mb-6"></div>

        <div className="space-y-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-800/50 text-gray-700 dark:text-slate-300 hover:from-gray-200 dark:hover:from-slate-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 border border-gray-200 dark:border-slate-700/50"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 text-red-600 dark:text-red-400 hover:from-red-100 dark:hover:from-red-900/30 transition-all text-sm font-semibold flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/30"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800/50 p-4 md:p-8 sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {activeTab === 'overview' && '📊 Overview'}
                {activeTab === 'rooms' && '🛏️ Rooms'}
              </h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">{hotel?.name} • {hotel?.city && hotel.city}</p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 md:hidden text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Rooms" value={rooms.length} icon="🛏️" trend="+5%" />
                <StatCard label="Total Bookings" value={bookings.length} icon="📅" trend="+12%" />
                <StatCard label="Confirmed" value={bookings.filter(b => b.status === 'CONFIRMED').length} icon="✅" trend="+8%" />
                <StatCard label="Pending" value={bookings.filter(b => b.status === 'PENDING').length} icon="⏳" trend="-2%" />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Booking Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getBookingStats(bookings)}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: darkMode ? '#334155' : '#cbd5e1' }} />
                        <Legend />
                        <Line type="monotone" dataKey="confirmed" stroke="#10b981" strokeWidth={2} dot={{r: 4}} />
                        <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{r: 4}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Revenue Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getBookingStats(bookings)}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: darkMode ? '#334155' : '#cbd5e1' }} />
                        <Legend />
                        <Bar dataKey="confirmed" fill="#10b981" />
                        <Bar dataKey="pending" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-slate-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
                </div>
                {message && (
                  <div className="m-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg text-green-700 dark:text-green-400 text-sm">
                    {message}
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-950/50 border-b border-gray-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Guest</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Room</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Check-in</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Check-out</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                      {bookings.length > 0 ? (
                        bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{booking.guestName}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-slate-400">{booking.room?.name}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-slate-400">{new Date(booking.checkIn).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-slate-400">{new Date(booking.checkOut).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' :
                                booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {booking.status === 'PENDING' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpdateBooking(booking.id, 'CONFIRMED')}
                                    className="px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs font-medium transition-colors"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBooking(booking.id, 'CANCELLED')}
                                    className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded text-xs font-medium transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-slate-400">
                            No bookings yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ROOMS TAB */}
          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Room Form */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Add New Room</h3>
                <form onSubmit={handleAddRoom} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Room Code *</label>
                    <input
                      placeholder="e.g., 101"
                      value={newRoom.code}
                      onChange={(e) => setNewRoom({ ...newRoom, code: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-600 outline-none placeholder:text-gray-500 dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Room Name *</label>
                    <input
                      placeholder="e.g., Deluxe Suite"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-600 outline-none placeholder:text-gray-500 dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Capacity *</label>
                    <input
                      type="number"
                      min="1"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Price Per Night (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      value={newRoom.pricePerNight}
                      onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-600 outline-none"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-red-700 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Room
                  </button>
                </form>
              </div>

              {/* Rooms List */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Your Rooms</h3>

                {message && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg text-green-700 dark:text-green-400 text-sm">
                    {message}
                  </div>
                )}

                <div className="space-y-3">
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-800 rounded-lg hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-colors">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{room.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                            👥 {room.capacity} guests • ₹{room.pricePerNight}/night
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                      No rooms created yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ label, value, icon, trend }: { label: string; value: string | number; icon: string; trend: string }) => (
  <div className="group bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/80 dark:to-slate-800/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur">
    <div className="flex items-start justify-between mb-6">
      <div className="text-4xl p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">{icon}</div>
      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-emerald-200 dark:border-emerald-800/50">{trend}</span>
    </div>
    <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
    <h4 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-3">{value}</h4>
    <div className="h-1.5 w-12 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full group-hover:w-24 transition-all duration-300"></div>
  </div>
);
