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
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/images/logo-icon.svg" alt="M" className="w-9 h-9" />
          <span className="font-display text-[22px] font-bold tracking-tight" style={{ color: 'var(--fg)' }}>
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
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-[20px] text-[14px] font-medium no-underline transition-all"
                style={{ background: 'var(--surface)', color: 'var(--fg)' }}
              >
                <span>{user?.email?.split('@')[0]}</span>
              </Link>
              <button
                onClick={signOut}
                className="px-4 py-2 rounded-[20px] text-[14px] font-medium cursor-pointer transition-all"
                style={{ background: 'transparent', color: 'var(--fg-dim)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-dim)'; }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-2 rounded-[20px] text-[14px] font-medium cursor-pointer transition-all"
                style={{ background: 'transparent', color: 'var(--fg-dim)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-dim)'; }}
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('register')}
                className="px-4 py-2 rounded-[20px] text-[14px] font-semibold cursor-pointer transition-all"
                style={{ background: 'var(--accent)', color: '#0a0a0f', boxShadow: '0 0 30px var(--accent-glow)' }}
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
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
        <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-6"
          style={{ background: 'var(--bg)', backdropFilter: 'blur(20px)' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-[28px] font-bold no-underline transition-all"
              style={{ color: 'var(--fg)' }}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="font-display text-[28px] font-bold no-underline" style={{ color: 'var(--accent)' }}>
              Admin
            </Link>
          )}
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-[24px] cursor-pointer" style={{ color: 'var(--fg-dim)' }}>
            ✕
          </button>
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </>
  );
}
