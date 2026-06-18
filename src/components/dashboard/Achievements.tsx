'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { Trophy, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
}

export default function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data: allAchievements, error: achError } = await supabaseBrowser
        .from('achievements')
        .select('*');
      
      if (achError) throw achError;

      const { data: userAchievements, error: uaError } = await supabaseBrowser
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (uaError) throw uaError;

      const earnedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

      const combined = (allAchievements || []).map(ach => ({
        ...ach,
        earned: earnedIds.has(ach.id),
        earned_at: userAchievements?.find(ua => ua.achievement_id === ach.id)?.earned_at,
      }));

      setAchievements(combined);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {achievements.map(achievement => (
        <div
          key={achievement.id}
          className={`rounded-xl border p-4 ${
            achievement.earned
              ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
              : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            {achievement.earned ? (
              <Trophy className="h-8 w-8 text-yellow-500" />
            ) : (
              <Lock className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <h3 className={`font-semibold ${achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            {achievement.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
          {achievement.earned_at && (
            <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
              Earned: {new Date(achievement.earned_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
