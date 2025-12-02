import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface BookingDetails {
  id: string;
  hotelId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes?: string;
  createdAt: string;
  room?: {
    name: string;
    pricePerNight: number;
  };
  hotel?: {
    name: string;
    city: string;
  };
}

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Try session storage first (for bookings made in current session)
        let data = null;
        const sessionBooking = sessionStorage.getItem(`booking-${id}`);
        
        if (sessionBooking) {
          data = JSON.parse(sessionBooking);
        } else {
          // Fallback: try to fetch from API
          const res = await fetch(`http://localhost:7000/api/bookings/${id}`, {
            credentials: 'include'
          });
          if (res.ok) {
            data = await res.json();
          }
        }

        if (data) {
          setBooking(data);
          
          // Use stored prices if available, otherwise calculate
          if (data.totalPrice !== undefined && data.nights !== undefined) {
            setNights(data.nights);
            setTotalPrice(data.totalPrice);
          } else {
            // Calculate if not provided
            const start = new Date(data.checkIn);
            const end = new Date(data.checkOut);
            const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            setNights(days);
            setTotalPrice(days * (data.room?.pricePerNight || 100));
          }
        }
      } catch (e) {
        console.error('Failed to fetch booking:', e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Booking not found</p>
          <Button onClick={() => navigate('/')}>Back to Hotels</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600">Tourbnb</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 text-center">
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-green-100">
              <span className="text-3xl sm:text-5xl">✓</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Your reservation has been successfully created. Your payment has been processed.
          </p>

          {/* Confirmation Number */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
            <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
            <p className="text-xl sm:text-3xl font-mono font-bold text-green-600 break-all">
              #{booking.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Save this number for your records
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Guest Information */}
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Guest Information
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Full Name</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {booking.guestName}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Email</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 break-all">
                  {booking.guestEmail}
                </p>
              </div>
              {booking.guestPhone && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {booking.guestPhone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hotel & Room Information */}
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Hotel & Room
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {booking.hotel && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Hotel</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {booking.hotel.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    📍 {booking.hotel.city}
                  </p>
                </div>
              )}
              {booking.room && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Room</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {booking.room.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Check-in/out & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Dates */}
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Your Stay
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Check-in</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {format(new Date(booking.checkIn), 'EEE, MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Check-out</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {format(new Date(booking.checkOut), 'EEE, MMMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Payment Details
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {booking.room && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {booking.room.pricePerNight ? `₹${booking.room.pricePerNight} × ${nights} ${nights === 1 ? 'night' : 'nights'}` : ''}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              <div className="border-t pt-3 sm:pt-4 flex justify-between">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  Total Paid
                </span>
                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-lg">✓</span>
                  <span className="font-semibold text-sm sm:text-base">Payment Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.notes && (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Special Requests
            </h2>
            <p className="text-gray-700 text-base">{booking.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-600 text-center mb-4">
              A confirmation email has been sent to <strong>{booking.guestEmail}</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Back to Hotels
              </Button>
              <Button
                onClick={() => window.print()}
                className="w-full"
              >
                Print Confirmation
              </Button>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Questions about your booking?</p>
          <p className="mt-1">Contact us at <strong>support@tourbnb.com</strong></p>
        </div>
      </div>
    </div>
  );
}
