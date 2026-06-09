import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamForUser, type Participant, type TripSession } from './mockData';
import { supabase } from '../../supabaseClient';

interface Phase2Props {
  user: Participant;
  participants: Participant[];
  sessionData: TripSession | null;
  showToast: (msg: string) => void;
  globalPhase: number;
  onStartDinner: () => void;
}

const MISSION_LOCATION = {
  name: '한림공원 수석온실',
  address: '제주특별자치도 제주시 한림읍 한림로 300',
  description: '제주의 자연을 한눈에 담을 수 있는 프라이빗 팀 미션 장소입니다.',
};

const TALK_CARDS = [
  "가장 최근에 크게 웃었던 적은 언제인가요?",
  "인생에서 가장 큰 모험이나 도전은 무엇이었나요?",
  "최근에 가장 즐겨 듣는 음악이나 아티스트는 누구인가요?",
  "만약 오늘 당장 로또 1등에 당첨된다면 가장 먼저 하고 싶은 일은?",
  "나만 알고 있는 우리 동네 혹은 나만의 맛집/명소는?",
  "만약 초능력을 하나 가질 수 있다면 어떤 능력을 갖고 싶나요?",
  "본인의 취미나 스트레스 해소법 중 추천하고 싶은 것은?",
  "가장 가보고 싶은 꿈의 여행지와 그 이유는 무엇인가요?",
  "최근 나를 가장 설레게 했던 순간이나 단어는 무엇인가요?",
  "당신의 인생에서 가장 소중하게 생각하는 가치관은 무엇인가요?",
  "스스로가 가장 자랑스럽게 느껴졌던 최고의 순간은 언제였나요?",
  "만약 1년의 자유시간과 충분한 예산이 주어진다면 무엇을 하겠습니까?",
  "상대방의 첫인상 중에서 가장 매력적으로 보였던 부분은 무엇인가요?",
  "만약 과거의 특정 순간으로 돌아갈 수 있다면 언제로 가고 싶나요?",
  "나를 한 단어 혹은 하나의 형용사로 표현한다면 무엇일까요?",
  "슬프거나 지쳤을 때 위로를 주는 나만의 소울 푸드는 무엇인가요?",
  "최근에 본 영화나 책 중에서 가장 기억에 남는 대사나 구절은?",
  "연인과 갈등이 생겼을 때, 선호하는 해결 방식이나 대화법은?",
  "살면서 받아본 선물 중 가장 기억에 남고 감동적이었던 것은?",
  "상대방과 함께 제주의 자연 속에서 하고 싶은 액티비티가 있다면?"
];

function shuffleArray(array: string[]): string[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ANIMAL_LIST = ['토끼', '코끼리', '원숭이', '독수리', '강아지', '고양이', '사자', '펭귄'];

export default function Phase2TeamMission({ user, participants, sessionData, showToast, globalPhase, onStartDinner }: Phase2Props) {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('signal_phase2_step');
    return saved ? parseInt(saved) : 0;
  });

  const [currentCard, setCurrentCard] = useState<string | null>(null);
  const [matchingText, setMatchingText] = useState<string | null>(null);
  const [shuffledCards, setShuffledCards] = useState<string[]>(() => shuffleArray(TALK_CARDS));
  const [isUploading, setIsUploading] = useState(false);
  const [isMissionStarted, setIsMissionStarted] = useState(() => {
    return localStorage.getItem('signal_phase2_mission_started') === 'true';
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load target states from signal_trip_phase2_state unified storage
  const [photoStep, setPhotoStep] = useState<number>(() => {
    const saved = localStorage.getItem('signal_trip_phase2_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.photoStep === 'number') return parsed.photoStep;
      } catch (e) {
        console.error("Failed to parse signal_trip_phase2_state:", e);
      }
    }
    return 1;
  });

  const [availableUnlocks, setAvailableUnlocks] = useState<number>(() => {
    const saved = localStorage.getItem('signal_trip_phase2_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.availableUnlocks === 'number') return parsed.availableUnlocks;
      } catch (e) {
        console.error("Failed to parse signal_trip_phase2_state:", e);
      }
    }
    return 0;
  });

  const [unlockedProfiles, setUnlockedProfiles] = useState<string[]>(() => {
    const saved = localStorage.getItem('signal_trip_phase2_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.unlockedProfiles)) return parsed.unlockedProfiles;
      } catch (e) {
        console.error("Failed to parse signal_trip_phase2_state:", e);
      }
    }
    return [];
  });

  const [isTalkMissionDone, setIsTalkMissionDone] = useState<boolean>(() => {
    const saved = localStorage.getItem('signal_trip_phase2_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isTalkMissionDone === 'boolean') return parsed.isTalkMissionDone;
      } catch (e) {
        console.error("Failed to parse signal_trip_phase2_state:", e);
      }
    }
    return false;
  });

  const [randomAnimal, setRandomAnimal] = useState(() => {
    return localStorage.getItem('signal_phase2_random_animal') || '';
  });

  // Keep target states synchronized under 'signal_trip_phase2_state' key
  useEffect(() => {
    const state = {
      photoStep,
      availableUnlocks,
      unlockedProfiles,
      isTalkMissionDone
    };
    localStorage.setItem('signal_trip_phase2_state', JSON.stringify(state));
  }, [photoStep, availableUnlocks, unlockedProfiles, isTalkMissionDone]);

  // Get all team members in Phase 2 including myself
  const allTeamMembers = getTeamForUser(user.id, 2, participants, sessionData);

  // Map nicknames for the shuffling logic (with defensive fallback if data is empty)
  const teamNicknames = allTeamMembers.length > 0
    ? allTeamMembers.map((p) => p.nickname)
    : [user.nickname, '시그널러A', '시그널러B', '시그널러C'];

  const myTeamKey = (() => {
    if (!sessionData || !sessionData.team_phase2) return null;
    const teamA = sessionData.team_phase2.team_a || [];
    const teamB = sessionData.team_phase2.team_b || [];
    if (teamA.includes(user.id)) return 'team_a';
    if (teamB.includes(user.id)) return 'team_b';
    return null;
  })();

  const certifier = myTeamKey && sessionData?.mission_status_phase2
    ? sessionData.mission_status_phase2[myTeamKey]
    : null;

  const isPhotoMissionComplete = !!certifier || photoStep >= 5;
  const isBasecampReturned = step >= 3;

  const isCardUnlocked = (memberId: string) => {
    if (!!certifier || photoStep >= 5) return true;
    return unlockedProfiles.includes(memberId);
  };

  // Generate random animal persistent per step for step 2 & 3
  useEffect(() => {
    if (isMissionStarted && (photoStep === 2 || photoStep === 3)) {
      const saved = localStorage.getItem('signal_phase2_random_animal');
      if (!saved) {
        const animal = ANIMAL_LIST[Math.floor(Math.random() * ANIMAL_LIST.length)];
        setRandomAnimal(animal);
        localStorage.setItem('signal_phase2_random_animal', animal);
      }
    } else {
      setRandomAnimal('');
      localStorage.removeItem('signal_phase2_random_animal');
    }
  }, [photoStep, isMissionStarted]);

  const getMissionText = () => {
    if (photoStep === 1) {
      return {
        title: "📸 1단계: 4명 모두의 손가락 하트 모아서 찍기",
        desc: "조원 4명이 모여 손가락 하트를 만들고 사진을 촬영하여 첨부해 주세요."
      };
    } else if (photoStep === 2) {
      return {
        title: `📸 2단계: 남녀 짝지어 [${randomAnimal || '...'}] 몸으로 표현하기 (첫 번째 짝)`,
        desc: `파트너와 함께 제시된 동물 [${randomAnimal || '...'}]을(를) 몸으로 표현하고 인증 사진을 촬영하세요.`
      };
    } else if (photoStep === 3) {
      return {
        title: `📸 3단계: 남녀 짝지어 [${randomAnimal || '...'}] 몸으로 표현하기 (두 번째 짝)`,
        desc: `다른 파트너 짝이 제시된 동물 [${randomAnimal || '...'}]을(를) 몸으로 표현하고 인증 사진을 촬영하세요.`
      };
    } else if (photoStep === 4) {
      return {
        title: "📸 4단계: 4명 모두의 얼굴이 나오는 단체 셀카 찍기",
        desc: "모든 조원이 거울 셀카 또는 단체 샷을 촬영하여 첨부해 주세요."
      };
    }
    return { title: "", desc: "" };
  };

  const currentMission = getMissionText();

  const handleProfileClick = (memberId: string) => {
    if (unlockedProfiles.includes(memberId) || certifier || photoStep >= 5) return;

    if (availableUnlocks > unlockedProfiles.length) {
      const newUnlocked = [...unlockedProfiles, memberId];
      setUnlockedProfiles(newUnlocked);
      showToast('🔓 프로필이 잠금 해제되었습니다!');
    } else {
      showToast('🔒 아직 프로필을 열 수 있는 권한이 없습니다. 사진 미션을 수행해 주세요!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleConfirmVerification = async () => {
    if (!sessionData || !myTeamKey) return;

    const nextStep = photoStep + 1;
    setPreviewUrl(null);
    localStorage.removeItem('signal_phase2_random_animal');
    setRandomAnimal('');

    if (nextStep === 2) {
      const newAvailable = availableUnlocks + 1;
      setAvailableUnlocks(newAvailable);
      setPhotoStep(2);
      showToast('📸 1단계 인증 성공! 프로필 1개를 열 수 있습니다! 조원들과 상의해서 한 명을 골라 클릭하세요.');
    } else if (nextStep === 3) {
      const newAvailable = availableUnlocks + 1;
      setAvailableUnlocks(newAvailable);
      setPhotoStep(3);
      showToast('📸 2단계 인증 성공! 프로필 1개를 추가로 열 수 있습니다.');
    } else if (nextStep === 4) {
      const newAvailable = availableUnlocks + 1;
      setAvailableUnlocks(newAvailable);
      setPhotoStep(4);
      showToast('📸 3단계 인증 성공! 프로필 1개를 추가로 열 수 있습니다.');
    } else if (nextStep >= 5) {
      setIsUploading(true);
      try {
        const currentStatus = sessionData.mission_status_phase2 || {};
        const updatedStatus = {
          ...currentStatus,
          [myTeamKey]: user.nickname
        };

        const { error } = await supabase
          .from('trip_sessions')
          .update({
            mission_status_phase2: updatedStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', sessionData.id);

        if (error) throw error;
      } catch (err) {
        console.error("Supabase phase 2 mission update failed (Fail-safe executed):", err);
      } finally {
        setIsUploading(false);
        // Ensure local state changes execute regardless of database update success/failure
        const allIds = allTeamMembers.map(m => m.id);
        setUnlockedProfiles(allIds);
        setAvailableUnlocks(4);
        setPhotoStep(5);
        showToast('🎉 모든 사진 미션 완료! 전원의 프로필이 잠금 해제되었습니다.');
      }
    }
  };

  const advanceStep = (nextStep: number) => {
    setStep(nextStep);
    localStorage.setItem('signal_phase2_step', String(nextStep));
  };

  // Draw random question and assign duplicate-free asker/answerer pair
  const drawTalkCard = () => {
    if (teamNicknames.length < 2) {
      showToast('⚠️ 조원이 부족하여 대화 카드를 진행할 수 없습니다.');
      return;
    }

    let currentPool = [...shuffledCards];
    if (currentPool.length === 0) {
      currentPool = shuffleArray(TALK_CARDS);
    }
    const nextCard = currentPool.pop()!;
    setShuffledCards(currentPool);

    const shuffled = [...teamNicknames].sort(() => Math.random() - 0.5);
    const asker = shuffled[0];
    const answerer = shuffled[1];

    setCurrentCard(nextCard);
    setMatchingText(`🗣️ ${asker} 님이 👉 ${answerer} 님에게 질문해 주세요!`);
  };

  return (
    <div style={{ paddingTop: 32 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em',
          color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
        }}>
          Team Mission I
        </span>
        <h2 style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: 20, fontWeight: 700,
          color: '#f5f5f4', marginTop: 8, letterSpacing: '0.04em',
        }}>
          1차 팀 미션
        </h2>
        <p style={{ fontSize: 12, color: '#78716c', marginTop: 6, lineHeight: 1.6 }}>
          당신의 첫 번째 팀이 배정되었습니다
        </p>
      </div>

      {/* 4인 팀 프로필 카드 (점진적 언락) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        {allTeamMembers.map((member, i) => {
          const unlocked = isCardUnlocked(member.id);
          const canUnlockMore = availableUnlocks > unlockedProfiles.length;
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              onClick={() => handleProfileClick(member.id)}
              style={{
                background: '#141414',
                border: member.id === user.id ? '1px solid #00C7B5' : '1px solid #1e1e1e',
                borderRadius: 16,
                padding: 16,
                textAlign: 'center',
                boxShadow: member.id === user.id ? '0 0 15px rgba(0, 199, 181, 0.15)' : 'none',
                position: 'relative',
                overflow: 'hidden',
                cursor: unlocked ? 'default' : (canUnlockMore ? 'pointer' : 'default'),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minHeight: '330px',
              }}
            >
              {/* Avatar (always clear) */}
              <div style={{ position: 'relative', width: 56, height: 56, margin: '0 auto 12px' }}>
                <img
                  src={member.photo_urls[0] || ''}
                  alt={member.nickname}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #2a2a2a',
                    display: 'block',
                    background: '#1a1a1a',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${member.nickname}`;
                  }}
                />
              </div>

              {/* Nickname (always clear) */}
              <p style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#e7e5e4',
                fontFamily: "'Noto Sans KR', sans-serif",
                wordBreak: 'keep-all',
                margin: '0 0 4px 0',
              }}>
                {member.nickname} {member.id === user.id ? '(나)' : ''}
              </p>

              {/* Age/Gender (always clear) */}
              <p style={{
                fontSize: 11,
                color: '#a8a29e',
                margin: '0 0 12px 0',
                fontFamily: "'Noto Sans KR', sans-serif",
              }}>
                {member.gender === 'MALE' ? '남성' : '여성'} · {member.age}세
              </p>

              {/* Dynamic detail area depending on unlock state */}
              {unlocked ? (
                // Unlocked details (shows mbti, company_name, job_type, bio, ideal_type)
                <div style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '10px 12px',
                  borderRadius: 12,
                  fontSize: 13, // scaled up to 13px (text-sm equivalent)
                  color: '#e7e5e4',
                  lineHeight: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  marginTop: 'auto',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ color: '#00C7B5', fontWeight: 800, marginRight: 8, minWidth: '42px', display: 'inline-block' }}>MBTI</span>
                    <span style={{ color: '#f5f5f4' }}>{member.mbti}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ color: '#00C7B5', fontWeight: 800, marginRight: 8, minWidth: '42px', display: 'inline-block' }}>직무</span>
                    <span style={{ color: '#f5f5f4' }}>{member.job_type || '비공개'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ color: '#00C7B5', fontWeight: 800, marginRight: 8, minWidth: '42px', display: 'inline-block' }}>회사</span>
                    <span style={{ color: '#f5f5f4' }}>{member.company_name || '비공개'}</span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 6, marginTop: 2 }}>
                    <span style={{ color: '#00C7B5', fontWeight: 800, display: 'block', marginBottom: 2 }}>소개</span>
                    <span style={{ color: '#d6d3d1', fontSize: 12, lineHeight: 1.4 }}>{member.bio || '안녕하세요!'}</span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 6 }}>
                    <span style={{ color: '#00C7B5', fontWeight: 800, display: 'block', marginBottom: 2 }}>이상형</span>
                    <span style={{ color: '#d6d3d1', fontSize: 12, lineHeight: 1.4 }}>{member.ideal_type || '비공개'}</span>
                  </div>
                </div>
              ) : (
                // Locked details (🔒 icon + message)
                <div style={{
                  width: '100%',
                  marginTop: 'auto',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '16px 8px',
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px dashed #2a2a2a',
                }}>
                  <span style={{ fontSize: 18 }}>🔒</span>
                  <span style={{
                    fontSize: 11,
                    color: '#78716c',
                    fontFamily: "'Noto Sans KR', sans-serif",
                    lineHeight: 1.4,
                    wordBreak: 'keep-all',
                  }}>
                    미션을 통해 상세 프로필을 확인하세요
                  </span>
                </div>
              )}

              {/* "👆 클릭해서 프로필 열기" overlay hint */}
              {!unlocked && canUnlockMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00C7B5',
                    padding: 12,
                    zIndex: 10,
                    border: '2px solid #00C7B5',
                    borderRadius: 16,
                  }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.15, 1], y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    style={{ fontSize: 24, marginBottom: 6 }}
                  >
                    👆
                  </motion.span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "'Noto Sans KR', sans-serif",
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                    lineHeight: 1.4,
                    color: '#ffffff'
                  }}>
                    클릭해서<br />
                    <span style={{ color: '#00C7B5' }}>프로필 열기</span>
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!isMissionStarted ? (
        <>
          {/* 첫 화면: 안내 메시지 & 여행 미션 시작 버튼 */}
          <div style={{
            background: 'rgba(0,199,181,0.06)', border: '1px solid rgba(0,199,181,0.15)',
            borderRadius: 12, padding: '16px 20px', marginBottom: 24,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#00C7B5', fontFamily: "'Noto Sans KR', sans-serif" }}>
              지금부터 다 함께 하는 여행 미션이 시작됩니다.
            </p>
          </div>

          <button
            onClick={() => {
              setIsMissionStarted(true);
              localStorage.setItem('signal_phase2_mission_started', 'true');
              advanceStep(1);
            }}
            style={{
              width: '100%',
              padding: '18px 0', fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #00C7B5, #00a89a)', color: '#fff',
              border: 'none', borderRadius: 14, cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.08em',
              boxShadow: '0 6px 20px rgba(0,199,181,0.2)',
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            여행 미션 시작
          </button>
        </>
      ) : (
        <>
          {/* 미션 진행 화면: 미션 장소 & 행동 미션 & 대화 미션 & 베이스캠프 복귀 */}


          {/* 1차 미션 장소 */}
          <div style={{
            background: '#141414', border: '1px solid #00C7B5',
            borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'left'
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#00C7B5',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              1차 미션 장소
            </span>
            <h4 style={{
              fontSize: 16, fontWeight: 700, color: '#f5f5f4', marginTop: 8,
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              📍 {MISSION_LOCATION.name}
            </h4>
            <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 6, lineHeight: 1.6 }}>
              {MISSION_LOCATION.address}
            </p>
            <p style={{ fontSize: 12, color: '#78716c', marginTop: 8, lineHeight: 1.6, fontStyle: 'italic' }}>
              {MISSION_LOCATION.description}
            </p>
            <a
              href="https://map.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: '#00C7B5',
                textDecoration: 'none',
                marginTop: 14,
                background: 'rgba(0, 199, 181, 0.08)',
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid rgba(0, 199, 181, 0.2)',
              }}
            >
              🗺️ 네이버 지도로 보기 ➔
            </a>
          </div>

          {/* 행동 미션 (팀 협동 사진 인증) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              background: isPhotoMissionComplete ? 'rgba(0, 199, 181, 0.03)' : '#141414',
              border: isPhotoMissionComplete ? '1px solid #00C7B5' : '1px solid #1e1e1e',
              borderRadius: 16,
              padding: '20px 24px',
              marginBottom: 24,
              boxShadow: isPhotoMissionComplete ? '0 0 20px rgba(0, 199, 181, 0.15)' : 'none',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {/* Guide message */}
            <div style={{
              color: '#5eead4',
              fontWeight: 'bold',
              fontSize: 12,
              marginBottom: 16,
              textAlign: 'center',
              lineHeight: 1.5,
              background: 'rgba(0, 199, 181, 0.08)',
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid rgba(0, 199, 181, 0.2)',
            }}>
              💡 미션을 완료할 때마다 팀원의 숨겨진 상세 프로필(직업, MBTI, 이상형 등)을 하나씩 열어볼 수 있습니다!
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>📸</span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: '#00C7B5',
                letterSpacing: '0.2em', textTransform: 'uppercase'
              }}>
                행동 미션 (팀 협동 사진 인증)
              </span>
            </div>

            <h4 style={{
              fontSize: 15, fontWeight: 700, color: '#f5f5f4',
              fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 6
            }}>
              {isPhotoMissionComplete ? '✅ 모든 사진 미션 완료' : currentMission.title}
            </h4>

            <p style={{ fontSize: 12, color: '#a8a29e', lineHeight: 1.6, marginBottom: 16 }}>
              {isPhotoMissionComplete
                ? '축하합니다! 모든 사진 미션을 성공적으로 마쳤습니다.'
                : currentMission.desc}
            </p>

            {isPhotoMissionComplete ? (
              <div style={{
                padding: '14px 0',
                fontSize: 14,
                fontWeight: 600,
                background: 'rgba(0, 199, 181, 0.08)',
                color: '#00C7B5',
                border: '1px dashed rgba(0, 199, 181, 0.3)',
                borderRadius: 12,
                fontFamily: "'Noto Sans KR', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}>
                <span>✅</span> 모든 사진 미션 완료 ({certifier ? `${certifier} 님이 최종 확정함` : '우리 팀 전원 성공'})
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="photo-upload-input"
                  style={{ display: 'none' }}
                />

                {!previewUrl ? (
                  <label
                    htmlFor="photo-upload-input"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '14px 0',
                      fontSize: 13,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #00C7B5 0%, #00a89a 100%)',
                      color: '#ffffff',
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontFamily: "'Noto Sans KR', sans-serif",
                      boxShadow: '0 4px 15px rgba(0, 199, 181, 0.2)',
                      transition: 'all 0.2s',
                    }}
                  >
                    📸 사진 선택하기
                  </label>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                    <div style={{
                      width: '100%',
                      maxHeight: 200,
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: '1px solid rgba(0, 199, 181, 0.3)',
                      background: '#0a0a0a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: 200 }}
                      />
                    </div>

                    <button
                      onClick={handleConfirmVerification}
                      disabled={isUploading}
                      style={{
                        width: '100%',
                        padding: '14px 0',
                        fontSize: 13,
                        fontWeight: 700,
                        background: isUploading ? '#1c1917' : '#00C7B5',
                        color: isUploading ? '#57534e' : '#ffffff',
                        border: 'none',
                        borderRadius: 12,
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        fontFamily: "'Noto Sans KR', sans-serif",
                        boxShadow: isUploading ? 'none' : '0 4px 15px rgba(0, 199, 181, 0.2)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isUploading ? '인증 등록 중...' : '이 사진으로 팀 미션 인증하기'}
                    </button>

                    <label
                      htmlFor="photo-upload-input"
                      style={{
                        fontSize: 11,
                        color: '#78716c',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      다른 사진 선택하기
                    </label>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* 대화 미션 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: '#141414',
              border: '1px solid rgba(0, 199, 181, 0.3)',
              borderRadius: 20,
              padding: 24,
              marginBottom: 24,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: -50, left: -50, width: 150, height: 150,
              background: 'radial-gradient(circle, rgba(0,199,181,0.08) 0%, transparent 70%)',
              borderRadius: '50%', pointerEvents: 'none',
            }} />

            <span style={{
              fontSize: 9, fontWeight: 700, color: '#00C7B5',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              display: 'block', marginBottom: 6
            }}>
              대화 미션 🥐
            </span>

            <p style={{
              fontSize: 11,
              color: '#a8a29e',
              lineHeight: 1.6,
              marginBottom: 20,
              fontFamily: "'Noto Sans KR', sans-serif"
            }}>
              📱 돌아가면서 각자의 폰으로 [대화 카드 뽑기]를 누르고,<br />
              화면에 나온 미션을 팀원들에게 직접 읽어주세요!
            </p>

            <AnimatePresence mode="wait">
              {currentCard ? (
                <motion.div
                  key={currentCard}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    padding: '24px 16px',
                    marginBottom: 20,
                    position: 'relative'
                  }}
                >
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#00C7B5',
                    marginBottom: 10,
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}>
                    {matchingText}
                  </p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#e7e5e4',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    fontFamily: "'Noto Sans KR', sans-serif",
                    wordBreak: 'keep-all'
                  }}>
                    "{currentCard}"
                  </p>
                </motion.div>
              ) : (
                <div style={{
                  padding: '40px 16px',
                  border: '1px dashed #2a2a2a',
                  borderRadius: 16,
                  marginBottom: 20,
                  color: '#57534e',
                  fontSize: 12,
                }}>
                  [대화 카드 뽑기] 버튼을 눌러 첫 미션을 시작하세요!
                </div>
              )}
            </AnimatePresence>

            {/* Guide Text Area */}
            <div style={{
              background: 'rgba(0, 199, 181, 0.03)',
              border: '1px solid rgba(0, 199, 181, 0.1)',
              borderRadius: 14,
              padding: '16px 14px',
              marginBottom: 16,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              <p style={{
                fontSize: 12,
                color: '#99f6e4',
                opacity: 0.8,
                lineHeight: 1.5,
                margin: 0,
                fontFamily: "'Noto Sans KR', sans-serif"
              }}>
                💡 4명이 돌아가면서 대화 카드를 뽑고 진행해 주세요. 조원 모두가 답변을 마쳤다면 아래 [미션 완료] 버튼을 눌러주세요! 상품이 기다리고 있어요 🎁
              </p>
              <p style={{
                fontSize: 12,
                color: '#99f6e4',
                opacity: 0.8,
                lineHeight: 1.5,
                margin: 0,
                fontFamily: "'Noto Sans KR', sans-serif"
              }}>
                💡 미션이 끝난 후에도 대화 카드는 계속 뽑을 수 있습니다. 질문을 바꾸어가며 서로를 좀 더 알아가 보세요!
              </p>
            </div>

            {/* 이 대화 미션 완료 Button */}
            <button
              onClick={() => {
                setIsTalkMissionDone(true);
                alert("🎉 딥 토크 미션 클리어! 제공된 선불 카드로 카페 시그니처 빵을 결제하세요!");
              }}
              disabled={isTalkMissionDone}
              style={{
                width: '100%',
                padding: '14px 0',
                fontSize: 13,
                fontWeight: 700,
                background: isTalkMissionDone ? '#1c1917' : 'linear-gradient(135deg, #00C7B5 0%, #00a89a 100%)',
                color: isTalkMissionDone ? '#57534e' : '#ffffff',
                border: isTalkMissionDone ? '1px solid #292524' : 'none',
                borderRadius: 12,
                cursor: isTalkMissionDone ? 'not-allowed' : 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif",
                boxShadow: isTalkMissionDone ? 'none' : '0 4px 15px rgba(0, 199, 181, 0.25)',
                transition: 'all 0.2s',
                marginBottom: 12,
              }}
            >
              {isTalkMissionDone ? '✓ 대화 미션 완료됨' : '✅ 이 대화 미션 완료'}
            </button>

            {/* 대화 카드 뽑기 Button (항상 클릭 가능) */}
            <button
              onClick={drawTalkCard}
              style={{
                width: '100%',
                padding: '14px 0',
                fontSize: 13,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #00C7B5 0%, #00a89a 100%)',
                border: 'none',
                borderRadius: 12,
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif",
                boxShadow: '0 4px 15px rgba(0, 199, 181, 0.25)',
                transition: 'transform 0.1s',
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              🎲 대화 카드 뽑기
            </button>
          </motion.div>

          {/* 베이스캠프 출발 복귀 버튼 / 후속 UI (네이버 지도 연동) */}
          {!isBasecampReturned ? (
            <button
              onClick={() => {
                showToast("곧 엄청난 상품이 걸려 있는 저녁 미션이 시작됩니다. 베이스캠프로 복귀해주세요.");
                advanceStep(3);
              }}
              style={{
                width: '100%',
                padding: '16px 0', fontSize: 14, fontWeight: 700,
                background: 'linear-gradient(135deg, #00C7B5, #00a89a)',
                color: '#fff',
                border: 'none',
                borderRadius: 14, cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.06em',
                boxShadow: '0 6px 20px rgba(0,199,181,0.2)',
                transition: 'all 0.3s',
              }}
            >
              베이스캠프로 출발
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(0, 199, 181, 0.05)',
                border: '2px solid #00C7B5',
                borderRadius: 16,
                padding: 20,
                textAlign: 'left',
                boxShadow: '0 8px 32px rgba(0, 199, 181, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🏁</span>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#5eead4', // text-teal-300 equivalent
                  margin: 0,
                  fontFamily: "'Noto Sans KR', sans-serif"
                }}>
                  베이스캠프로 출발 완료
                </h4>
              </div>

              <p style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#e7e5e4',
                lineHeight: 1.5,
                margin: '0 0 12px 0',
                fontFamily: "'Noto Sans KR', sans-serif"
              }}>
                곧 엄청난 상품이 걸려 있는 저녁 미션이 시작됩니다. 베이스캠프로 복귀해주세요!
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: 12,
                borderRadius: 10,
                marginBottom: 16,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <span style={{ fontSize: 11, color: '#78716c', display: 'block', marginBottom: 4 }}>복귀 주소</span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#d6d3d1',
                  fontFamily: "'Noto Sans KR', sans-serif",
                  lineHeight: 1.4,
                  wordBreak: 'keep-all'
                }}>
                  제주특별자치도 제주시 한림읍 한림로 300 (한림공원 정문 맞은편 베이스캠프 빌딩)
                </span>
              </div>

              <a
                href="https://map.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '14px 0',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #00C7B5 0%, #00a89a 100%)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontFamily: "'Noto Sans KR', sans-serif",
                  boxShadow: '0 4px 15px rgba(0, 199, 181, 0.25)',
                  transition: 'all 0.2s',
                  marginBottom: 12,
                }}
              >
                🗺️ 네이버 지도 바로가기
              </a>

              <button
                onClick={() => {
                  if (globalPhase < 3) {
                    alert("곧 엄청난 상품이 걸려 있는 저녁 미션이 시작됩니다. 매니저의 안내에 따라 참가 시간이 되면 버튼을 눌러주세요!");
                  } else {
                    onStartDinner();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #00C7B5 0%, #00a89a 100%)',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontFamily: "'Noto Sans KR', sans-serif",
                  boxShadow: '0 4px 15px rgba(0, 199, 181, 0.25)',
                  transition: 'transform 0.1s',
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                🌙 저녁 팀 미션 시작
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
