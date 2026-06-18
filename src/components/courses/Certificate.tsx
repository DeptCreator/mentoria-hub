'use client';

import { Award, Download, Share2 } from 'lucide-react';

interface Props {
  courseName: string;
  studentName: string;
  completionDate: string;
  certificateNumber: string;
}

export default function Certificate({ courseName, studentName, completionDate, certificateNumber }: Props) {
  return (
    <div className="glass glass-xl p-10 text-center relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', borderColor: 'var(--accent)' }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, var(--accent), transparent 60%)' }} />
      
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(201,169,110,0.18)', border: '2px solid var(--accent)' }}>
          <Award className="w-10 h-10" style={{ color: 'var(--accent)' }} />
        </div>
        
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--accent)' }}>Certificate of Completion</p>
        <h3 className="font-display text-[28px] font-bold mb-1" style={{ color: 'var(--fg)' }}>{studentName}</h3>
        <p className="text-[14px] mb-4" style={{ color: 'var(--fg-dim)' }}>has successfully completed</p>
        <p className="font-display text-[22px] font-bold mb-6" style={{ color: 'var(--accent)' }}>{courseName}</p>
        
        <div className="flex items-center justify-center gap-6 text-[13px] mb-6" style={{ color: 'var(--muted)' }}>
          <span>Completed: {completionDate}</span>
          <span>ID: {certificateNumber}</span>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button className="btn-gold inline-flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all"
            style={{ background: 'transparent', color: 'var(--fg)', border: '1.5px solid var(--border-strong)' }}>
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
