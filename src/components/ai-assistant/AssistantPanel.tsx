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
    { role: 'assistant', content: "Hello! I'm Jarvis, your AI assistant. Ask me anything about courses, opportunities, or your learning path.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          profile,
        }),
      });

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message || 'Sorry, I could not process your request.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          setLoading(true);
          const response = await fetch('/api/speech-to-text', { method: 'POST', body: formData });
          const data = await response.json();
          if (data.text) sendMessage(data.text);
        } catch (err) {
          console.error('Transcription error:', err);
        } finally {
          setLoading(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-panel fixed bottom-[100px] right-7 z-[199] flex flex-col overflow-hidden"
      style={{
        width: '380px',
        maxWidth: 'calc(100vw - 40px)',
        height: '480px',
        maxHeight: 'calc(100vh - 140px)',
        background: 'var(--bg-alt)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>
      {/* Header */}
      <div className="flex items-center justify-between px-[18px] py-[14px]" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="font-bold" style={{ color: 'var(--fg)' }}>Jarvis AI</span>
        <button onClick={onClose} className="bg-none border-none cursor-pointer text-[18px]" style={{ color: 'var(--fg)', background: 'none', border: 'none' }}>✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5" id="chatMessages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble max-w-[80%] px-4 py-2.5 text-[14px] leading-relaxed ${
            msg.role === 'user' ? 'self-end' : 'self-start'
          }`}
            style={{
              borderRadius: '18px',
              ...(msg.role === 'user'
                ? { background: 'var(--accent)', color: '#0a0a0f', borderBottomRightRadius: '4px' }
                : { background: 'var(--surface)', color: 'var(--fg)', borderBottomLeftRadius: '4px' }
              ),
            }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble self-start px-4 py-2.5 text-[14px]" style={{ background: 'var(--surface)', color: 'var(--fg-dim)', borderRadius: '18px', borderBottomLeftRadius: '4px' }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask Jarvis..."
          className="flex-1 rounded-full px-4 py-2.5 text-[14px] outline-none font-sans"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--fg)' }}
        />
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="w-10 h-10 rounded-full border-none cursor-pointer flex items-center justify-center flex-shrink-0 text-[16px] transition-all"
          style={{ background: isRecording ? '#dc7864' : 'var(--accent)', color: '#0a0a0f' }}
        >
          {isRecording ? '■' : '🎤'}
        </button>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full border-none cursor-pointer flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
          style={{ background: 'var(--accent)', color: '#0a0a0f' }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
