'use client';

import { useState } from 'react';
import { Lesson } from '@/types';

interface Props {
  lesson: Lesson;
  onComplete: () => void;
}

export default function LessonPlayer({ lesson, onComplete }: Props) {
  const [watched, setWatched] = useState(false);

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match?.[1] || '';
  };

  const videoId = lesson.video_url ? extractVideoId(lesson.video_url) : '';

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full rounded-lg bg-black">
        {videoId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
            onLoad={() => setWatched(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white">No video available</div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lesson.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{lesson.description}</p>
        </div>
        <button
          onClick={onComplete}
          className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Mark Complete
        </button>
      </div>

      {lesson.materials.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Materials</h4>
          <ul className="space-y-1">
            {lesson.materials.map((material, i) => (
              <li key={i} className="text-sm text-blue-600 dark:text-blue-400">{material}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
