-- Supabase 데이터베이스 설정 SQL

-- 1. quiz_submissions 테이블 생성
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  step INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. user_rankings 테이블 생성
CREATE TABLE IF NOT EXISTS user_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id TEXT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE quiz_submissions
  ADD COLUMN IF NOT EXISTS attempt_id TEXT;

ALTER TABLE user_rankings
  ADD COLUMN IF NOT EXISTS attempt_id TEXT;

ALTER TABLE user_rankings
  DROP CONSTRAINT IF EXISTS user_rankings_user_name_key;

ALTER TABLE quiz_submissions
  ALTER COLUMN attempt_id SET NOT NULL;

ALTER TABLE user_rankings
  ALTER COLUMN attempt_id SET NOT NULL;

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_user_name ON quiz_submissions(user_name);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_attempt_id ON quiz_submissions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_created_at ON quiz_submissions(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_rankings_attempt_id_unique ON user_rankings(attempt_id);
CREATE INDEX IF NOT EXISTS idx_user_rankings_total_score ON user_rankings(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_rankings_completed_at ON user_rankings(completed_at);

-- 4. RLS (Row Level Security) 활성화
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rankings ENABLE ROW LEVEL SECURITY;

-- 5. 정책 생성 (모든 사용자가 읽고 쓸 수 있도록)
CREATE POLICY "Enable read access for all users" ON quiz_submissions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON quiz_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON user_rankings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON user_rankings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON user_rankings
  FOR UPDATE USING (true);
