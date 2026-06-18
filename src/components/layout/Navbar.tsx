'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/courses', label: 'Courses' },
  { href: '/roadmap', label: 'Roadmap' },
];

export default function Navbar() {
  const { user, isAuthenticated, signOut, isAdmin } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] h-[72px] flex items-center justify-between px-6 lg:px-10"
        style={{ background: 'var(--surface)', backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 no-underline">
          <img src="/images/logo-icon.svg" alt="M" className="w-8 h-8 sm:w-9 sm:h-9" />
          <span className="font-display text-[18px] sm:text-[22px] font-bold tracking-tight" style={{ color: 'var(--fg)' }}>
            Mentoria
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-[20px] text-[14px] font-medium no-underline transition-all"
              style={{ color: 'var(--fg-dim)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--fg)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-dim)'; }}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-[20px] text-[14px] font-medium no-underline transition-all"
              style={{ color: 'var(--accent)' }}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-[20px] text-[13px] sm:text-[14px] font-medium no-underline transition-all"
                style={{ background: 'var(--surface)', color: 'var(--fg)' }}
              >
                <span className="max-w-[80px] truncate">{user?.email?.split('@')[0]}</span>
              </Link>
              <button
                onClick={signOut}
                className="px-3 sm:px-4 py-2 rounded-[20px] text-[13px] sm:text-[14px] font-medium cursor-pointer transition-all"
                style={{ background: 'transparent', color: 'var(--fg-dim)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-dim)'; }}
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => openAuth('login')}
                className="hidden sm:inline-flex px-4 py-2 rounded-[20px] text-[14px] font-medium cursor-pointer transition-all"
                style={{ background: 'transparent', color: 'var(--fg-dim)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-dim)'; }}
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('register')}
                className="px-3 sm:px-4 py-2 rounded-[20px] text-[13px] sm:text-[14px] font-semibold cursor-pointer transition-all"
                style={{ background: 'var(--accent)', color: '#0a0a0f', boxShadow: '0 0 30px var(--accent-glow)' }}
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Join</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-full active-press"
            style={{ background: 'var(--surface)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="w-5 h-0.5 rounded transition-all" style={{ background: 'var(--fg)', transform: mobileMenuOpen ? 'rotate(45deg) translateY(4px)' : 'none' }} />
            <span className="w-5 h-0.5 rounded transition-all" style={{ background: 'var(--fg)', opacity: mobileMenuOpen ? 0 : 1 }} />
            <span className="w-5 h-0.5 rounded transition-all" style={{ background: 'var(--fg)', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-5 px-6"
          style={{ background: 'var(--bg)', backdropFilter: 'blur(20px)' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-[clamp(1.5rem,6vw,2rem)] font-bold no-underline transition-all py-2"
              style={{ color: 'var(--fg)' }}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-display text-[clamp(1.5rem,6vw,2rem)] font-bold no-underline py-2" style={{ color: 'var(--accent)' }}>
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="font-display text-[clamp(1.5rem,6vw,2rem)] font-bold no-underline py-2" style={{ color: 'var(--accent)' }}>
              Admin
            </Link>
          )}

          {/* Mobile auth actions */}
          <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-[260px]">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuth('login'); }}
                  className="w-full py-3 rounded-[20px] text-[15px] font-semibold cursor-pointer"
                  style={{ background: 'var(--surface)', color: 'var(--fg)' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuth('register'); }}
                  className="w-full py-3 rounded-[20px] text-[15px] font-semibold cursor-pointer"
                  style={{ background: 'var(--accent)', color: '#0a0a0f' }}
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); signOut(); }}
                className="w-full py-3 rounded-[20px] text-[15px] font-semibold cursor-pointer"
                style={{ background: 'var(--surface)', color: 'var(--fg)' }}
              >
                Logout
              </button>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center text-[20px] cursor-pointer active-press" style={{ background: 'var(--surface)', color: 'var(--fg-dim)' }}>
            ✕
          </button>
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </>
  );
}
