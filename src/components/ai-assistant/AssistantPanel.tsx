'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssistantPanel({ isOpen, onClose }: Props) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm Jarvis, your AI assistant. Ask me anything about courses, opportunities, or your academic path!", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          profile: { interests: profile?.interests, goals: profile?.goals, grade: profile?.grade }
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Sorry, I had trouble responding.', timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = async () => {
    if (!navigator.mediaDevices) {
      alert('Voice recording not supported in this browser.');
      return;
    }

    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob);

        // Transcribe
        const whisperRes = await fetch('/api/whisper', { method: 'POST', body: formData });
        const whisperData = await whisperRes.json();
        const transcript = whisperData.text || '';

        if (transcript) {
          setMessages(prev => [...prev, { role: 'user', content: transcript, timestamp: Date.now() }]);
          // Get AI response
          const chatRes = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [...messages, { role: 'user', content: transcript, timestamp: Date.now() }],
              profile: { interests: profile?.interests, goals: profile?.goals, grade: profile?.grade }
            })
          });
          const chatData = await chatRes.json();
          const aiResponse = chatData.response || 'Sorry, I had trouble responding.';
          setMessages(prev => [...prev, { role: 'assistant', content: aiResponse, timestamp: Date.now() }]);

          // Text-to-speech
          const ttsRes = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: aiResponse })
          });
          const ttsData = await ttsRes.json();
          if (ttsData.audio) {
            const audio = new Audio(`data:audio/mp3;base64,${ttsData.audio}`);
            audio.play();
          }
        }

        setIsRecording(false);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000);
    } catch (err) {
      console.error('Voice error:', err);
      setIsRecording(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[200] w-[380px] max-w-[calc(100vw-48px)] glass glass-xl flex flex-col"
      style={{ height: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <span className="text-[14px]">✨</span>
          </div>
          <div>
            <div className="font-semibold text-[14px]" style={{ color: 'var(--fg)' }}>AI Voice Assistant</div>
            <div className="text-[11px]" style={{ color: 'var(--muted)' }}>Beta</div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'var(--surface)', color: 'var(--fg-dim)' }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble-ai">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)' }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0.1s' }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 rounded-full text-[14px] outline-none"
            style={{ background: 'var(--surface)', color: 'var(--fg)', border: '1px solid var(--border)' }}
          />
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'var(--accent)', color: '#0a0a0f' }}
          >
            →
          </button>
          <button
            onClick={handleVoice}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all"
            style={{
              background: isRecording ? '#dc7864' : 'var(--surface)',
              color: isRecording ? '#fff' : 'var(--fg-dim)',
              border: '1px solid var(--border)'
            }}
          >
            🎤
          </button>
        </div>
      </div>
    </div>
  );
}
