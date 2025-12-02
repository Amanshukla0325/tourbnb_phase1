
import React from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const AuthLayout = ({ title, description, children }: { title?: string; description?: string; children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#071027] p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-md lg:max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        {/* Form Section */}
        <div className="w-full flex items-center justify-center order-2 lg:order-1">
          <div className="w-full relative">
            <div className="flex justify-end mb-4"><ThemeToggle/></div>
            <div className="bg-card text-card-foreground rounded-xl sm:rounded-2xl border border-input shadow-lg sm:shadow-2xl overflow-hidden">
              <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
                {title && <h2 className="text-2xl sm:text-3xl font-semibold mb-1 text-center">{title}</h2>}
                {description && <p className="text-sm sm:text-base text-muted-foreground mb-6 text-center">{description}</p>}
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Branding Section - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex items-center justify-center order-1 lg:order-2">
          <div className="w-full max-w-lg p-8 rounded-xl overflow-hidden bg-gradient-to-b from-emerald-800 to-emerald-600 text-white shadow-xl">
            <div className="text-3xl sm:text-4xl font-serif mb-4">Welcome to Tourbnb</div>
            <p className="mb-6 text-sm sm:text-base text-emerald-200">Manage hotels, rooms and bookings. Fast, reliable and easy to use.</p>
            <div className="bg-white/10 rounded-lg p-4 w-full">
              <div className="text-base sm:text-lg font-medium">Premium Booking Platform</div>
              <div className="text-xs sm:text-sm text-emerald-200">For hotel chains worldwide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
