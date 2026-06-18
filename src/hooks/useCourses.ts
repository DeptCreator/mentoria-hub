'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { Course, Lesson, Enrollment, LessonProgress } from '@/types';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseBrowser
        .from('courses')
        .select('*, lessons(*)')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrollments = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('enrollments')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      setEnrollments(data || []);
    } catch (err: any) {
      console.error('Error fetching enrollments:', err);
    }
  }, []);

  const enroll = useCallback(async (userId: string, courseId: string) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('enrollments')
        .insert({ user_id: userId, course_id: courseId })
        .select()
        .single();
      
      if (error) throw error;
      setEnrollments(prev => [...prev, data]);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }, []);

  const getEnrollment = useCallback((courseId: string) => {
    return enrollments.find(e => e.course_id === courseId);
  }, [enrollments]);

  const isEnrolled = useCallback((courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  }, [enrollments]);

  const updateProgress = useCallback(async (userId: string, lessonId: string, updates: any) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('lesson_progress')
        .upsert({ user_id: userId, lesson_id: lessonId, ...updates })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }, []);

  const getLessonProgress = useCallback(async (userId: string, lessonId: string) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    enrollments,
    loading,
    error,
    fetchCourses,
    fetchEnrollments,
    enroll,
    getEnrollment,
    isEnrolled,
    updateProgress,
    getLessonProgress,
  };
}
