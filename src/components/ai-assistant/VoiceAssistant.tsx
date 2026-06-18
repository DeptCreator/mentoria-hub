'use client';

import { useState } from 'react';
import AssistantPanel from './AssistantPanel';
import { Mic } from 'lucide-react';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
      >
        <Mic className="h-6 w-6" />
      </button>
      <AssistantPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
