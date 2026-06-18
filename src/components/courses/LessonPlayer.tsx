'use client';

import { Lesson } from '@/types';
import { CheckCircle, FileText, PlayCircle } from 'lucide-react';

interface Props {
  lesson: Lesson;
  onComplete: () => void;
}

export default function LessonPlayer({ lesson, onComplete }: Props) {
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match?.[1] || '';
  };

  const videoId = lesson.video_url ? extractVideoId(lesson.video_url) : '';

  return (
    <div className="space-y-5">
      <div className="aspect-video w-full rounded-[var(--radius-lg)] overflow-hidden bg-black border border-[var(--border)] shadow-2xl">
        {videoId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-white gap-3">
            <PlayCircle className="w-14 h-14 opacity-50" />
            <p className="text-[16px] opacity-70">No video available for this lesson</p>
          </div>
        )}
      </div>

      <div className="glass p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-[22px] mb-2" style={{ color: 'var(--fg)' }}>{lesson.title}</h3>
            <p className="text-[15px] leading-relaxed" style={{ color: 'var(--fg-dim)' }}>{lesson.description}</p>
          </div>
          <button
            onClick={onComplete}
            className="btn-gold inline-flex items-center gap-2 shrink-0 active-press"
          >
            <CheckCircle className="w-4 h-4" />
            Mark Complete
          </button>
        </div>
      </div>

      {lesson.materials && lesson.materials.length > 0 && (
        <div className="glass p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
          <h4 className="font-bold text-[16px] mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
            <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            Materials
          </h4>
          <ul className="flex flex-col gap-2">
            {lesson.materials.map((material, i) => (
              <li
                key={i}
                className="text-[14px] p-3 rounded-lg flex items-center gap-2"
                style={{ background: 'var(--surface)', color: 'var(--fg-dim)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                {material}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
