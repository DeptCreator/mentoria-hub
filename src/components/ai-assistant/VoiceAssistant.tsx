'use client';

import { useState } from 'react';
import AssistantPanel from './AssistantPanel';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Voice FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-7 right-7 z-[200] w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center transition-all"
        style={{
          background: 'var(--accent)',
          boxShadow: '0 8px 40px var(--accent-glow)',
          color: '#0a0a0f',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 12px 50px var(--accent-glow)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 40px var(--accent-glow)'; }}
        aria-label="Open Jarvis assistant"
        title="AI Assistant Jarvis"
      >
        {/* Pulse ring */}
        <span className="absolute -inset-[6px] rounded-full" style={{ border: '2px solid var(--accent)', animation: 'pulseRing 2s ease-out infinite' }} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </button>
      <AssistantPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
