'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/types';
import { Send, Mic, X, Sparkles, Volume2, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssistantPanel({ isOpen, onClose }: Props) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm Jarvis, your AI mentor. Ask me about courses, opportunities, or your academic roadmap.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    await processUserMessage(input.trim());
    setInput('');
  };

  const processUserMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
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
      const aiResponse = data.response || 'Sorry, I had trouble responding.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse, timestamp: Date.now() }]);
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

        try {
          const whisperRes = await fetch('/api/speech-to-text', { method: 'POST', body: formData });
          const whisperData = await whisperRes.json();
          const transcript = whisperData.text || '';

          if (transcript) {
            await processUserMessage(transcript);
          }
        } catch (err) {
          console.error('Speech-to-text error:', err);
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

  const speakLastResponse = async () => {
    const lastAi = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAi) return;

    setIsSpeaking(true);
    try {
      const ttsRes = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lastAi.content })
      });
      const ttsData = await ttsRes.json();
      if (ttsData.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${ttsData.audio}`);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 sm:bottom-24 left-0 sm:left-auto right-0 sm:right-4 md:right-6 z-[200] w-full sm:w-[380px] md:w-[400px] sm:max-w-[calc(100vw-32px)] glass glass-xl flex flex-col overflow-hidden h-[100dvh] sm:h-[520px] rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)]"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#0a0a0f' }} />
          </div>
          <div>
            <div className="font-semibold text-[14px]" style={{ color: 'var(--fg)' }}>Jarvis AI Mentor</div>
            <div className="text-[11px] flex items-center gap-1" style={{ color: 'var(--muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#63b388' }} />
              Online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={speakLastResponse} disabled={isSpeaking}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
            style={{ background: isSpeaking ? 'var(--accent)' : 'transparent', color: 'var(--fg-dim)' }}
            title="Read last response"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--surface)]"
            style={{ color: 'var(--fg-dim)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface)' }}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" style={{ color: '#0a0a0f' }} /> : <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />}
            </div>
            <div
              className={`max-w-[78%] px-4 py-2.5 text-[14px] leading-relaxed ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--surface)' }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            </div>
            <div className="chat-bubble-ai">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0.1s' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Jarvis anything..."
            className="flex-1 glass-input py-2.5"
            disabled={isRecording}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all active-press"
            style={{ background: 'var(--accent)', color: '#0a0a0f', opacity: !input.trim() || loading ? 0.5 : 1 }}
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={handleVoice}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all active-press"
            style={{
              background: isRecording ? '#dc7864' : 'var(--bg)',
              color: isRecording ? '#fff' : 'var(--fg-dim)',
              border: '1px solid var(--border)'
            }}
            title={isRecording ? 'Recording...' : 'Voice input'}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        {isRecording && (
          <p className="text-[11px] text-center mt-2 animate-pulse" style={{ color: '#dc7864' }}>Recording... Speak now</p>
        )}
      </div>
    </div>
  );
}
