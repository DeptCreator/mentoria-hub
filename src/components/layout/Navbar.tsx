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
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] h-[60px] flex items-center justify-between px-6"
        style={{
          background: 'rgba(10,10,15,0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="font-display text-[26px] font-bold tracking-tight" style={{ color: 'var(--accent)' }}>M</span>
          <span className="font-display text-[20px] font-bold tracking-tight" style={{ color: 'var(--fg)' }}>Mentoria</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1.5">
          {[
            { href: '/opportunities', label: 'Opportunities' },
            { href: '/courses', label: 'Courses' },
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/roadmap', label: 'Roadmap' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-[20px] text-sm font-medium no-underline transition-all"
              style={{ color: 'var(--fg-dim)' }}
              onMouseOver={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.background = 'var(--surface)'; }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--fg-dim)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="px-4 py-2 rounded-[20px] text-sm font-medium no-underline" style={{ color: 'var(--fg-dim)' }}>
              Admin
            </Link>
          )}
          <span className="w-[1px] h-5 mx-1.5" style={{ background: 'var(--border)' }} />
          <ThemeToggle />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard" className="text-sm font-medium no-underline" style={{ color: 'var(--fg-dim)' }}>
                {user?.email}
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer font-sans"
                style={{ background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-strong)' }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--surface)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer font-sans"
                style={{ background: 'var(--accent)', color: '#0a0a0f', boxShadow: '0 0 40px var(--accent-glow)' }}
                onMouseOver={e => { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}
              >
                Login
              </button>
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden flex-col gap-[5px] p-2 cursor-pointer bg-none border-none"
            style={{ background: 'none', border: 'none' }}
            aria-label="Menu"
          >
            <span className="block h-[2px] w-[22px] rounded" style={{ background: 'var(--fg)', transition: '0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translateY(4px)' : '' }} />
            <span className="block h-[2px] w-[22px] rounded" style={{ background: 'var(--fg)', transition: '0.3s', opacity: mobileMenuOpen ? 0 : 1 }} />
            <span className="block h-[2px] w-[22px] rounded" style={{ background: 'var(--fg)', transition: '0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-4px)' : '' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[105] flex flex-col items-center justify-center gap-6" style={{ background: 'var(--bg)' }}>
          {[
            { href: '/opportunities', label: 'Opportunities' },
            { href: '/courses', label: 'Courses' },
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/roadmap', label: 'Roadmap' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[22px] font-medium no-underline transition-all"
              style={{ color: 'var(--fg-dim)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && <Link href="/admin" className="text-[22px] font-medium no-underline" style={{ color: 'var(--fg-dim)' }} onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
          <span className="w-10 h-px my-2" style={{ background: 'var(--border)' }} />
          {isAuthenticated ? (
            <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-[22px] font-medium bg-none border-none cursor-pointer" style={{ color: 'var(--fg-dim)', background: 'none', border: 'none' }}>Logout</button>
          ) : (
            <>
              <button onClick={() => { setAuthMode('login'); setAuthModalOpen(true); setMobileMenuOpen(false); }} className="text-[22px] font-medium bg-none border-none cursor-pointer" style={{ color: 'var(--fg-dim)', background: 'none', border: 'none' }}>Login</button>
              <button onClick={() => { setAuthMode('register'); setAuthModalOpen(true); setMobileMenuOpen(false); }} className="text-[22px] font-medium bg-none border-none cursor-pointer" style={{ color: 'var(--fg-dim)', background: 'none', border: 'none' }}>Register</button>
            </>
          )}
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </>
  );
}
