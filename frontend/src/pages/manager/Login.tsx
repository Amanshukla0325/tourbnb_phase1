import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

export default function ManagerLogin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (res.status === 200) { 
        const data = await res.json();
        if (data.role !== 'MANAGER') {
          setError('Only managers can access this panel');
          setLoading(false);
          return;
        }
        setLoading(false); 
        navigate('/manager'); 
        return; 
      }
      const json = await res.json().catch(() => ({}));
      setError(json.error || 'Login failed');
      setLoading(false);
    } catch (err) {
      setError('Network error: ' + (err as any).message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auth-gradient flex items-center justify-center">
      <AuthLayout title="Manager Login" description="Log into your hotel manager console">
      <form id="manager-login-form" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm sm:text-base font-medium">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="manager@hotel.com" 
              value={email} 
              onChange={handleEmailChange} 
              required 
              className="rounded-lg border-gray-300 focus:border-blue-500 text-sm sm:text-base py-2 px-3" 
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm sm:text-base font-medium">Password</Label>
              <a href="#" className="text-xs sm:text-sm text-blue-600 underline-offset-4 hover:underline">Forgot?</a>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={password} 
              onChange={handlePasswordChange} 
              required 
              className="rounded-lg border-gray-300 focus:border-blue-500 text-sm sm:text-base py-2 px-3" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <Button 
            form="manager-login-form" 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 sm:py-2.5 text-sm sm:text-base transition-all duration-150" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>
          <Button 
            variant="outline" 
            className="w-full rounded-lg py-2 sm:py-2.5 font-semibold border-gray-300 text-sm sm:text-base"
          >
            Login with Google
          </Button>
          <div className="text-center text-xs sm:text-sm mt-4 text-gray-500">
            Don&apos;t have an account? <a href="/manager/signup" className="text-blue-600 hover:underline font-semibold">Sign up</a>
          </div>
          {error && <div className="text-red-500 mt-3 text-center text-xs sm:text-sm">{error}</div>}
        </div>
      </form>
      </AuthLayout>
    </div>
  );
}
