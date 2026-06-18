-- Mentoria Hub Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    grade INTEGER CHECK (grade >= 8 AND grade <= 12),
    interests TEXT[] DEFAULT '{}',
    goals TEXT[] DEFAULT '{}',
    country TEXT DEFAULT 'Kazakhstan',
    language TEXT DEFAULT 'ru',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    category TEXT NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('online', 'offline', 'hybrid')),
    grade_min INTEGER CHECK (grade_min >= 8 AND grade_min <= 12),
    grade_max INTEGER CHECK (grade_max >= 8 AND grade_max <= 12),
    deadline DATE,
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    link TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration_hours INTEGER,
    image_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    video_type TEXT DEFAULT 'youtube' CHECK (video_type IN ('youtube', 'vimeo', 'custom')),
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    quiz_questions JSONB DEFAULT '[]',
    materials TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- Lesson progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    is_video_watched BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, lesson_id)
);

-- Saved opportunities table
CREATE TABLE IF NOT EXISTS saved_opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'trophy',
    condition_type TEXT NOT NULL,
    condition_value INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    certificate_number TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Opportunities policies
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage opportunities" ON opportunities
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Courses policies
CREATE POLICY "Courses are viewable by everyone" ON courses
    FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins can manage courses" ON courses
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Lessons policies
CREATE POLICY "Lessons are viewable by enrolled users" ON lessons
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM enrollments WHERE user_id = auth.uid() AND course_id = lessons.course_id)
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can manage lessons" ON lessons
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can enroll themselves" ON enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own enrollments" ON enrollments
    FOR UPDATE USING (user_id = auth.uid());

-- Lesson progress policies
CREATE POLICY "Users can view own progress" ON lesson_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON lesson_progress
    FOR ALL USING (user_id = auth.uid());

-- Saved opportunities policies
CREATE POLICY "Users can view own saved opportunities" ON saved_opportunities
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can save opportunities" ON saved_opportunities
    FOR ALL USING (user_id = auth.uid());

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (user_id = auth.uid());

-- Certificates policies
CREATE POLICY "Users can view own certificates" ON certificates
    FOR SELECT USING (user_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
-- Seed data for Mentoria Hub
-- Run this after 001_initial_schema.sql

-- Categories
INSERT INTO categories (name, slug, description, color) VALUES
('Business', 'business', 'Business competitions, entrepreneurship programs, and leadership opportunities', '#3B82F6'),
('STEM', 'stem', 'Science, Technology, Engineering, and Mathematics programs', '#10B981'),
('Social Impact', 'social-impact', 'Volunteering, community projects, and social initiatives', '#F59E0B'),
('Finance', 'finance', 'Financial literacy, investment, and economics programs', '#8B5CF6'),
('Programming', 'programming', 'Coding, software development, and computer science', '#EC4899'),
('Science', 'science', 'Research programs, labs, and scientific competitions', '#06B6D4'),
('Humanities', 'humanities', 'Literature, history, languages, and arts', '#F97316'),
('University Prep', 'university-prep', 'College preparation, SAT, IELTS, and admission guidance', '#6366F1');

-- Opportunities
INSERT INTO opportunities (title, description, category, format, grade_min, grade_max, deadline, requirements, benefits, link, is_featured) VALUES
('International Math Olympiad (IMO)', 'Prestigious mathematics competition for high school students. National selection rounds lead to international finals.', 'STEM', 'offline', 9, 11, '2025-12-15', ARRAY['Strong math skills', 'School nomination', 'National round qualification'], ARRAY['International recognition', 'University admission advantage', 'Networking with top students'], 'https://imo-official.org', TRUE),

('Kazakhstan Youth Entrepreneurship Challenge', 'Business competition for young entrepreneurs to pitch innovative ideas and win funding.', 'Business', 'hybrid', 9, 11, '2025-09-30', ARRAY['Business idea', 'Team of 2-4 members', 'Mentor support'], ARRAY['Funding up to $5000', 'Mentorship program', 'Incubator access'], 'https://example.com/entrepreneurship', TRUE),

('Summer Science Research Program at Nazarbayev University', '6-week research program in STEM fields with university professors.', 'Science', 'offline', 10, 11, '2025-04-15', ARRAY['GPA 3.5+', 'Recommendation letter', 'English proficiency'], ARRAY['Research experience', 'University credits', 'Lab access'], 'https://example.com/research', TRUE),

('Hackathon Central Asia 2025', '48-hour coding competition to solve real-world problems using technology.', 'Programming', 'hybrid', 9, 12, '2025-07-20', ARRAY['Basic programming knowledge', 'Laptop', 'Team of 3-5'], ARRAY['Prizes up to $3000', 'Internship opportunities', 'Tech company networking'], 'https://example.com/hackathon', FALSE),

('Volunteer Program: Teach Kids STEM', 'Volunteer to teach STEM subjects to underprivileged children in rural areas.', 'Social Impact', 'offline', 9, 11, '2025-08-01', ARRAY['STEM knowledge', 'Commitment 20 hours', 'Background check'], ARRAY['Volunteer certificate', 'Leadership experience', 'Community impact'], 'https://example.com/volunteer', FALSE),

('Financial Literacy Summer Camp', 'Intensive 2-week program covering personal finance, investing, and economics basics.', 'Finance', 'online', 8, 10, '2025-06-30', ARRAY['Interest in finance', 'Basic math skills'], ARRAY['Financial literacy certificate', 'Investment simulation experience', 'Mentor network'], 'https://example.com/finance', FALSE),

('SAT Preparation Bootcamp', 'Intensive 4-week SAT preparation course with practice tests and strategies.', 'University Prep', 'online', 10, 11, '2025-10-01', ARRAY['English proficiency', 'Commitment 10 hours/week'], ARRAY['SAT score improvement', 'Study materials', 'College counseling'], 'https://example.com/sat', TRUE),

('International Essay Competition', 'Essay writing competition on global issues with prizes and publication opportunities.', 'Humanities', 'online', 8, 11, '2025-11-15', ARRAY['English proficiency', 'Essay writing skills'], ARRAY['Publication in journal', 'Cash prizes', 'Writing mentorship'], 'https://example.com/essay', FALSE),

('AI and Machine Learning Workshop', 'Introduction to AI and ML with hands-on projects using Python and TensorFlow.', 'Programming', 'hybrid', 10, 11, '2025-08-15', ARRAY['Python basics', 'Math knowledge', 'Laptop required'], ARRAY['AI project portfolio', 'Certificate', 'Industry networking'], 'https://example.com/ai-workshop', FALSE),

('Environmental Science Field Trip', 'Field research program studying local ecosystems and environmental conservation.', 'Science', 'offline', 9, 10, '2025-05-20', ARRAY['Interest in environment', 'Physical fitness for fieldwork'], ARRAY['Field research experience', 'Conservation certificate', 'Nature photography skills'], 'https://example.com/environment', FALSE);

-- Courses
INSERT INTO courses (title, description, category, level, duration_hours, is_published) VALUES
('Mathematics Fundamentals', 'Comprehensive math course covering algebra, geometry, and calculus basics for high school students.', 'STEM', 'beginner', 20, TRUE),
('English for Academic Success', 'Academic English course focusing on writing, reading comprehension, and presentation skills.', 'Humanities', 'intermediate', 15, TRUE),
('Physics Basics', 'Introduction to mechanics, thermodynamics, and electromagnetism with real-world applications.', 'STEM', 'beginner', 18, TRUE),
('Introduction to Economics', 'Fundamentals of micro and macroeconomics, market structures, and financial systems.', 'Finance', 'beginner', 12, TRUE),
('Computer Science Principles', 'Introduction to programming concepts, algorithms, and problem-solving using Python.', 'Programming', 'beginner', 16, TRUE);

-- Lessons for Mathematics Fundamentals
INSERT INTO lessons (course_id, title, description, video_url, video_type, order_index, duration_minutes, quiz_questions, materials) VALUES
((SELECT id FROM courses WHERE title = 'Mathematics Fundamentals'), 'Algebra Basics', 'Introduction to variables, equations, and inequalities.', 'https://www.youtube.com/embed/LwCRRUaACys', 'youtube', 1, 45, '[{"question":"What is the value of x in 2x + 5 = 15?","options":["5","10","7.5","20"],"correct":0},{"question":"Solve: 3(x - 2) = 12","options":["2","4","6","8"],"correct":2}]', ARRAY['Algebra cheat sheet PDF', 'Practice problems worksheet']),

((SELECT id FROM courses WHERE title = 'Mathematics Fundamentals'), 'Geometry Essentials', 'Points, lines, angles, triangles, and basic geometric proofs.', 'https://www.youtube.com/embed/302eJ3Tz0ic', 'youtube', 2, 50, '[{"question":"What is the sum of angles in a triangle?","options":["90°","180°","270°","360°"],"correct":1},{"question":"In a right triangle, if one angle is 30°, what is the other acute angle?","options":["30°","45°","60°","90°"],"correct":2}]', ARRAY['Geometry formulas PDF', 'Interactive geometry tool']),

((SELECT id FROM courses WHERE title = 'Mathematics Fundamentals'), 'Introduction to Calculus', 'Limits, derivatives, and basic integration concepts.', 'https://www.youtube.com/embed/HfACrKJ_Y2w', 'youtube', 3, 60, '[{"question":"What is the derivative of x²?","options":["x","2x","x²","2"],"correct":1},{"question":"What does a limit describe?","options":["Maximum value","Approaching value","Minimum value","Average value"],"correct":1}]', ARRAY['Calculus basics PDF', 'Derivative calculator guide']);

-- Lessons for English for Academic Success
INSERT INTO lessons (course_id, title, description, video_url, video_type, order_index, duration_minutes, quiz_questions, materials) VALUES
((SELECT id FROM courses WHERE title = 'English for Academic Success'), 'Academic Writing', 'Structure, thesis statements, and argumentation in academic essays.', 'https://www.youtube.com/embed/6gS1T10UPCw', 'youtube', 1, 40, '[{"question":"What is a thesis statement?","options":["A question","Main argument","Summary","Introduction"],"correct":1},{"question":"Which is NOT a feature of academic writing?","options":["Formal tone","Evidence-based","Personal opinions","Clear structure"],"correct":2}]', ARRAY['Academic writing guide PDF', 'Essay template']),

((SELECT id FROM courses WHERE title = 'English for Academic Success'), 'Reading Comprehension', 'Strategies for understanding complex texts and critical analysis.', 'https://www.youtube.com/embed/9m3i6N3z1hE', 'youtube', 2, 35, '[{"question":"What is the main idea of a text?","options":["First sentence","Central message","Last paragraph","Title"],"correct":1},{"question":"Critical reading involves:","options":["Memorizing","Questioning the text","Speed reading","Skipping details"],"correct":1}]', ARRAY['Reading strategies PDF', 'Practice passages']),

((SELECT id FROM courses WHERE title = 'English for Academic Success'), 'Presentation Skills', 'Effective public speaking, slide design, and audience engagement.', 'https://www.youtube.com/embed/yoD8RMq2OkU', 'youtube', 3, 45, '[{"question":"What is the 10-20-30 rule?","options":["10 slides, 20 minutes, 30pt font","10 minutes, 20 slides, 30 words","10 words, 20 slides, 30 minutes","10 slides, 20 words, 30 minutes"],"correct":0},{"question":"Good presentations should:","options":["Read from slides","Engage audience","Be text-heavy","Avoid eye contact"],"correct":1}]', ARRAY['Presentation checklist PDF', 'Slide templates']);

-- Lessons for Physics Basics
INSERT INTO lessons (course_id, title, description, video_url, video_type, order_index, duration_minutes, quiz_questions, materials) VALUES
((SELECT id FROM courses WHERE title = 'Physics Basics'), 'Mechanics', 'Newton''s laws, motion, forces, and energy.', 'https://www.youtube.com/embed/oh-_xEXGl5U', 'youtube', 1, 55, '[{"question":"Newton''s First Law states:","options":["F=ma","Objects stay in motion","Action=reaction","Gravity exists"],"correct":1},{"question":"What is the unit of force?","options":["Watt","Joule","Newton","Pascal"],"correct":2}]', ARRAY['Mechanics formulas PDF', 'Physics simulations']),

((SELECT id FROM courses WHERE title = 'Physics Basics'), 'Thermodynamics', 'Heat, temperature, and laws of thermodynamics.', 'https://www.youtube.com/embed/udFeB8nXJcQ', 'youtube', 2, 50, '[{"question":"First Law of Thermodynamics is about:","options":["Heat flow","Energy conservation","Entropy","Temperature"],"correct":1},{"question":"Absolute zero is:","options":["0°C","-273.15°C","-100°C","-459°F"],"correct":1}]', ARRAY['Thermodynamics guide PDF', 'Heat experiment guide']);

-- Lessons for Introduction to Economics
INSERT INTO lessons (course_id, title, description, video_url, video_type, order_index, duration_minutes, quiz_questions, materials) VALUES
((SELECT id FROM courses WHERE title = 'Introduction to Economics'), 'Microeconomics Basics', 'Supply, demand, markets, and consumer behavior.', 'https://www.youtube.com/embed/9I1W_JYJmKw', 'youtube', 1, 40, '[{"question":"When demand increases and supply stays constant, price:","options":["Decreases","Increases","Stays same","Becomes zero"],"correct":1},{"question":"What is elasticity?","options":["Price sensitivity","Market size","Production cost","Profit margin"],"correct":0}]', ARRAY['Economics basics PDF', 'Market simulation game']),

((SELECT id FROM courses WHERE title = 'Introduction to Economics'), 'Macroeconomics', 'GDP, inflation, unemployment, and monetary policy.', 'https://www.youtube.com/embed/6X9CEi8wk1Y', 'youtube', 2, 45, '[{"question":"GDP measures:","options":["Total production","Total income","Both","Neither"],"correct":2},{"question":"High inflation means:","options":["Prices falling","Prices rising rapidly","Stable prices","No prices"],"correct":1}]', ARRAY['Macroeconomics guide PDF', 'Economic indicators chart']);

-- Lessons for Computer Science Principles
INSERT INTO lessons (course_id, title, description, video_url, video_type, order_index, duration_minutes, quiz_questions, materials) VALUES
((SELECT id FROM courses WHERE title = 'Computer Science Principles'), 'Introduction to Programming', 'Variables, data types, and basic Python syntax.', 'https://www.youtube.com/embed/kLZuut1cL_M', 'youtube', 1, 50, '[{"question":"What is a variable?","options":["Fixed value","Named storage","Function","Loop"],"correct":1},{"question":"Which is a valid Python variable name?","options":["2name","my-name","my_name","my name"],"correct":2}]', ARRAY['Python basics PDF', 'Coding exercises']),

((SELECT id FROM courses WHERE title = 'Computer Science Principles'), 'Algorithms and Logic', 'Problem-solving, flowcharts, and algorithm design.', 'https://www.youtube.com/embed/8hly31xKli0', 'youtube', 2, 55, '[{"question":"What is an algorithm?","options":["A programming language","Step-by-step solution","A computer","A variable"],"correct":1},{"question":"Big O notation measures:","options":["Code size","Execution time","Memory usage","Algorithm efficiency"],"correct":3}]', ARRAY['Algorithms guide PDF', 'Flowchart templates']);

-- Achievements
INSERT INTO achievements (name, description, icon, condition_type, condition_value) VALUES
('First Steps', 'Complete your first lesson', 'footprints', 'lessons_completed', 1),
('Course Explorer', 'Enroll in 3 different courses', 'book-open', 'courses_enrolled', 3),
('Knowledge Seeker', 'Complete 10 lessons', 'brain', 'lessons_completed', 10),
('Opportunity Hunter', 'Save 5 opportunities to favorites', 'bookmark', 'opportunities_saved', 5),
('Course Master', 'Complete your first course', 'trophy', 'courses_completed', 1),
('Dedicated Learner', 'Study for 7 consecutive days', 'flame', 'streak_days', 7),
('Quiz Champion', 'Score 100% on 5 quizzes', 'target', 'perfect_quizzes', 5),
('Early Bird', 'Apply to an opportunity before its deadline', 'clock', 'early_application', 1);
