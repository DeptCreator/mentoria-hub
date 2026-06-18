/**
 * Mentoria Hub Data Seeder
 * 
 * Run this script AFTER the SQL migrations have been applied via Supabase Dashboard.
 * This script uses the REST API with the service_role key to seed data
 * (since the REST API can only read/write to existing tables).
 * 
 * Usage: node supabase/seed-rest.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read keys from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const lines = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    lines[parts[0]] = parts.slice(1).join('=');
  }
});

const supabaseUrl = lines.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = lines.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const categories = [
  { name: 'Business', slug: 'business', description: 'Business competitions, entrepreneurship programs', color: '#3B82F6' },
  { name: 'STEM', slug: 'stem', description: 'Science, Technology, Engineering, Mathematics', color: '#10B981' },
  { name: 'Social Impact', slug: 'social-impact', description: 'Volunteering, community projects', color: '#F59E0B' },
  { name: 'Finance', slug: 'finance', description: 'Financial literacy, economics', color: '#8B5CF6' },
  { name: 'Programming', slug: 'programming', description: 'Coding, software development', color: '#EC4899' },
  { name: 'Science', slug: 'science', description: 'Research programs, labs', color: '#06B6D4' },
  { name: 'Humanities', slug: 'humanities', description: 'Literature, history, arts', color: '#F97316' },
  { name: 'University Prep', slug: 'university-prep', description: 'SAT, IELTS, admissions', color: '#6366F1' },
];

const opportunities = [
  { title: 'International Math Olympiad (IMO)', description: 'Prestigious mathematics competition for high school students', category: 'STEM', format: 'offline', grade_min: 9, grade_max: 11, deadline: '2025-12-15', requirements: ['Strong math skills', 'School nomination'], benefits: ['International recognition', 'University admission advantage'], is_featured: true },
  { title: 'Kazakhstan Youth Entrepreneurship Challenge', description: 'Business competition for young entrepreneurs to pitch ideas', category: 'Business', format: 'hybrid', grade_min: 9, grade_max: 11, deadline: '2025-09-30', requirements: ['Business idea', 'Team of 2-4 members'], benefits: ['Funding up to $5000', 'Mentorship program'], is_featured: true },
  { title: 'Summer Science Research Program', description: 'Research program in STEM fields with university professors', category: 'Science', format: 'offline', grade_min: 10, grade_max: 11, deadline: '2025-04-15', requirements: ['GPA 3.5+', 'Recommendation letter'], benefits: ['Research experience', 'University credits'], is_featured: true },
  { title: 'Hackathon Central Asia 2025', description: '48-hour coding competition to solve real-world problems', category: 'Programming', format: 'hybrid', grade_min: 9, grade_max: 12, deadline: '2025-07-20', requirements: ['Basic programming', 'Laptop', 'Team of 3-5'], benefits: ['Prizes up to $3000', 'Internship opportunities'] },
  { title: 'STEM Volunteer Program', description: 'Volunteer to teach STEM to underprivileged children', category: 'Social Impact', format: 'offline', grade_min: 9, grade_max: 11, deadline: '2025-08-01', requirements: ['STEM knowledge', 'Commitment 20 hours'], benefits: ['Volunteer certificate', 'Leadership experience'] },
  { title: 'Financial Literacy Summer Camp', description: 'Intensive 2-week program covering personal finance', category: 'Finance', format: 'online', grade_min: 8, grade_max: 10, deadline: '2025-06-30', requirements: ['Interest in finance'], benefits: ['Financial literacy certificate', 'Investment simulation'] },
  { title: 'SAT Preparation Bootcamp', description: 'Intensive 4-week SAT preparation course', category: 'University Prep', format: 'online', grade_min: 10, grade_max: 11, deadline: '2025-10-01', requirements: ['English proficiency'], benefits: ['SAT score improvement', 'College counseling'], is_featured: true },
  { title: 'International Essay Competition', description: 'Essay writing competition on global issues', category: 'Humanities', format: 'online', grade_min: 8, grade_max: 11, deadline: '2025-11-15', requirements: ['English proficiency', 'Writing skills'], benefits: ['Publication in journal', 'Cash prizes'] },
  { title: 'AI and Machine Learning Workshop', description: 'Introduction to AI/ML with Python and TensorFlow', category: 'Programming', format: 'hybrid', grade_min: 10, grade_max: 11, deadline: '2025-08-15', requirements: ['Python basics', 'Laptop required'], benefits: ['AI project portfolio', 'Certificate'] },
  { title: 'Environmental Science Field Trip', description: 'Field research on local ecosystems and conservation', category: 'Science', format: 'offline', grade_min: 9, grade_max: 10, deadline: '2025-05-20', requirements: ['Interest in environment'], benefits: ['Field research experience', 'Conservation certificate'] },
];

async function seed() {
  console.log('Seeding categories...');
  const { error: catError } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' });
  if (catError) console.error('Category error:', catError.message);
  else console.log(`✓ ${categories.length} categories created`);

  console.log('\nSeeding opportunities...');
  const { error: oppError } = await supabase.from('opportunities').upsert(opportunities, { onConflict: 'title' });
  if (oppError) console.error('Opportunity error:', oppError.message);
  else console.log(`✓ ${opportunities.length} opportunities created`);

  // Get categories for course mapping
  const { data: cats } = await supabase.from('categories').select('*');
  const catMap = {};
  cats?.forEach(c => { catMap[c.slug] = c.id; });

  const courses = [
    { title: 'Mathematics Fundamentals', description: 'Comprehensive math course covering algebra, geometry, and calculus', category: 'STEM', level: 'beginner', duration_hours: 20 },
    { title: 'English for Academic Success', description: 'Academic English focusing on writing, reading, and presentation', category: 'Humanities', level: 'intermediate', duration_hours: 15 },
    { title: 'Physics Basics', description: 'Introduction to mechanics, thermodynamics, and electromagnetism', category: 'STEM', level: 'beginner', duration_hours: 18 },
    { title: 'Introduction to Economics', description: 'Fundamentals of micro and macroeconomics', category: 'Finance', level: 'beginner', duration_hours: 12 },
    { title: 'Computer Science Principles', description: 'Introduction to programming with Python', category: 'Programming', level: 'beginner', duration_hours: 16 },
  ];

  console.log('\nSeeding courses...');
  for (const course of courses) {
    const { error: cError } = await supabase.from('courses').upsert(course, { onConflict: 'title' });
    if (cError) console.error(`Course error for ${course.title}:`, cError.message.substring(0, 100));
  }
  console.log(`✓ ${courses.length} courses created`);

  const { data: createdCourses } = await supabase.from('courses').select('*');
  
  const lessons = [
    { courseTitle: 'Mathematics Fundamentals', lessons: [
      { title: 'Algebra Basics', description: 'Variables, equations, and inequalities', video_url: 'https://www.youtube.com/embed/LwCRRUaACys', order_index: 1, duration_minutes: 45, quiz_questions: [{ question: 'What is the value of x in 2x + 5 = 15?', options: ['5', '10', '7.5', '20'], correct: 0 }] },
      { title: 'Geometry Essentials', description: 'Points, lines, angles, triangles', video_url: 'https://www.youtube.com/embed/302eJ3Tz0ic', order_index: 2, duration_minutes: 50, quiz_questions: [{ question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correct: 1 }] },
      { title: 'Introduction to Calculus', description: 'Limits, derivatives, and basic integration', video_url: 'https://www.youtube.com/embed/HfACrKJ_Y2w', order_index: 3, duration_minutes: 60, quiz_questions: [{ question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2'], correct: 1 }] },
    ]},
    { courseTitle: 'English for Academic Success', lessons: [
      { title: 'Academic Writing', description: 'Structure, thesis statements, and argumentation', video_url: 'https://www.youtube.com/embed/6gS1T10UPCw', order_index: 1, duration_minutes: 40 },
      { title: 'Reading Comprehension', description: 'Strategies for understanding complex texts', video_url: 'https://www.youtube.com/embed/9m3i6N3z1hE', order_index: 2, duration_minutes: 35 },
      { title: 'Presentation Skills', description: 'Public speaking and slide design', video_url: 'https://www.youtube.com/embed/yoD8RMq2OkU', order_index: 3, duration_minutes: 45 },
    ]},
    { courseTitle: 'Physics Basics', lessons: [
      { title: 'Mechanics', description: "Newton's laws, motion, forces, and energy", video_url: 'https://www.youtube.com/embed/oh-_xEXGl5U', order_index: 1, duration_minutes: 55 },
      { title: 'Thermodynamics', description: 'Heat, temperature, and laws of thermodynamics', video_url: 'https://www.youtube.com/embed/udFeB8nXJcQ', order_index: 2, duration_minutes: 50 },
    ]},
  ];

  console.log('\nSeeding lessons...');
  let lessonCount = 0;
  for (const courseData of lessons) {
    const course = createdCourses?.find(c => c.title === courseData.courseTitle);
    if (!course) continue;
    for (const lesson of courseData.lessons) {
      const { error: lError } = await supabase.from('lessons').upsert({
        ...lesson,
        course_id: course.id,
        materials: [],
        video_type: 'youtube',
        is_published: true,
      }, { onConflict: 'id' });
      if (lError) console.error(`Lesson error: ${lError.message.substring(0, 100)}`);
      else lessonCount++;
    }
  }
  console.log(`✓ ${lessonCount} lessons created`);

  console.log('\n✅ Database seeding complete!');
  console.log('   Run: SELECT * FROM courses;  in Supabase SQL Editor to verify.');
}

seed().catch(console.error);
