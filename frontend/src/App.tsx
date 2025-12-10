import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AdminLogin from './pages/admin/Login'
import AdminSignup from './pages/admin/Signup'
import AdminDashboard from './pages/admin/Dashboard'
import AdminHotelDetails from './pages/admin/HotelDetails'
import ManagerLogin from './pages/manager/Login'
import ManagerSignup from './pages/manager/Signup'
import ManagerDashboard from './pages/manager/Dashboard'
import ManagerRooms from './pages/manager/Rooms'
import LandingPage from './pages/LandingPage'
import HotelDetails from './pages/HotelDetails'
import BookingConfirmation from './pages/BookingConfirmation'

function AppInner(){
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/admin/login') || location.pathname.startsWith('/manager/login') ||
                      location.pathname.startsWith('/admin/signup') || location.pathname.startsWith('/manager/signup');
  
  return (
    <div className="min-h-screen">
      <main>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin/signup" element={<AdminSignup/>} />
          <Route path="/admin/hotels/:id" element={<AdminHotelDetails/>} />
          <Route path="/manager/login" element={<ManagerLogin/>} />
          <Route path="/manager/signup" element={<ManagerSignup/>} />
          <Route path="/manager/rooms" element={<ManagerRooms/>} />
          <Route path="/" element={<LandingPage/>} />
          <Route path="/hotels/:id" element={<HotelDetails/>} />
          <Route path="/booking-confirmation/:id" element={<BookingConfirmation/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/manager" element={<ManagerDashboard/>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
