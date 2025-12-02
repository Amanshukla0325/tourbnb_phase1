import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Building2, MapPin, Users, ArrowLeft, Star, Check, Wifi, Coffee, Car, Bed, Shield, Clock, ChevronRight, Calendar as CalendarIcon, User, Mail, Phone, MessageSquare } from 'lucide-react';
import API_URL from '../config/api';

interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
}

// Dynamic holiday generator for India (2025-2027)
function getHolidaysForMonth(month: number, year: number) {
  const holidays: { [key: string]: { name: string; emoji: string } } = {
    // 2025 - Correct dates for all festivals
    '2025-01-26': { name: 'Republic Day', emoji: '🇮🇳' },
    '2025-03-14': { name: 'Maha Shivaratri', emoji: '🕉️' },
    '2025-03-29': { name: 'Holi', emoji: '🎨' },
    '2025-03-31': { name: 'Eid ul-Fitr', emoji: '🌙' },
    '2025-04-18': { name: 'Ram Navami', emoji: '🙏' },
    '2025-04-21': { name: 'Mahavir Jayanti', emoji: '✨' },
    '2025-05-05': { name: 'Buddha Purnima', emoji: '🧘' },
    '2025-06-10': { name: 'Eid ul-Adha', emoji: '🕌' },
    '2025-07-31': { name: 'Muharram', emoji: '📅' },
    '2025-08-15': { name: 'Independence Day', emoji: '🇮🇳' },
    '2025-08-26': { name: 'Janmashtami', emoji: '🪈' },
    '2025-09-16': { name: 'Milad un-Nabi', emoji: '📿' },
    '2025-10-02': { name: 'Gandhi Jayanti', emoji: '🌿' },
    '2025-10-12': { name: 'Dussehra', emoji: '🎪' },
    '2025-10-20': { name: 'Diwali', emoji: '🪔' },
    '2025-11-05': { name: 'Guru Nanak Jayanti', emoji: '✡️' },
    '2025-12-25': { name: 'Christmas', emoji: '🎄' },
    // 2026
    '2026-01-26': { name: 'Republic Day', emoji: '🇮🇳' },
    '2026-03-03': { name: 'Maha Shivaratri', emoji: '🕉️' },
    '2026-03-29': { name: 'Holi', emoji: '🎨' },
    '2026-04-02': { name: 'Good Friday', emoji: '✝️' },
    '2026-04-14': { name: 'Ambedkar Jayanti', emoji: '📚' },
    '2026-05-01': { name: 'Labour Day', emoji: '✊' },
    '2026-05-24': { name: 'Buddha Purnima', emoji: '🧘' },
    '2026-08-15': { name: 'Independence Day', emoji: '🇮🇳' },
    '2026-10-02': { name: 'Gandhi Jayanti', emoji: '🌿' },
    '2026-12-25': { name: 'Christmas', emoji: '🎄' },
    // 2027
    '2027-01-26': { name: 'Republic Day', emoji: '🇮🇳' },
    '2027-02-22': { name: 'Maha Shivaratri', emoji: '🕉️' },
    '2027-03-28': { name: 'Holi', emoji: '🎨' },
    '2027-08-15': { name: 'Independence Day', emoji: '🇮🇳' },
    '2027-10-02': { name: 'Gandhi Jayanti', emoji: '🌿' },
    '2027-12-25': { name: 'Christmas', emoji: '🎄' },
  };

  const monthStr = String(month + 1).padStart(2, '0');
  const yearStr = String(year);
  const prefix = `${yearStr}-${monthStr}`;

  const monthHolidays: { [key: string]: { name: string; emoji: string } } = {};
  Object.entries(holidays).forEach(([dateStr, holiday]) => {
    if (dateStr.startsWith(prefix)) {
      monthHolidays[dateStr] = holiday;
    }
  });

  return monthHolidays;
}

// Calendar with navigation buttons
function CalendarWithNavigation({ dateRange, setDateRange }: { dateRange: DateRange | undefined; setDateRange: (range: DateRange | undefined) => void }) {
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());

  const goToPreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const canGoPrevious = !(displayMonth === new Date().getMonth() && displayYear === new Date().getFullYear());

  return (
    <div className="space-y-6">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            canGoPrevious
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          ← Previous
        </button>

        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            {new Date(displayYear, displayMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all cursor-pointer"
        >
          Next →
        </button>
      </div>

      {/* Calendars - Show 2 months when possible */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CalendarGrid
          month={displayMonth}
          year={displayYear}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Show next month if not at year boundary */}
        <CalendarGrid
          month={displayMonth === 11 ? 0 : displayMonth + 1}
          year={displayMonth === 11 ? displayYear + 1 : displayYear}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
    </div>
  );
}

function CalendarGrid({ month, year, dateRange, setDateRange }: { month: number; year: number; dateRange: DateRange | undefined; setDateRange: (range: DateRange | undefined) => void }) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Get holidays for this month
  const monthHolidays = getHolidaysForMonth(month, year);

  const dates = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(year, month, i));
  }

  const getHolidayInfo = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return monthHolidays[dateStr] || null;
  };

  const isInRange = (date: Date) => {
    if (!dateRange?.from || !dateRange?.to) return false;
    return date > dateRange.from && date < dateRange.to;
  };

  const isStartDate = (date: Date) => {
    return dateRange?.from && date.toDateString() === dateRange.from.toDateString();
  };

  const isEndDate = (date: Date) => {
    return dateRange?.to && date.toDateString() === dateRange.to.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (isPast(date)) return;
    
    if (!dateRange?.from) {
      setDateRange({ from: date, to: undefined });
    } else if (!dateRange?.to) {
      if (date < dateRange.from) {
        setDateRange({ from: date, to: dateRange.from });
      } else {
        setDateRange({ from: dateRange.from, to: date });
      }
    } else {
      setDateRange({ from: date, to: undefined });
    }
  };

  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
      <h3 className="text-xl font-bold text-center text-gray-900 mb-6">{monthName}</h3>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {daysShort.map((day, i) => (
          <div key={i} className="text-center font-bold text-sm text-blue-700 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Date Grid - Symmetrical Squares */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const holiday = getHolidayInfo(date);
          const inRange = isInRange(date);
          const isStart = isStartDate(date);
          const isEnd = isEndDate(date);
          const isPastDate = isPast(date);

          let bgColor = 'bg-white hover:bg-blue-50';
          let textColor = 'text-gray-900';
          let borderColor = 'border-2 border-gray-200';
          let shadow = 'shadow-sm hover:shadow-md';

          if (isPastDate) {
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-400';
            borderColor = 'border-2 border-gray-300';
            shadow = 'shadow-none';
          } else if (isStart || isEnd) {
            bgColor = 'bg-gradient-to-br from-blue-600 to-blue-500';
            textColor = 'text-white';
            borderColor = 'border-2 border-blue-700';
            shadow = 'shadow-lg shadow-blue-400/40';
          } else if (inRange) {
            bgColor = 'bg-gradient-to-r from-blue-200 to-indigo-200';
            textColor = 'text-blue-900';
            borderColor = 'border-2 border-blue-400';
            shadow = 'shadow-md';
          } else if (!isPastDate) {
            shadow = 'cursor-pointer hover:shadow-md';
          }

          return (
            <div key={date.toISOString()} className="relative group">
              <button
                onClick={() => handleDateClick(date)}
                disabled={isPastDate}
                className={`
                  w-full aspect-square rounded-lg font-bold text-sm transition-all duration-300 relative
                  ${bgColor} ${textColor} ${borderColor} ${shadow}
                  ${!isPastDate ? 'hover:border-blue-500' : 'cursor-not-allowed'}
                  ${holiday && !isPastDate ? 'ring-2 ring-orange-400' : ''}
                  flex items-center justify-center
                `}
              >
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="font-bold text-base">{date.getDate()}</span>
                  {holiday && (
                    <span className="text-xs">{holiday.emoji}</span>
                  )}
                </div>
              </button>

              {/* Holiday Name Tooltip */}
              {holiday && !isPastDate && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-lg pointer-events-none">
                  {holiday.name}
                </div>
              )}

              {/* Selection Labels */}
              {isStart && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap pointer-events-none">
                  In
                </div>
              )}
              {isEnd && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-1 py-0.5 rounded text-xs font-bold whitespace-nowrap pointer-events-none">
                  Out
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Hotel {
  id: string;
  name: string;
  city?: string;
  address?: string;
  description?: string;
  photos?: string[];
  rooms?: Room[];
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
}

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [darkMode] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hotels/${id}`);
        const data = await res.json();
        setHotel(data);
        if (data.rooms && data.rooms.length > 0) {
          setSelectedRoom(data.rooms[0]);
        }
      } catch (e) {
        console.error('Failed to fetch hotel:', e);
        setError('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to && selectedRoom) {
      const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 0) {
        setNights(daysDiff);
        setTotalPrice(daysDiff * selectedRoom.pricePerNight);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  }, [dateRange, selectedRoom]);

  const handleBooking = async () => {
    if (!selectedRoom || !dateRange?.from || !dateRange?.to || !guestName || !guestEmail) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setBooking(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel!.id,
          roomId: selectedRoom.id,
          checkIn: dateRange.from.toISOString(),
          checkOut: dateRange.to.toISOString(),
          guestName,
          guestEmail,
          guestPhone,
          notes
        })
      });

      if (res.ok) {
        const bookingData = await res.json();
        const bookingInfo = {
          ...bookingData,
          hotelName: hotel!.name,
          roomName: selectedRoom.name,
          totalPrice: Math.round(totalPrice * 1.1),
          nights
        };
        sessionStorage.setItem(`booking-${bookingData.id}`, JSON.stringify(bookingInfo));
        sessionStorage.setItem('lastBooking', JSON.stringify(bookingInfo));
        navigate(`/booking-confirmation/${bookingData.id}`);
      } else {
        const err = await res.json();
        setError(err.error || 'Booking failed');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600 mb-6">The hotel you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Hotels</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-gray-900">TourBnb</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hotel Hero */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Image Banner */}
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-500 to-indigo-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-24 h-24 text-white/30" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-white/50'} />
                ))}
                <span className="text-white/80 text-sm ml-2">4.5 (128 reviews)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin size={18} />
                <span>{hotel.city || 'Location not specified'}</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <p className="text-gray-600 text-lg leading-relaxed">
              {hotel.description || 'Experience comfort and luxury at this wonderful property. A perfect getaway for travelers seeking quality accommodation.'}
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              {[
                { icon: Wifi, label: 'Free WiFi' },
                { icon: Coffee, label: 'Breakfast' },
                { icon: Car, label: 'Parking' },
                { icon: Bed, label: 'King Beds' },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <Icon size={18} className="text-blue-600" />
                  <span className="text-gray-700 font-medium text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Rooms */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
              
              {hotel.rooms && hotel.rooms.length > 0 ? (
                <div className="space-y-4">
                  {hotel.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedRoom?.id === room.id
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
                            {selectedRoom?.id === room.id && (
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                <Check size={12} />
                                Selected
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users size={16} />
                              <span className="text-sm">Up to {room.capacity} guests</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bed size={16} />
                              <span className="text-sm">1 King Bed</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₹{room.pricePerNight.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">per night</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No rooms available at this time</p>
                </div>
              )}
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Select Your Dates</h2>
              <p className="text-gray-600 text-base mb-8 font-medium">Pick your check-in and check-out dates to see availability</p>
              
              {/* Desktop Calendar View with Navigation */}
              <div className="hidden lg:block space-y-8">
                <CalendarWithNavigation dateRange={dateRange} setDateRange={setDateRange} />
              </div>

              {/* Mobile Calendar View - Use custom calendar */}
              <div className="lg:hidden space-y-8">
                <CalendarWithNavigation dateRange={dateRange} setDateRange={setDateRange} />
              </div>

              {/* Selected Dates Display */}
              {dateRange?.from && dateRange?.to && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-3 border-blue-300 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <CalendarIcon className="text-blue-600 flex-shrink-0 w-8 h-8" />
                        <div>
                          <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Your Perfect Trip</p>
                          <p className="font-bold text-gray-900 text-2xl">
                            {format(dateRange.from, 'MMM d')} – {format(dateRange.to, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center flex-wrap gap-3 mt-4">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold text-lg shadow-md">
                          {nights} night{nights !== 1 ? 's' : ''}
                        </span>
                        <span className="px-4 py-2 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-md">
                          {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDateRange(undefined)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl whitespace-nowrap text-lg"
                    >
                      Change Dates
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!dateRange?.from && !dateRange?.to && (
                <div className="mt-8 p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-3 border-dashed border-gray-300 text-center">
                  <CalendarIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-bold text-xl">No dates selected yet</p>
                  <p className="text-gray-600 mt-2 text-base">Click on your arrival date above to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Booking</h2>

              {selectedRoom && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Selected Room</p>
                  <p className="font-bold text-gray-900">{selectedRoom.name}</p>
                  <p className="text-blue-600 font-semibold">₹{selectedRoom.pricePerNight.toLocaleString()}/night</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare size={16} className="inline mr-2" />
                    Special Requests
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Price Summary */}
              {selectedRoom && nights > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>₹{selectedRoom.pricePerNight.toLocaleString()} × {nights} nights</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service fee</span>
                    <span>₹{Math.round(totalPrice * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{Math.round(totalPrice * 1.1).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={booking || !selectedRoom || !dateRange?.from || !dateRange?.to}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {booking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <ChevronRight size={20} />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-6 text-gray-500 text-xs">
                <div className="flex items-center gap-1">
                  <Shield size={14} />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>Instant Confirm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
