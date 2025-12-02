import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Hotel {
  id: string;
  name: string;
  city?: string;
  address?: string;
  rooms?: any[];
  managers?: any[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [tab, setTab] = useState<'hotels' | 'admins' | 'managers'>('hotels');
  const [newHotel, setNewHotel] = useState({ name: '', city: '', address: '', subdomain: '' });
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', confirmPassword: '' });
  const [newManager, setNewManager] = useState({ email: '', password: '', confirmPassword: '' });
  const [managerEmail, setManagerEmail] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await fetch('http://localhost:7000/api/admin/hotels', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (res.status === 401) {
        navigate('/admin/login');
        return;
      }
      const data = await res.json();
      setHotels(data || []);
    } catch (e) {
      console.error('Failed to fetch hotels:', e);
      setError('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHotel = async () => {
    setError('');
    setMessage('');
    if (!newHotel.name || !newHotel.subdomain) {
      setError('Name and subdomain required');
      return;
    }
    try {
      const res = await fetch('http://localhost:7000/api/admin/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newHotel)
      });
      if (res.ok) {
        setNewHotel({ name: '', city: '', address: '', subdomain: '' });
        setShowHotelForm(false);
        setMessage('Hotel created successfully!');
        fetchHotels();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Failed to create hotel');
      }
    } catch (e) {
      console.error('Error creating hotel:', e);
      setError('Error creating hotel');
    }
  };

  const handleCreateAdmin = async () => {
    setError('');
    setMessage('');
    if (!newAdmin.email || !newAdmin.password) {
      setError('Email and password required');
      return;
    }
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('http://localhost:7000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: newAdmin.email, password: newAdmin.password, role: 'SUPER_ADMIN' })
      });
      if (res.status === 201) {
        setNewAdmin({ email: '', password: '', confirmPassword: '' });
        setShowAdminForm(false);
        setMessage(`Admin ${newAdmin.email} created successfully!`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to create admin');
      }
    } catch (e) {
      console.error('Error creating admin:', e);
      setError('Error creating admin');
    }
  };

  const handleCreateManager = async () => {
    setError('');
    setMessage('');
    if (!newManager.email || !newManager.password) {
      setError('Email and password required');
      return;
    }
    if (newManager.password !== newManager.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('http://localhost:7000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: newManager.email, password: newManager.password, role: 'MANAGER' })
      });
      if (res.status === 201) {
        setNewManager({ email: '', password: '', confirmPassword: '' });
        setShowManagerForm(false);
        setMessage(`Manager ${newManager.email} created successfully! Now assign them to a hotel.`);
        setTimeout(() => setMessage(''), 5000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to create manager');
      }
    } catch (e) {
      console.error('Error creating manager:', e);
      setError('Error creating manager');
    }
  };

  const handleAssignManager = async (hotelId: string) => {
    setError('');
    setMessage('');
    if (!managerEmail) {
      setError('Manager email required');
      return;
    }
    try {
      const res = await fetch(`http://localhost:7000/api/admin/hotels/${hotelId}/assign-manager`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ managerEmail })
      });
      if (res.ok) {
        setManagerEmail('');
        setSelectedHotelId('');
        setMessage('Manager assigned successfully!');
        fetchHotels();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to assign manager');
      }
    } catch (e) {
      console.error('Error assigning manager:', e);
      setError('Error assigning manager');
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:7000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/admin/login');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center gap-2">
          <h1 className="text-lg sm:text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} size="sm">Logout</Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Messages */}
        {message && <div className="mb-4 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded text-xs sm:text-sm">{message}</div>}
        {error && <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-xs sm:text-sm">{error}</div>}

        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-4 mb-6 flex-wrap">
          <Button 
            onClick={() => setTab('hotels')}
            variant={tab === 'hotels' ? 'default' : 'outline'}
            size="sm"
            className="text-xs sm:text-sm"
          >
            Hotels
          </Button>
          <Button 
            onClick={() => setTab('admins')}
            variant={tab === 'admins' ? 'default' : 'outline'}
            size="sm"
            className="text-xs sm:text-sm"
          >
            Create Admin
          </Button>
          <Button 
            onClick={() => setTab('managers')}
            variant={tab === 'managers' ? 'default' : 'outline'}
            size="sm"
            className="text-xs sm:text-sm"
          >
            Create Manager
          </Button>
        </div>

        {/* Hotels Tab */}
        {tab === 'hotels' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 gap-2">
                <h2 className="text-base sm:text-lg font-bold">My Hotels</h2>
                <Button onClick={() => setShowHotelForm(!showHotelForm)} size="sm" className="text-xs sm:text-sm">
                  {showHotelForm ? 'Cancel' : '+ Hotel'}
                </Button>
              </div>

              {showHotelForm && (
                <div className="bg-gray-50 p-4 rounded mb-4 space-y-3">
                  <Input 
                    placeholder="Hotel name" 
                    value={newHotel.name}
                    onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                    className="text-sm"
                  />
                  <Input 
                    placeholder="Subdomain (URL slug)" 
                    value={newHotel.subdomain}
                    onChange={(e) => setNewHotel({...newHotel, subdomain: e.target.value})}
                    className="text-sm"
                  />
                  <Input 
                    placeholder="City" 
                    value={newHotel.city}
                    onChange={(e) => setNewHotel({...newHotel, city: e.target.value})}
                    className="text-sm"
                  />
                  <Input 
                    placeholder="Address" 
                    value={newHotel.address}
                    onChange={(e) => setNewHotel({...newHotel, address: e.target.value})}
                    className="text-sm"
                  />
                  <Button onClick={handleCreateHotel} className="w-full text-sm">Create Hotel</Button>
                </div>
              )}
            </div>

            {/* Hotels List */}
            {hotels.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs sm:text-sm">
                No hotels yet. Create one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="mb-4 flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold">{hotel.name}</h3>
                        {hotel.city && <p className="text-xs sm:text-sm text-gray-600">📍 {hotel.city}, {hotel.address}</p>}
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{hotel.rooms?.length || 0} rooms • {hotel.managers?.length || 0} managers</p>
                      </div>
                      <Button
                        onClick={() => navigate(`/admin/hotels/${hotel.id}`)}
                        size="sm"
                        className="text-xs whitespace-nowrap"
                      >
                        Manage
                      </Button>
                    </div>

                    {/* Assign Manager */}
                    <div className="bg-gray-50 p-3 rounded flex gap-2 flex-col sm:flex-row">
                      <Input 
                        placeholder="Manager email"
                        value={selectedHotelId === hotel.id ? managerEmail : ''}
                        onChange={(e) => {
                          setSelectedHotelId(hotel.id);
                          setManagerEmail(e.target.value);
                        }}
                        className="text-sm"
                      />
                      <Button 
                        onClick={() => handleAssignManager(hotel.id)}
                        size="sm"
                        className="text-xs"
                      >
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Admin Tab */}
        {tab === 'admins' && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-4">Create New Admin</h2>
            <div className="space-y-4 max-w-md">
              <Input 
                placeholder="Admin email" 
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                className="text-sm"
              />
              <Input 
                placeholder="Password" 
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                className="text-sm"
              />
              <Input 
                placeholder="Confirm password" 
                type="password"
                value={newAdmin.confirmPassword}
                onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                className="text-sm"
              />
              <Button onClick={handleCreateAdmin} className="w-full text-sm">Create Admin</Button>
            </div>
          </div>
        )}

        {/* Create Manager Tab */}
        {tab === 'managers' && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-4">Create New Manager</h2>
            <div className="space-y-4 max-w-md">
              <Input 
                placeholder="Manager email" 
                type="email"
                value={newManager.email}
                onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                className="text-sm"
              />
              <Input 
                placeholder="Password" 
                type="password"
                value={newManager.password}
                onChange={(e) => setNewManager({...newManager, password: e.target.value})}
                className="text-sm"
              />
              <Input 
                placeholder="Confirm password" 
                type="password"
                value={newManager.confirmPassword}
                onChange={(e) => setNewManager({...newManager, confirmPassword: e.target.value})}
                className="text-sm"
              />
              <Button onClick={handleCreateManager} className="w-full text-sm">Create Manager</Button>
              <p className="text-xs text-gray-500">After creating, go to Hotels tab to assign them to a hotel.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
