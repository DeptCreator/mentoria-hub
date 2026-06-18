'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AuthModal({ isOpen, onClose, mode = 'login' }: { isOpen: boolean; onClose: () => void; mode?: 'login' | 'register' }) {
  const [authMode, setAuthMode] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onClose();
        router.push('/dashboard');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        onClose();
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center animate-fadeIn"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div className="relative w-full max-w-[420px] glass glass-xl p-5 sm:p-8 mx-4 animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'var(--surface)', color: 'var(--fg-dim)' }}
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'var(--accent)' }}
          >
            <span className="text-[20px]">🔐</span>
          </div>
          <h2 className="font-display text-[1.5rem] sm:text-[1.75rem] font-bold" style={{ color: 'var(--fg)' }}>
            {authMode === 'login' ? 'Welcome Back' : 'Join Mentoria'}
          </h2>
          <p className="text-[13px] sm:text-[14px] mt-1" style={{ color: 'var(--fg-dim)' }}>
            {authMode === 'login' ? 'Sign in to continue your journey' : 'Start your educational adventure'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-[var(--radius-sm)] text-[14px]"
            style={{ background: 'rgba(220,120,100,0.15)', color: '#dc7864', border: '1px solid rgba(220,120,100,0.3)' }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--fg-dim)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-[var(--radius-sm)] text-[14px] outline-none transition-all"
                style={{ background: 'var(--surface)', color: 'var(--fg)', border: '1px solid var(--border)' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--fg-dim)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-[var(--radius-sm)] text-[14px] outline-none transition-all"
              style={{ background: 'var(--surface)', color: 'var(--fg)', border: '1px solid var(--border)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--fg-dim)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[var(--radius-sm)] text-[14px] outline-none transition-all"
              style={{ background: 'var(--surface)', color: 'var(--fg)', border: '1px solid var(--border)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="Min 6 characters"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 text-[15px] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0a0a0f] border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="mt-5 text-center text-[14px]" style={{ color: 'var(--fg-dim)' }}>
          {authMode === 'login' ? (
            <>
              New here?{' '}
              <button
                onClick={() => setAuthMode('register')}
                className="font-semibold cursor-pointer transition-all"
                style={{ color: 'var(--accent)' }}
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="font-semibold cursor-pointer transition-all"
                style={{ color: 'var(--accent)' }}
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
