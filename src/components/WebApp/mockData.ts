// ============================================================
// Signal Trip WebApp — Types & Mock Data
// ============================================================

// --- Participant type (maps to `applications` table) ---
export interface Participant {
  id: string;
  nickname: string;
  name: string;      // Real name — only revealed in Phase 8
  phone: string;     // Real phone — only revealed in Phase 8
  age: number;
  gender: 'MALE' | 'FEMALE';
  mbti: string;
  bio: string;
  ideal_type: string;
  photo_urls: string[];
  sns_link: string;
  job_type: string;
  company_name: string;
  address: string;
  status?: string;
  is_agreed?: boolean;
}

export interface TripSession {
  id: string;
  current_phase: number;
  team_phase2: Record<string, string[]>;
  team_phase3: Record<string, string[]>;
  team_phase6: Record<string, string[]>;
  date_pairings: Record<string, string>;
  mission_status_phase2?: Record<string, string | null>;
  created_at: string;
  updated_at: string;
}

export interface VoteRecord {
  id?: string;
  voter_id: string;
  round: 'first' | 'final';
  pick_1st: string;
  pick_2nd?: string | null;
  pick_3rd?: string | null;
  created_at?: string;
}

export interface MatchResult {
  id?: string;
  participant_id: string;
  matched_with_id: string | null;
  is_matched: boolean;
  meeting_time?: string | null;
  meeting_place?: string | null;
  partner_hint?: string | null;
  action_hint?: string | null;
  current_step?: number | null;
  created_at?: string;
}

// ============================================================
// Mock Participants (4 Male + 4 Female = 8)
// ============================================================
export const MOCK_PARTICIPANTS: Participant[] = [
  // ── Males ──
  {
    id: 'mock-m1',
    nickname: '별을 든 남자',
    name: '이서진',
    phone: '010-1234-5678',
    age: 32,
    gender: 'MALE',
    mbti: 'INTJ',
    bio: '건축을 사랑하는 감성 여행자입니다. 새로운 도시의 거리를 걸으며 영감을 얻는 것을 좋아해요.',
    ideal_type: '차분하면서도 자신의 세계가 확고한 사람. 함께 걸으며 깊은 대화를 나눌 수 있는 분이면 좋겠어요.',
    photo_urls: ['https://api.dicebear.com/7.x/notionists/svg?seed=Seojin&backgroundColor=c0aede'],
    sns_link: '@seojin_archi',
    job_type: 'professional',
    company_name: '삼우종합건축사사무소',
    address: '서울 강남구',
  },
  {
    id: 'mock-m2',
    nickname: '제주바다',
    name: '정우성',
    phone: '010-2345-6789',
    age: 29,
    gender: 'MALE',
    mbti: 'ENFP',
    bio: '커피 브루잉과 서핑이 취미인 에너지 넘치는 사람입니다. 매 순간을 즐기며 살아요.',
    ideal_type: '밝고 긍정적인 에너지를 가진 사람. 함께 새로운 것에 도전하는 걸 즐기는 분이면 완벽해요.',
    photo_urls: ['https://api.dicebear.com/7.x/notionists/svg?seed=Woosung&backgroundColor=b6e3f4'],
    sns_link: '@woosung_surf',
    job_type: 'business_owner',
    company_name: '웨이브 커피 로스터스',
    address: '부산 해운대구',
  },
  {
    id: 'mock-m3',
    nickname: '달빛산책',
    name: '박현우',
    phone: '010-3456-7890',
    age: 34,
    gender: 'MALE',
    mbti: 'INFJ',
    bio: '사진 촬영과 글쓰기를 좋아하는 조용한 낭만주의자. 여행지에서의 깊은 대화를 즐겨요.',
    ideal_type: '예술과 문화를 사랑하고, 감수성이 풍부하며 따뜻한 심성을 가진 분.',
    photo_urls: ['https://api.dicebear.com/7.x/notionists/svg?seed=Hyunwoo&backgroundColor=ffd5dc'],
    sns_link: '@hyunwoo_photo',
    job_type: 'freelancer',
    company_name: '프리랜서 포토그래퍼',
    address: '서울 마포구',
  },
  {
    id: 'mock-m4',
    nickname: '도시의 밤',
    name: '김태현',
    phone: '010-4567-8901',
    age: 31,
    gender: 'MALE',
    mbti: 'ENTP',
    bio: 'IT 스타트업을 운영하며, 주말엔 재즈바에서 피아노를 칩니다. 다재다능한 이야기꾼이에요.',
    ideal_type: '유머 감각이 있고 대화 코드가 잘 맞는 사람. 서로의 꿈을 응원할 수 있는 관계를 원해요.',
    photo_urls: ['https://api.dicebear.com/7.x/notionists/svg?seed=Taehyun&backgroundColor=d1d4f9'],
    sns_link: '@taehyun_jazz',
    job_type: 'business_owner',
    company_name: '넥스트비전 테크',
    address: '서울 성동구',
  },
  // ── Females ──
  {
    id: 'mock-f1',
    nickname: '오션뷰',
    name: '김태희',
    phone: '010-5678-9012',
    age: 28,
    gender: 'FEMALE',
    mbti: 'ENFJ',
    bio: '자연과 미식을 좋아하며, 새로운 여행지에서의 감성적인 아침 러닝을 사랑합니다.',
    ideal_type: '유머 감각이 있고 배울 점이 많으며, 따뜻한 리더십을 가진 분.',
    photo_urls: ['https://api.dicebear.com/7.x/notionists/svg?seed=Taehee&backgroundColor=ffdfbf'],
    sns_link: '@taehee_run',
    job_type: 'business_owner',
    company_name: '주식회사 뷰티플로우',
    address: '서울 강남구',
  },
  {
    id: 'mock-f2',
    nickname: '하늘정원',
    name: '송혜교',
    phone: '010-6789-0123',
    age: 27,
    gender: 'FEMALE',
    mbti: 'ISFJ',
    bio: '필라테스와 와인을 즐깁니다. 주말엔 소소한 브런치 카페 투어를 하며 재충전해요.',
    ideal_type: '성실하고 배려심이 깊으며, 함께 있으면 편안한 분.',
    photo_urls: ['https://api.dicebear.com/7.x/notionists/svg?seed=Hyekyo&backgroundColor=c0aede'],
    sns_link: '@hyekyo_wine',
    job_type: 'civil_servant',
    company_name: '한국토지주택공사',
    address: '경기 성남시',
  },
  {
    id: 'mock-f3',
    nickname: '별빛여행',
    name: '한지민',
    phone: '010-7890-1234',
    age: 30,
    gender: 'FEMALE',
    mbti: 'INFP',
    bio: '그림 그리기와 독서를 좋아하는 감성파. 여행지에서 스케치북을 펴는 순간이 가장 행복해요.',
    ideal_type: '조용하지만 깊이 있는 사람. 서로의 취미를 존중하고 함께 성장하는 관계.',
    photo_urls: ['https://api.dicebear.com/7.x/notionists/svg?seed=Jimin&backgroundColor=b6e3f4'],
    sns_link: '@jimin_sketch',
    job_type: 'professional',
    company_name: '국립현대미술관',
    address: '서울 종로구',
  },
  {
    id: 'mock-f4',
    nickname: '민트초코',
    name: '이수현',
    phone: '010-8901-2345',
    age: 26,
    gender: 'FEMALE',
    mbti: 'ESTP',
    bio: '여행 블로거 겸 마케터. 새로운 맛집과 핫플을 발굴하는 게 일이자 취미예요!',
    ideal_type: '에너지가 넘치고 적극적인 사람. 함께 맛집 투어를 다닐 수 있는 미식 파트너!',
    photo_urls: ['https://api.dicebear.com/7.x/notionists/svg?seed=Suhyun&backgroundColor=ffd5dc'],
    sns_link: '@suhyun_foodie',
    job_type: 'office_worker',
    company_name: '네이버',
    address: '경기 성남시',
  },
];

// ============================================================
// Mock Team Assignments
// ============================================================
export const MOCK_TEAMS = {
  phase2: {
    team_a: ['mock-m1', 'mock-m2', 'mock-f1', 'mock-f2'],
    team_b: ['mock-m3', 'mock-m4', 'mock-f3', 'mock-f4'],
  },
  phase3: {
    team_a: ['mock-m1', 'mock-m3', 'mock-f2', 'mock-f4'],
    team_b: ['mock-m2', 'mock-m4', 'mock-f1', 'mock-f3'],
  },
  phase6: {
    team_a: ['mock-m2', 'mock-m3', 'mock-f1', 'mock-f4'],
    team_b: ['mock-m1', 'mock-m4', 'mock-f2', 'mock-f3'],
  },
};

// Mock 1:1 date pairings (Phase 5)
export const MOCK_DATE_PAIRINGS: Record<string, string> = {
  'mock-m1': 'mock-f1',
  'mock-m2': 'mock-f3',
  'mock-m3': 'mock-f4',
  'mock-m4': 'mock-f2',
  'mock-f1': 'mock-m1',
  'mock-f3': 'mock-m2',
  'mock-f4': 'mock-m3',
  'mock-f2': 'mock-m4',
};

// Mock match results (Phase 8)
export const MOCK_MATCH_RESULTS: Record<string, MatchResult> = {
  'mock-m1': { participant_id: 'mock-m1', matched_with_id: 'mock-f1', is_matched: true },
  'mock-f1': { participant_id: 'mock-f1', matched_with_id: 'mock-m1', is_matched: true },
  'mock-m2': { participant_id: 'mock-m2', matched_with_id: null, is_matched: false },
  'mock-f3': { participant_id: 'mock-f3', matched_with_id: null, is_matched: false },
  'mock-m3': { participant_id: 'mock-m3', matched_with_id: 'mock-f4', is_matched: true },
  'mock-f4': { participant_id: 'mock-f4', matched_with_id: 'mock-m3', is_matched: true },
  'mock-m4': { participant_id: 'mock-m4', matched_with_id: null, is_matched: false },
  'mock-f2': { participant_id: 'mock-f2', matched_with_id: null, is_matched: false },
};

// ============================================================
// Helper Functions
// ============================================================

/** Get team members for a given user in a given phase */
export function getTeamForUser(
  userId: string,
  phase: 2 | 3 | 6,
  allParticipants: Participant[],
  sessionData?: TripSession | null,
): Participant[] {
  const phaseKey = `phase${phase}` as 'phase2' | 'phase3' | 'phase6';
  const teamKey = `team_phase${phase}` as 'team_phase2' | 'team_phase3' | 'team_phase6';

  // Try session data first, fallback to mock
  const teams = sessionData?.[teamKey] ?? MOCK_TEAMS[phaseKey];
  if (!teams) return [];

  // Find which team the user belongs to
  for (const members of Object.values(teams) as string[][]) {
    if (members.includes(userId)) {
      return allParticipants.filter((p) => members.includes(p.id));
    }
  }

  // Fallback: return first 4 participants
  return allParticipants.slice(0, 4);
}

/** Get 1:1 date partner */
export function getDatePartner(
  userId: string,
  allParticipants: Participant[],
  sessionData?: TripSession | null,
): Participant | null {
  const pairings = sessionData?.date_pairings ?? MOCK_DATE_PAIRINGS;
  const partnerId = pairings[userId];
  if (!partnerId) return allParticipants.find((p) => p.id !== userId && p.gender !== allParticipants.find((u) => u.id === userId)?.gender) ?? null;
  return allParticipants.find((p) => p.id === partnerId) ?? null;
}

/** Get match result for Phase 8 */
export function getMatchResultForUser(
  userId: string,
  allParticipants: Participant[],
  dbResult?: MatchResult | null,
): { is_matched: boolean; partner: Participant | null } {
  const result = dbResult ?? MOCK_MATCH_RESULTS[userId];
  if (!result) return { is_matched: false, partner: null };

  const partner = result.matched_with_id
    ? allParticipants.find((p) => p.id === result.matched_with_id) ?? null
    : null;

  return { is_matched: result.is_matched, partner };
}
