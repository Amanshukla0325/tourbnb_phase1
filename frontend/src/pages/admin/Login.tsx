import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AuthLayout from '@/components/AuthLayout';
import API_URL from '../../config/api';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-auth-gradient flex items-center justify-center">
      <AuthLayout title="Admin Login" description="Sign in to manage hotels and users">
      <form id="admin-login-form" onSubmit={async (e) => {
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
            if (data.role !== 'SUPER_ADMIN') {
              setError('Only admins can access this panel');
              setLoading(false);
              return;
            }
            setLoading(false);
            navigate('/admin');
            return;
          }
          const json = await res.json().catch(() => ({}));
          setError(json.error || 'Login failed');
          setLoading(false);
        } catch (err) {
          setError('Network error: ' + (err as any).message);
          setLoading(false);
        }
      }}>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm sm:text-base font-medium">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="admin@tourbnb.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="rounded-lg border-gray-300 focus:border-blue-500 text-sm sm:text-base py-2 px-3" 
            />
          </div>
        </div>
      </form>
      <div className="flex flex-col gap-2 mt-6">
        <Button 
          form="admin-login-form" 
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
          Don&apos;t have an account? <a href="/admin/signup" className="text-blue-600 hover:underline font-semibold">Sign up</a>
        </div>
        {error && <div className="text-red-500 mt-3 text-center text-xs sm:text-sm">{error}</div>}
      </div>
      </AuthLayout>
    </div>
  );
}
