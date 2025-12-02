import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function ManagerLoginNew() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('manager@tourbnb.local');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:7000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, role: 'MANAGER' })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user.role === 'MANAGER') {
          navigate('/manager');
        } else {
          setError('Invalid role. Manager access required.');
        }
      } else {
        const err = await res.json();
        setError(err.error || 'Login failed. Please try again.');
      }
    } catch (e) {
      console.error('Login error:', e);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-8">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Hotel Manager</h1>
          <p className="text-xl text-white/80">Manage your properties and bookings seamlessly</p>
        </div>

        <div className="relative z-10">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">50+ Hotels</h3>
                <p className="text-white/70">Managed successfully</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">₹25L+ Revenue</h3>
                <p className="text-white/70">Generated annually</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">24/7 Support</h3>
                <p className="text-white/70">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12 text-center lg:text-left">
            <div className="inline-flex lg:hidden items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-4 mx-auto lg:mx-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-base text-gray-600">Sign in to manage your hotel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 bg-slate-100 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600/50 transition text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-900">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => navigate('/manager/forgot-password')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 px-4 bg-slate-100 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600/50 transition text-gray-900 placeholder:text-gray-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              />
              <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition duration-200 transform hover:scale-105 active:scale-95"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600 font-medium">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-gray-900 font-medium"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-gray-900 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/manager/signup')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition"
              >
                Contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
