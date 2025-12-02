import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Plus, LogOut, Menu, X, Edit2, Trash2, Search, TrendingUp, DollarSign, Home } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  city?: string;
  address?: string;
  description?: string;
  rooms?: any[];
  managers?: any[];
}

interface Manager {
  id: string;
  email: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'managers' | 'admins'>('overview');
  
  // Forms
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  
  // Form data
  const [hotelForm, setHotelForm] = useState({ name: '', city: '', address: '', subdomain: '', description: '' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [managerForm, setManagerForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [assignForm, setAssignForm] = useState({ hotelId: '', managerEmail: '' });
  
  // Messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hotelsRes, managersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/hotels`, { credentials: 'include' }),
        fetch(`${API_URL}/api/admin/managers`, { credentials: 'include' })
      ]);

      if (hotelsRes.status === 401 || managersRes.status === 401) {
        navigate('/admin/login');
        return;
      }

      if (!hotelsRes.ok) {
        throw new Error(`Hotels API error: ${hotelsRes.status}`);
      }

      const hotelsData = await hotelsRes.json();
      setHotels(Array.isArray(hotelsData) ? hotelsData : []);
      
      // Managers endpoint might fail, so handle gracefully
      if (managersRes.ok) {
        const managersData = await managersRes.json();
        setManagers(Array.isArray(managersData) ? managersData : []);
      } else {
        // Fallback: extract managers from hotel data
        const managersSet = new Set<string>();
        const managersList: Manager[] = [];
        
        if (Array.isArray(hotelsData)) {
          hotelsData.forEach(hotel => {
            if (hotel.managers && Array.isArray(hotel.managers)) {
              hotel.managers.forEach(mgr => {
                if (mgr.manager && !managersSet.has(mgr.manager.id)) {
                  managersSet.add(mgr.manager.id);
                  managersList.push(mgr.manager);
                }
              });
            }
          });
        }
        
        setManagers(managersList);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
      setError('Failed to load data. Make sure you are logged in as an admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!hotelForm.name || !hotelForm.subdomain) {
      setError('Name and subdomain are required');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(hotelForm)
      });

      if (res.ok) {
        setMessage('Hotel created successfully!');
        setHotelForm({ name: '', city: '', address: '', subdomain: '', description: '' });
        setShowHotelForm(false);
        await fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create hotel');
      }
    } catch (e) {
      setError('Error creating hotel');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!adminForm.email || !adminForm.password) {
      setError('Email and password are required');
      return;
    }

    if (adminForm.password !== adminForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: adminForm.email, password: adminForm.password, role: 'SUPER_ADMIN' })
      });

      if (res.status === 201) {
        setMessage(`Admin ${adminForm.email} created successfully!`);
        setAdminForm({ email: '', password: '', confirmPassword: '' });
        setShowAdminForm(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create admin');
      }
    } catch (e) {
      setError('Error creating admin');
    }
  };

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!managerForm.email || !managerForm.password) {
      setError('Email and password are required');
      return;
    }

    if (managerForm.password !== managerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: managerForm.email, password: managerForm.password, role: 'MANAGER' })
      });

      if (res.status === 201) {
        setMessage(`Manager ${managerForm.email} created! Now assign to a hotel.`);
        setManagerForm({ email: '', password: '', confirmPassword: '' });
        setShowManagerForm(false);
        await fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create manager');
      }
    } catch (e) {
      setError('Error creating manager');
    }
  };

  const handleAssignManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!assignForm.hotelId || !assignForm.managerEmail) {
      setError('Please select a hotel and enter manager email');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/hotels/${assignForm.hotelId}/assign-manager`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ managerEmail: assignForm.managerEmail })
      });

      if (res.ok) {
        setMessage('Manager assigned successfully!');
        setAssignForm({ hotelId: '', managerEmail: '' });
        setShowAssignForm(false);
        await fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to assign manager');
      }
    } catch (e) {
      setError('Error assigning manager');
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/hotels/${hotelId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        setMessage('Hotel deleted successfully');
        await fetchData();
      } else {
        setError('Failed to delete hotel');
      }
    } catch (e) {
      setError('Error deleting hotel');
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/admin/login');
  };

  const filteredHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>TourBnb Admin</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg transition-all ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} p-4 space-y-2`}>
            {(['overview', 'hotels', 'managers', 'admins'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
            ✕ {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
          {(['overview', 'hotels', 'managers', 'admins'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`rounded-lg border-2 p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <div className="text-4xl mb-3">🏨</div>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Hotels</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{hotels.length}</p>
              </div>
              <div className={`rounded-lg border-2 p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <div className="text-4xl mb-3">👥</div>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Managers</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{managers.length}</p>
              </div>
              <div className={`rounded-lg border-2 p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <div className="text-4xl mb-3">🛏️</div>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Rooms</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{hotels.reduce((sum, h) => sum + (h.rooms?.length || 0), 0)}</p>
              </div>
              <div className={`rounded-lg border-2 p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <div className="text-4xl mb-3">✅</div>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Properties Active</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{hotels.filter(h => h.rooms && h.rooms.length > 0).length}</p>
              </div>
            </div>
          </div>
        )}

        {/* HOTELS TAB */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all ${
                    darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:border-blue-500 focus:outline-none`}
                />
              </div>
              <button
                onClick={() => setShowHotelForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Plus size={20} />
                Add Hotel
              </button>
            </div>

            <div className={`rounded-lg border-2 overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-slate-800' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left font-bold text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Name</th>
                      <th className={`px-6 py-4 text-left font-bold text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>City</th>
                      <th className={`px-6 py-4 text-left font-bold text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Rooms</th>
                      <th className={`px-6 py-4 text-left font-bold text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{borderColor: darkMode ? '#334155' : '#e5e7eb'}}>
                    {filteredHotels.map(hotel => (
                      <tr key={hotel.id} className={darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}>
                        <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{hotel.name}</td>
                        <td className={`px-6 py-4 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{hotel.city || 'N/A'}</td>
                        <td className={`px-6 py-4 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{hotel.rooms?.length || 0}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/hotels/${hotel.id}`)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-medium text-sm flex items-center gap-1 transition-colors"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHotel(hotel.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded font-medium text-sm flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MANAGERS TAB */}
        {activeTab === 'managers' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowManagerForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Create Manager
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-lg border-2 p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Managers List</h3>
                <div className="space-y-3">
                  {managers.map(manager => (
                    <div key={manager.id} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{manager.email}</p>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>ID: {manager.id.slice(0, 8)}...</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-lg border-2 p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assign Manager</h3>
                <form onSubmit={handleAssignManager} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Hotel</label>
                    <select
                      value={assignForm.hotelId}
                      onChange={(e) => setAssignForm({...assignForm, hotelId: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      required
                    >
                      <option value="">Select a hotel...</option>
                      {hotels.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Manager Email</label>
                    <input
                      type="email"
                      value={assignForm.managerEmail}
                      onChange={(e) => setAssignForm({...assignForm, managerEmail: e.target.value})}
                      placeholder="manager@example.com"
                      className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                  >
                    Assign
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ADMINS TAB */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowAdminForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Create Admin
            </button>

            <div className={`rounded-lg border-2 p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create New Admin</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4 max-w-md">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Email</label>
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                    placeholder="admin@example.com"
                    className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Password</label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Confirm Password</label>
                  <input
                    type="password"
                    value={adminForm.confirmPassword}
                    onChange={(e) => setAdminForm({...adminForm, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                  Create Admin
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Hotel Form Modal */}
      {showHotelForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className={`p-6 border-b ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Hotel</h2>
            </div>
            <form onSubmit={handleCreateHotel} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Hotel Name</label>
                <input
                  type="text"
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})}
                  placeholder="Grand Plaza Hotel"
                  className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Subdomain</label>
                <input
                  type="text"
                  value={hotelForm.subdomain}
                  onChange={(e) => setHotelForm({...hotelForm, subdomain: e.target.value})}
                  placeholder="grand-plaza"
                  className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>City</label>
                <input
                  type="text"
                  value={hotelForm.city}
                  onChange={(e) => setHotelForm({...hotelForm, city: e.target.value})}
                  placeholder="Mumbai"
                  className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Address</label>
                <input
                  type="text"
                  value={hotelForm.address}
                  onChange={(e) => setHotelForm({...hotelForm, address: e.target.value})}
                  placeholder="Street address"
                  className={`w-full px-4 py-2 rounded-lg border-2 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  value={hotelForm.description}
                  onChange={(e) => setHotelForm({...hotelForm, description: e.target.value})}
                  placeholder="Hotel description..."
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border-2 resize-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowHotelForm(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
