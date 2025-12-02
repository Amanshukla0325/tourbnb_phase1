import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Menu, X, Building2, ChevronRight, Sparkles, Star, Moon, Sun, ArrowRight, Bed, Coffee, Wifi, Car } from 'lucide-react';
import API_URL from '../config/api';

interface Hotel {
  id: string;
  name: string;
  city?: string;
  address?: string;
  description?: string;
  rooms?: any[];
  imageUrl?: string;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (city?: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const url = city 
        ? `${API_URL}/api/hotels?city=${encodeURIComponent(city)}`
        : `${API_URL}/api/hotels`;
      const res = await fetch(url);
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch hotels:', e);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchHotels(cityFilter || undefined);
  };

  const handleHotelClick = (hotelId: string) => {
    navigate(`/hotels/${hotelId}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-gray-100'} backdrop-blur-xl border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tour<span className="text-blue-600">Bnb</span>
                </h1>
                <p className={`text-xs hidden sm:block ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Premium Stays</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => navigate('/admin/login')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Admin
              </button>
              <button 
                onClick={() => navigate('/manager/login')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                List Property
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'} p-4 space-y-3`}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button 
              onClick={() => { navigate('/admin/login'); setMobileMenuOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl font-medium ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Admin Login
            </button>
            <button 
              onClick={() => { navigate('/manager/login'); setMobileMenuOpen(false); }}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
            >
              List Your Property
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className={`relative pt-24 sm:pt-32 pb-20 sm:pb-32 px-4 overflow-hidden ${darkMode ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-b from-blue-50 via-white to-white'}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${darkMode ? 'bg-blue-600/20' : 'bg-blue-400/30'}`}></div>
          <div className={`absolute top-60 -left-40 w-80 h-80 rounded-full blur-3xl ${darkMode ? 'bg-indigo-600/20' : 'bg-indigo-400/30'}`}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${darkMode ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-600'} shadow-lg`}>
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-sm font-medium">Discover Premium Stays Worldwide</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-center mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Find Your Perfect
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Getaway
            </span>
          </h1>

          <p className={`text-lg sm:text-xl text-center max-w-2xl mx-auto mb-12 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Explore curated hotels, resorts, and unique stays. Book directly for the best rates and exclusive perks.
          </p>

          {/* Search Box */}
          <div className={`max-w-5xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl ${darkMode ? 'bg-slate-900/80 border border-slate-800' : 'bg-white border border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div className="md:col-span-1">
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Location
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Where to?"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all font-medium ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                </div>
              </div>

              {/* Check-in */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Check-in
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all font-medium ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                </div>
              </div>

              {/* Check-out */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Check-out
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all font-medium ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                </div>
              </div>

              {/* Guests & Search */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Guests
                  </label>
                  <div className="relative">
                    <Users className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all font-medium appearance-none ${
                        darkMode 
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                      } focus:outline-none`}
                    >
                      {[1,2,3,4,5,6].map(n => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="h-[58px] px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Search size={20} />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-12">
            {[
              { value: '500+', label: 'Properties' },
              { value: '50K+', label: 'Happy Guests' },
              { value: '100+', label: 'Cities' },
              { value: '4.9', label: 'Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section className={`py-16 sm:py-24 px-4 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {searched ? `Found ${hotels.length} Hotels` : 'Featured Properties'}
              </h2>
              <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Handpicked accommodations for your perfect stay
              </p>
            </div>
            <button className={`flex items-center gap-2 font-semibold transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              View all properties
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && hotels.length === 0 && searched && (
            <div className={`text-center py-20 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-white'} border ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
              <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <Building2 className={`w-10 h-10 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No hotels found</h3>
              <p className={`${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Try a different city or adjust your search criteria</p>
            </div>
          )}

          {/* Hotels Grid */}
          {!loading && hotels.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {hotels.map((hotel, index) => (
                <div
                  key={hotel.id}
                  onClick={() => handleHotelClick(hotel.id)}
                  className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                    darkMode 
                      ? 'bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10' 
                      : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-2xl'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-700' : 'bg-gradient-to-br from-blue-100 to-indigo-100'}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className={`w-16 h-16 ${darkMode ? 'text-slate-600' : 'text-blue-300'}`} />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-gray-900">
                        Featured
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-gray-900 shadow-lg">
                        From ₹{((index + 1) * 999).toLocaleString()}/night
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < 4 ? 'fill-yellow-400 text-yellow-400' : darkMode ? 'text-slate-600' : 'text-gray-300'} />
                      ))}
                      <span className={`text-sm ml-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>4.0 (120 reviews)</span>
                    </div>

                    <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {hotel.name}
                    </h3>

                    <div className={`flex items-center gap-2 mb-4 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      <MapPin size={16} />
                      <span className="text-sm">{hotel.city || 'Unknown City'}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      {[Wifi, Coffee, Car, Bed].map((Icon, i) => (
                        <div key={i} className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                          <Icon size={16} className={darkMode ? 'text-slate-400' : 'text-gray-500'} />
                        </div>
                      ))}
                    </div>

                    <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div>
                        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{hotel.rooms?.length || 1} rooms available</span>
                      </div>
                      <button className="flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        View Details
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 sm:py-24 px-4 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose TourBnb?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              We're committed to making your travel experience seamless and memorable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏆', title: 'Best Price Guarantee', description: 'Find a lower price? We\'ll match it and give you 10% off.' },
              { icon: '🔒', title: 'Secure Booking', description: 'Your payment is protected with bank-level encryption.' },
              { icon: '💬', title: '24/7 Support', description: 'Our travel experts are available around the clock.' }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-2xl text-center transition-all hover:-translate-y-1 ${darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                <p className={darkMode ? 'text-slate-400' : 'text-gray-600'}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 sm:py-24 px-4 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Join thousands of travelers who trust TourBnb.</p>
              <button 
                onClick={() => navigate('/manager/login')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                List Your Property Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>TourBnb</span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>© 2024 TourBnb. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
