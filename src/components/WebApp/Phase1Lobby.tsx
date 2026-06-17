import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Participant, TripSession } from './mockData';

interface Phase1Props {
  user: Participant;
  participants: Participant[];
  sessionData: TripSession | null;
  showToast: (msg: string) => void;
  globalPhase: number;
  onStartTrip: () => void;
}

const LETTER_LINES = [
  '이제부터 당신은',
  '낯선 곳으로 떠납니다.',
  '',
  '48시간의 시크릿 소셜 미션.',
  '',
  '취향 크루와 함께',
  '새로운 이면을 탐험할까요?',
];

export default function Phase1Lobby({ user, globalPhase, onStartTrip, showToast }: Phase1Props) {
  const [isStarted, setIsStarted] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div style={{ paddingTop: 40 }}>
      {!isStarted ? (
        <>
          {/* Welcome Letter */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 32 }}
            >
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.3em',
                color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
              }}>
                Welcome Letter
              </span>
            </motion.div>

            <div style={{ padding: '0 8px' }}>
              {LETTER_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.4 }}
                  style={{
                    fontFamily: line === '' ? undefined : "'Noto Sans KR', sans-serif",
                    fontSize: line.includes('48시간') ? 22 : 17,
                    fontWeight: line.includes('48시간') ? 700 : 300,
                    color: line.includes('48시간') ? '#00C7B5' : '#d6d3d1',
                    lineHeight: 2.2,
                    letterSpacing: '0.08em',
                    minHeight: line === '' ? 16 : undefined,
                  }}
                >
                  {line || '\u00A0'}
                </motion.p>
              ))}
            </div>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 3.6 }}
              style={{
                width: 60, height: 1, margin: '36px auto 0',
                background: 'linear-gradient(90deg, transparent, #00C7B5, transparent)',
              }}
            />
          </div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 4px' }}
          >
            {globalPhase === 2 ? (
              <motion.button
                onClick={() => setIsStarted(true)}
                animate={{ scale: [1, 1.03, 1], boxShadow: ['0 6px 20px rgba(0,199,181,0.2)', '0 6px 28px rgba(0,199,181,0.5)', '0 6px 20px rgba(0,199,181,0.2)'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{
                  padding: '18px 0', fontSize: 15, fontWeight: 700,
                  background: 'linear-gradient(135deg, #00C7B5, #00a89a)', color: '#fff',
                  border: 'none', borderRadius: 14, cursor: 'pointer',
                  fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.08em',
                  transition: 'transform 0.1s',
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                여행 시작
              </motion.button>
            ) : (
              <button
                disabled
                style={{
                  padding: '18px 0', fontSize: 15, fontWeight: 600,
                  background: '#1a1917', color: '#57534e',
                  border: '1px solid #292524', borderRadius: 14, cursor: 'not-allowed',
                  fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.08em',
                  opacity: 0.6,
                }}
              >
                호스트의 시작 신호를 기다리는 중...
              </button>
            )}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ padding: '0 8px', textAlign: 'center' }}
        >
          {/* Basecamp and Lodging Info Screen */}
          <div style={{ marginBottom: 32 }}>
            <span style={{
              fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.3em',
              color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
              display: 'block', marginBottom: 20
            }}>
              Basecamp Guide
            </span>
            
            {/* Basecamp card */}
            <div style={{
              background: '#141414', border: '1px solid #1e1e1e',
              borderRadius: 20, padding: 24, marginBottom: 20,
              textAlign: 'left', boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f4', marginBottom: 12 }}>
                📍 베이스캠프 주소 안내
              </h4>
              <p style={{ fontSize: 14, color: '#d6d3d1', lineHeight: 1.6, marginBottom: 16 }}>
                제주특별자치도 제주시 한림읍 한림로 300<br />
                (한림공원 정문 맞은편 베이스캠프 빌딩)
              </p>
              
              <a 
                href="https://map.naver.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#00C7B5',
                  textDecoration: 'none',
                  background: 'rgba(0, 199, 181, 0.08)',
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid rgba(0, 199, 181, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 199, 181, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 199, 181, 0.08)'; }}
              >
                🗺️ 네이버 지도로 보기 ➔
              </a>
            </div>

            {/* Lodgings card */}
            <div style={{
              background: '#141414', border: '1px solid #1e1e1e',
              borderRadius: 20, padding: 24, textAlign: 'left',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f4', marginBottom: 10 }}>
                🏨 근처 숙박업소 리스트 안내
              </h4>
              <p style={{ fontSize: 12, color: '#00C7B5', fontWeight: 600, marginBottom: 14 }}>
                ※ 숙박은 참가자 본인의 기호에 따라 자유롭게 예약이 가능합니다.
              </p>
              <ul style={{ 
                listStyle: 'none', padding: 0, margin: 0, 
                display: 'flex', flexDirection: 'column', gap: 10,
                fontSize: 13, color: '#a8a29e', lineHeight: 1.6
              }}>
                <li style={{ borderBottom: '1px solid #1e1e1e', paddingBottom: 8 }}>
                  🏡 <strong style={{ color: '#d6d3d1' }}>협재 썬셋 독채 펜션</strong> (도보 5분 거리)
                </li>
                <li style={{ borderBottom: '1px solid #1e1e1e', paddingBottom: 8 }}>
                  🏖️ <strong style={{ color: '#d6d3d1' }}>한림 블루 게스트하우스</strong> (도보 10분 거리)
                </li>
                <li>
                  🏨 <strong style={{ color: '#d6d3d1' }}>제주 스테이 부티크 호텔</strong> (차량 5분 거리)
                </li>
              </ul>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 4px' }}>
            <button
              onClick={() => setShowProfile(true)}
              style={{
                padding: '18px 0', fontSize: 15, fontWeight: 650,
                background: '#141414', color: '#d6d3d1',
                border: '1px solid #2a2a2a', borderRadius: 14, cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.08em',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00C7B5'; e.currentTarget.style.color = '#00C7B5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#d6d3d1'; }}
            >
              내 프로필 보기
            </button>

            <button
              onClick={() => {
                if (globalPhase < 2) {
                  showToast("여행 시작과 함께 팀 미션이 시작됩니다. 호스트의 안내를 기다려주세요.");
                } else {
                  onStartTrip();
                }
              }}
              style={{
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
              팀 미션 시작
            </button>
          </div>
        </motion.div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div
          onClick={() => setShowProfile(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 380,
              background: '#141414', border: '1px solid #1e1e1e',
              borderRadius: 24, padding: 28, position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, #00C7B5, transparent)',
              borderRadius: '24px 24px 0 0',
            }} />

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              {user.photo_urls[0] && (
                <img
                  src={user.photo_urls[0]}
                  alt="profile"
                  style={{
                    width: 80, height: 80, borderRadius: '50%',
                    objectFit: 'cover', border: '2px solid #2a2a2a',
                    margin: '0 auto 16px', display: 'block',
                    background: '#1a1a1a',
                  }}
                />
              )}
              <h3 style={{
                fontFamily: "'Noto Sans KR', sans-serif", fontSize: 18,
                fontWeight: 700, color: '#f5f5f4', marginBottom: 4,
              }}>
                {user.nickname}
              </h3>
              <p style={{ fontSize: 12, color: '#78716c' }}>
                {user.age}세 · {user.mbti} · {user.address}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ProfileField label="자기소개" value={user.bio} />
              <ProfileField label="이상형" value={user.ideal_type} />
              <ProfileField label="직업" value={`${user.company_name}`} />
              <ProfileField label="SNS" value={user.sns_link} />
            </div>

            <button
              onClick={() => setShowProfile(false)}
              style={{
                width: '100%', marginTop: 24, padding: '14px 0', fontSize: 14, fontWeight: 600,
                background: '#1a1a1a', color: '#a8a29e', border: '1px solid #2a2a2a',
                borderRadius: 12, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
              }}
            >
              닫기
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{
        display: 'block', fontSize: 10, fontWeight: 600, color: '#00C7B5',
        letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6,
      }}>
        {label}
      </span>
      <p style={{
        fontSize: 13, color: '#d6d3d1', lineHeight: 1.7, fontWeight: 300,
        background: '#0a0a0a', padding: '12px 14px', borderRadius: 10,
        border: '1px solid #1e1e1e',
      }}>
        {value}
      </p>
    </div>
  );
}
