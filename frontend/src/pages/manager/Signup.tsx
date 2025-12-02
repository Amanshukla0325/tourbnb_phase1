import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { useNavigate } from 'react-router-dom';

export default function ManagerSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:7000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, role: 'MANAGER' })
      });
      if (res.status === 201) {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/manager/login'), 2000);
        return;
      }
      const json = await res.json().catch(() => ({}));
      setError(json.error || 'Signup failed');
      setLoading(false);
    } catch (err) {
      setError('Network error: ' + (err as any).message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-auth-gradient flex items-center justify-center">
        <AuthLayout title="Account Created!" description="">
          <div className="text-center">
            <div className="mb-4 text-green-600 text-lg font-semibold">✓ Success!</div>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Your account has been created. Please ask the admin to assign you to a hotel.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Redirecting to login...
            </p>
          </div>
        </AuthLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-auth-gradient flex items-center justify-center">
      <AuthLayout title="Manager Sign Up" description="Create your hotel manager account">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm sm:text-base font-medium">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="manager@hotel.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="rounded-lg border-gray-300 focus:border-blue-500 text-sm sm:text-base py-2 px-3" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm sm:text-base font-medium">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="rounded-lg border-gray-300 focus:border-blue-500 text-sm sm:text-base py-2 px-3" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-sm sm:text-base font-medium">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="rounded-lg border-gray-300 focus:border-blue-500 text-sm sm:text-base py-2 px-3" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 sm:py-2.5 text-sm sm:text-base transition-all duration-150" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <div className="text-center text-xs sm:text-sm mt-4 text-gray-500">
              Already have an account? <a href="/manager/login" className="text-blue-600 hover:underline font-semibold">Login</a>
            </div>
            {error && <div className="text-red-500 mt-3 text-center text-xs sm:text-sm">{error}</div>}
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}
