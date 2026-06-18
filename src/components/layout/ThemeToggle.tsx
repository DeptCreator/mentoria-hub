'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1.5 rounded-[20px] text-sm font-medium transition-all cursor-pointer font-sans"
      style={{ background: 'transparent', color: 'var(--fg-dim)', border: 'none', fontSize: '16px', lineHeight: '1' }}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀' : '🌙'}
    </button>
  );
}
