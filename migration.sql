-- 1. applications 테이블에 일정 조율 동의 여부 컬럼 추가
ALTER TABLE applications ADD COLUMN IF NOT EXISTS is_date_flexible BOOLEAN DEFAULT false;

-- 2. match_results 테이블에 매칭 상태(active, pending_date_coordination) 컬럼 추가
ALTER TABLE match_results ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- 3. match_results 테이블에 Step 4 제어용 컬럼 4개 추가
ALTER TABLE match_results ADD COLUMN IF NOT EXISTS step4_popup_msg TEXT;
ALTER TABLE match_results ADD COLUMN IF NOT EXISTS dining_name VARCHAR(255);
ALTER TABLE match_results ADD COLUMN IF NOT EXISTS dining_course VARCHAR(255);
ALTER TABLE match_results ADD COLUMN IF NOT EXISTS dining_address TEXT;

-- 4. applications 테이블에 시그널 코드(signal_code) 컬럼 추가
ALTER TABLE applications ADD COLUMN IF NOT EXISTS signal_code VARCHAR(4);
