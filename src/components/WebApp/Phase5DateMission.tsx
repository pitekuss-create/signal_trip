import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDatePartner, type Participant, type TripSession } from './mockData';

interface Phase5Props {
  user: Participant;
  participants: Participant[];
  sessionData: TripSession | null;
  showToast: (msg: string) => void;
  globalPhase: number;
  onStartPhase6: () => void;
}

const DATE_STEPS = [
  { label: '여행 시작하기', icon: '🚀', toast: '두 사람만의 특별한 하루가 시작됩니다!' },
  { label: '뮤지엄 도착', icon: '🏛️', toast: '' },
  { label: '근처 맛집 리스트 확인', icon: '🍽️', toast: '' },
  { label: '데이트 미션 시작', icon: '☕', toast: '' },
  { label: '베이스캠프로 출발', icon: '🏕️', toast: '수고하셨습니다! 베이스캠프에서 다음 일정을 기다려 주세요.' },
];

const MUSEUM_INFO = {
  name: '제주현대미술관',
  address: '제주특별자치도 제주시 한경면 저지14길 35',
};

const RESTAURANTS = [
  { name: '흑돼지 숙성고기 한라산', type: '제주 흑돼지', rating: '4.8' },
  { name: '해녀의부엌 제주본점', type: '제주 해산물', rating: '4.7' },
  { name: '올래국수', type: '제주 고기국수', rating: '4.6' },
  { name: '성산일출봉 뷰 레스토랑', type: '양식/오션뷰', rating: '4.9' },
];

const CAFE_INFO = {
  name: '카페 델문도',
  address: '제주특별자치도 서귀포시 안덕면 산록남로 762번길 113',
  mission: '두 사람만의 시간이에요, 여기에서 못 꼬시면 접어라 접어.',
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

export default function Phase5DateMission({ user, participants, sessionData, showToast, globalPhase, onStartPhase6 }: Phase5Props) {
  const [dateStep, setDateStep] = useState(() => {
    const saved = localStorage.getItem('signal_date_step');
    return saved ? parseInt(saved) : 0;
  });
  const [showPayment, setShowPayment] = useState(false);

  // 1:1 대화 카드 상태
  const [shuffledCards, setShuffledCards] = useState<string[]>(() => shuffleArray(TALK_CARDS));
  const [currentCard, setCurrentCard] = useState<string | null>(null);
  const [matchingText, setMatchingText] = useState<string | null>(null);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [isTalkMissionDone, setIsTalkMissionDone] = useState(() => {
    return localStorage.getItem('signal_phase5_talk_complete') === 'true';
  });

  // 1:1 행동 미션 상태
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isActionMissionComplete, setIsActionMissionComplete] = useState(() => {
    return localStorage.getItem('signal_phase5_action_complete') === 'true';
  });
  const [isUploading, setIsUploading] = useState(false);

  const partner = getDatePartner(user.id, participants, sessionData);

  const drawTalkCard = () => {
    if (!partner) return;
    let currentPool = [...shuffledCards];
    if (currentPool.length === 0) {
      currentPool = shuffleArray(TALK_CARDS);
    }
    const nextCard = currentPool.pop()!;
    setShuffledCards(currentPool);

    const asker = isUserTurn ? user.nickname : partner.nickname;
    const answerer = isUserTurn ? partner.nickname : user.nickname;
    setIsUserTurn(prev => !prev);

    setCurrentCard(nextCard);
    setMatchingText(`🗣️ ${asker} 님이 👉 ${answerer} 님에게 질문해 주세요!`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirmVerification = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsActionMissionComplete(true);
      localStorage.setItem('signal_phase5_action_complete', 'true');
      setPreviewUrl(null);
      showToast('🎨 행동 미션 완료!');
    }, 1000);
  };

  const advanceStep = (step: number) => {
    const stepInfo = DATE_STEPS[step - 1];

    // Step 2 (뮤지엄 도착) → show payment modal
    if (step === 2) {
      setShowPayment(true);
    }

    if (stepInfo?.toast) {
      showToast(`${stepInfo.icon} ${stepInfo.toast}`);
    }

    setDateStep(step);
    localStorage.setItem('signal_date_step', String(step));
  };

  if (!partner) {
    return (
      <div style={{ paddingTop: 60, textAlign: 'center' }}>
        <p style={{ color: '#78716c', fontSize: 14 }}>1:1 데이트 상대를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 32 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em',
          color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
        }}>
          1:1 Date
        </span>
        <h2 style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: 20, fontWeight: 700,
          color: '#f5f5f4', marginTop: 8,
        }}>
          1:1 데이트
        </h2>
      </div>

      {/* Partner Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(145deg, #181818, #141414)',
          border: '1px solid rgba(0,199,181,0.2)',
          borderRadius: 24, padding: 24, marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 100, height: 100,
          background: 'radial-gradient(circle, rgba(0,199,181,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img
            src={partner.photo_urls[0] || ''}
            alt={partner.nickname}
            style={{
              width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid rgba(0,199,181,0.3)', margin: '0 auto 14px',
              display: 'block', background: '#1a1a1a',
            }}
          />
          <h3 style={{
            fontSize: 18, fontWeight: 700, color: '#f5f5f4',
            fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 4,
          }}>
            {partner.nickname}
          </h3>
          <p style={{ fontSize: 12, color: '#a8a29e' }}>
            {partner.age}세 · {partner.mbti} · {partner.address}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MiniField label="자기소개" value={partner.bio} />
          <MiniField label="이상형" value={partner.ideal_type} />
          <MiniField label="직업" value={partner.company_name} />
          <MiniField label="SNS" value={partner.sns_link} />
        </div>
      </motion.div>

      {/* Step Content Areas */}
      {dateStep >= 2 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: '#141414', border: '1px solid #1e1e1e',
            borderRadius: 16, padding: 18, marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 9, color: '#00C7B5', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            🏛️ 뮤지엄 정보
          </span>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f4', marginTop: 6 }}>{MUSEUM_INFO.name}</p>
          <p style={{ fontSize: 11, color: '#78716c', marginTop: 4 }}>{MUSEUM_INFO.address}</p>
          <p style={{ fontSize: 11, color: '#00C7B5', marginTop: 6, fontWeight: 600 }}>
            🎁 뮤지엄 굿즈샵에서 기념 엽서 세트를 선물로 드립니다! (제공된 선불 카드로 결제)
          </p>
        </motion.div>
      )}

      {dateStep >= 3 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: '#141414', border: '1px solid #1e1e1e',
            borderRadius: 16, padding: 18, marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 9, color: '#00C7B5', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            🍽️ 근처 맛집 리스트 (점심식사)
          </span>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RESTAURANTS.map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#0e0e0e', padding: '10px 12px', borderRadius: 10,
              }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#e7e5e4' }}>{r.name}</p>
                  <p style={{ fontSize: 10, color: '#78716c', marginTop: 2 }}>{r.type}</p>
                </div>
                <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>⭐ {r.rating}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {dateStep >= 4 && (
        <>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              background: '#141414', border: '1px solid #00C7B5',
              borderRadius: 16, padding: 18, marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 9, color: '#00C7B5', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              ☕ 데이트 미션 카페
            </span>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f4', marginTop: 6 }}>📍 {CAFE_INFO.name}</p>
            <p style={{ fontSize: 11, color: '#78716c', marginTop: 4 }}>{CAFE_INFO.address}</p>
            <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 10, lineHeight: 1.6, background: '#0e0e0e', padding: '10px 12px', borderRadius: 10, fontStyle: 'italic' }}>
              🎯 미션: {CAFE_INFO.mission}
            </p>
          </motion.div>

          {/* 1:1 행동 미션 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: isActionMissionComplete ? 'rgba(0, 199, 181, 0.03)' : '#141414',
              border: isActionMissionComplete ? '1px solid #00C7B5' : '1px solid #1e1e1e',
              borderRadius: 16,
              padding: '20px 24px',
              marginBottom: 16,
              textAlign: 'center',
              boxShadow: isActionMissionComplete ? '0 0 20px rgba(0, 199, 181, 0.15)' : 'none',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>🎨</span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: '#00C7B5',
                letterSpacing: '0.2em', textTransform: 'uppercase'
              }}>
                1:1 행동 미션
              </span>
            </div>

            <h4 style={{
              fontSize: 15, fontWeight: 700, color: '#f5f5f4',
              fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 6
            }}>
              🎨 1:1 행동 미션: 서로의 얼굴 스케치
            </h4>

            <p style={{ fontSize: 12, color: '#a8a29e', lineHeight: 1.6, marginBottom: 16 }}>
              서로의 얼굴을 관찰하며 그려주세요! 서로가 그려준 그림을 사진 찍어 인증하면 미션 성공입니다.
            </p>

            {isActionMissionComplete ? (
              <div style={{
                padding: '14px 0',
                fontSize: 12,
                fontWeight: 650,
                background: 'rgba(0, 199, 181, 0.08)',
                color: '#00C7B5',
                border: '1px dashed rgba(0, 199, 181, 0.3)',
                borderRadius: 12,
                fontFamily: "'Noto Sans KR', sans-serif",
                lineHeight: 1.6,
              }}>
                🎉 미션 완료! 베이스캠프로 출발하시면 그림을 소중하게 보관할 수 있는 [원목 액자]를 선물로 드립니다.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="date-photo-upload-input"
                  style={{ display: 'none' }}
                />

                {!previewUrl ? (
                  <label
                    htmlFor="date-photo-upload-input"
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
                    📸 스케치 인증하기
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
                      {isUploading ? '인증 등록 중...' : '이 사진으로 미션 완료하기'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* 1:1 대화 카드 미션 영역 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: '#141414',
              border: '1px solid rgba(0, 199, 181, 0.3)',
              borderRadius: 20,
              padding: 24,
              marginBottom: 16,
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
              1:1 대화 미션 🥐
            </span>

            <p style={{
              fontSize: 11,
              color: '#a8a29e',
              lineHeight: 1.6,
              marginBottom: 20,
              fontFamily: "'Noto Sans KR', sans-serif"
            }}>
              서로 교대로 [대화 카드 뽑기]를 누르고,<br />
              화면에 나온 질문에 대해 서로 깊고 다정한 이야기를 나눠보세요!
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

            {/* 1:1 대화 미션 완료 버튼 */}
            <button
              onClick={() => {
                setIsTalkMissionDone(true);
                localStorage.setItem('signal_phase5_talk_complete', 'true');
                showToast("🎉 1:1 딥 토크 미션 완료!");
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

            {/* 대화 카드 뽑기 버튼 */}
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
        </>
      )}

      {isTalkMissionDone && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: 'linear-gradient(135deg, rgba(0,199,181,0.08), rgba(0,199,181,0.02))',
            border: '1px solid rgba(0,199,181,0.2)',
            borderRadius: 16, padding: 18, marginBottom: 16, textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 20, marginBottom: 8 }}>🎉</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#00C7B5' }}>미션 완료!</p>
          <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 6, lineHeight: 1.6 }}>
            미션 리워드: 카페 베이커리 쿠폰이 지급됩니다.<br />
            카운터에서 이 화면을 보여주세요. 🍞
          </p>
        </motion.div>
      )}

      {/* Sequential Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        {DATE_STEPS.slice(0, 5).map((s, i) => {
          const stepNum = i + 1;
          const isActive = dateStep === i;
          const isDone = dateStep >= stepNum;
          const isLocked = dateStep < i;

          return (
            <button
              key={i}
              onClick={() => isActive && advanceStep(stepNum)}
              disabled={!isActive}
              style={{
                padding: '16px 16px', fontSize: 13, fontWeight: isDone ? 500 : 700,
                background: isDone ? '#1a1a1a' : isActive ? 'linear-gradient(135deg, #00C7B5, #00a89a)' : '#111',
                color: isDone ? '#44403c' : isActive ? '#fff' : '#2a2a2a',
                border: isDone ? '1px solid #1e1e1e' : isActive ? 'none' : '1px solid #1a1a1a',
                borderRadius: 14, cursor: isActive ? 'pointer' : 'default',
                fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.04em',
                opacity: isLocked ? 0.35 : 1,
                boxShadow: isActive ? '0 6px 20px rgba(0,199,181,0.2)' : 'none',
                transition: 'all 0.3s',
                textAlign: 'left',
              }}
            >
              {isDone ? `✓ ${s.label}` : `${s.icon} ${s.label}`}
            </button>
          );
        })}

        {/* 베이스캠프 출발 6번째 버튼 / 복귀 카드 및 마지막 밤 파티 미션 시작 */}
        {dateStep >= 6 ? (
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
              marginTop: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🏕️</span>
              <h4 style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#5eead4',
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
              수고하셨습니다! 베이스캠프로 안전하게 귀가해 주세요.
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
                if (globalPhase < 6) {
                  alert("모든 커플이 베이스캠프로 복귀 중입니다. 엄청난 상품이 있는 저녁 팀 미션이 있어요 매니저의 안내가 있을 때까지 잠시 대기해 주세요.");
                  return;
                }
                onStartPhase6();
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
        ) : (
          <button
            onClick={() => dateStep === 5 && advanceStep(6)}
            disabled={dateStep !== 5}
            style={{
              width: '100%',
              padding: '16px 16px',
              fontSize: 13,
              fontWeight: 700,
              background: dateStep === 5 ? 'linear-gradient(135deg, #00C7B5, #00a89a)' : '#111',
              color: dateStep === 5 ? '#fff' : '#2a2a2a',
              border: dateStep === 5 ? 'none' : '1px solid #1a1a1a',
              borderRadius: 14,
              cursor: dateStep === 5 ? 'pointer' : 'default',
              fontFamily: "'Noto Sans KR', sans-serif",
              letterSpacing: '0.04em',
              opacity: dateStep < 5 ? 0.35 : 1,
              boxShadow: dateStep === 5 ? '0 6px 20px rgba(0,199,181,0.2)' : 'none',
              transition: 'all 0.3s',
              textAlign: 'left',
              marginTop: 10,
            }}
          >
            🏕️ 베이스캠프로 출발
          </button>
        )}
      </div>

      {/* Payment Info Modal */}
      <AnimatePresence>
        {showPayment && (
          <div
            onClick={() => setShowPayment(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 340,
                background: '#141414', border: '1px solid #1e1e1e',
                borderRadius: 24, padding: 28, textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 32, marginBottom: 12 }}>🏛️</p>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f4', marginBottom: 8 }}>입장 및 선물 안내</h3>
              <p style={{ fontSize: 13, color: '#a8a29e', lineHeight: 1.7, marginBottom: 10 }}>
                {MUSEUM_INFO.name} 관람 후 굿즈샵을 꼭 방문해 주세요!<br />
                <strong style={{ color: '#00C7B5' }}>🎁 기념 엽서 세트 선물 증정</strong>
              </p>
              <p style={{ fontSize: 11, color: '#78716c', lineHeight: 1.6, marginBottom: 20 }}>
                기념 엽서 세트는 제공된 선불 카드로 결제하실 수 있습니다. 서로를 향한 소중한 기록을 엽서에 담아보세요! 💕
              </p>
              <button
                onClick={() => setShowPayment(false)}
                style={{
                  width: '100%', padding: '14px 0', fontSize: 14, fontWeight: 600,
                  background: '#00C7B5', color: '#fff', border: 'none',
                  borderRadius: 12, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
                }}
              >
                확인
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontSize: 9, color: '#00C7B5', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <p style={{ fontSize: 12, color: '#a8a29e', lineHeight: 1.7, marginTop: 3 }}>{value}</p>
    </div>
  );
}
