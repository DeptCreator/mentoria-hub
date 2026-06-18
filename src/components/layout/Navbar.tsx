'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, isAuthenticated, signOut, isAdmin } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Mentoria Hub
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/opportunities" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            Opportunities
          </Link>
          <Link href="/courses" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            Courses
          </Link>
          <Link href="/roadmap" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            Roadmap
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/dashboard" className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300">
                {user?.email}
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden gap-2 md:flex">
              <button
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                className="rounded border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center md:hidden"
          >
            <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/opportunities" className="text-gray-700 dark:text-gray-300">Opportunities</Link>
            <Link href="/courses" className="text-gray-700 dark:text-gray-300">Courses</Link>
            <Link href="/roadmap" className="text-gray-700 dark:text-gray-300">Roadmap</Link>
            {isAdmin && <Link href="/admin" className="text-gray-700 dark:text-gray-300">Admin</Link>}
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300">Dashboard</Link>
                <button onClick={() => signOut()} className="text-left text-gray-700 dark:text-gray-300">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }} className="text-left text-blue-600">Login</button>
                <button onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }} className="text-left text-blue-600">Register</button>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </nav>
  );
}
