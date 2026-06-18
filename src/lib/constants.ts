export const CATEGORIES = [
  'Business', 'STEM', 'Social Impact', 'Finance', 'Programming', 'Science', 'Humanities', 'University Prep'
] as const;

export const GRADES = [8, 9, 10, 11, 12] as const;

export const FORMATS = ['online', 'offline', 'hybrid'] as const;

export const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const INTERESTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Economics', 'Business', 'Finance', 'English', 'History',
  'Literature', 'Art', 'Music', 'Sports', 'Social Impact',
  'Leadership', 'Research', 'Entrepreneurship', 'Design', 'Engineering'
] as const;

export const GOALS = [
  'Prepare for university admission',
  'Win olympiads and competitions',
  'Build a startup',
  'Improve academic grades',
  'Learn programming',
  'Develop leadership skills',
  'Get research experience',
  'Prepare for SAT/IELTS',
  'Find internship opportunities',
  'Explore career options'
] as const;

export const LANGUAGES = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kz', name: 'Қазақша', flag: '🇰🇿' }
] as const;

export const DEFAULT_LANGUAGE = 'ru';

export const APP_NAME = 'Mentoria Hub';
export const APP_TAGLINE = 'Your Gateway to Educational Excellence';
