'use client';

import { useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
}
