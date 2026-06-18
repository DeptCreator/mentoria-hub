'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { MOCK_COURSES } from '@/lib/mock-data';
import { Course, Enrollment } from '@/types';

function isNotFound(error: any) {
  return error?.code === 'PGRST116' || error?.message?.includes('404') || error?.message?.includes('relation') || error?.code === '42P01';
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabaseBrowser
        .from('courses')
        .select('*, lessons(*)')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        if (isNotFound(error)) {
          setUseMock(true);
          setCourses(MOCK_COURSES);
        } else {
          throw error;
        }
      } else {
        setCourses(data || []);
        setUseMock(false);
      }
    } catch (err: any) {
      setError(err.message);
      setUseMock(true);
      setCourses(MOCK_COURSES);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrollments = useCallback(async (userId: string) => {
    try {
      if (useMock) {
        setEnrollments([]);
        return;
      }
      const { data, error } = await supabaseBrowser
        .from('enrollments')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      setEnrollments(data || []);
    } catch (err: any) {
      console.error('Error fetching enrollments:', err);
      setEnrollments([]);
    }
  }, [useMock]);

  const enroll = useCallback(async (userId: string, courseId: string) => {
    try {
      if (useMock) {
        const course = courses.find(c => c.id === courseId);
        if (!course) return { data: null, error: new Error('Course not found') };
        const enrollment: Enrollment = {
          id: `mock-enroll-${courseId}`,
          user_id: userId,
          course_id: courseId,
          status: 'active',
          progress_percent: 0,
          started_at: new Date().toISOString(),
        };
        setEnrollments(prev => [...prev, enrollment]);
        return { data: enrollment, error: null };
      }
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
  }, [useMock, courses]);

  const getEnrollment = useCallback((courseId: string) => {
    return enrollments.find(e => e.course_id === courseId);
  }, [enrollments]);

  const isEnrolled = useCallback((courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  }, [enrollments]);

  const updateProgress = useCallback(async (userId: string, lessonId: string, updates: any) => {
    try {
      if (useMock) {
        return { data: { id: `mock-progress-${lessonId}`, user_id: userId, lesson_id: lessonId, ...updates, created_at: new Date().toISOString() }, error: null };
      }
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
  }, [useMock]);

  const getLessonProgress = useCallback(async (userId: string, lessonId: string) => {
    try {
      if (useMock) {
        return { data: null, error: null };
      }
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
  }, [useMock]);

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
