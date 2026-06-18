export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  grade?: number;
  interests: string[];
  goals: string[];
  country?: string;
  language: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category_id?: string;
  category: string;
  format: 'online' | 'offline' | 'hybrid';
  grade_min?: number;
  grade_max?: number;
  deadline?: string;
  requirements: string[];
  benefits: string[];
  link?: string;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours?: number;
  image_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
  enrollment?: Enrollment;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  video_url?: string;
  video_type: 'youtube' | 'vimeo' | 'custom';
  order_index: number;
  duration_minutes?: number;
  quiz_questions: QuizQuestion[];
  materials: string[];
  is_published: boolean;
  created_at: string;
  progress?: LessonProgress;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'dropped';
  progress_percent: number;
  started_at: string;
  completed_at?: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  is_video_watched: boolean;
  quiz_score?: number;
  completed_at?: string;
}

export interface SavedOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  created_at: string;
  opportunity?: Opportunity;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  course?: Course;
}

export interface RoadmapStage {
  grade: number;
  title: string;
  description: string;
  recommendedCourses: Course[];
  recommendedOpportunities: Opportunity[];
  milestones: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AIRecommendation {
  type: 'course' | 'opportunity';
  item: Course | Opportunity;
  reason: string;
  confidence: number;
}
