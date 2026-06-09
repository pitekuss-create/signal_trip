import { motion } from 'framer-motion';
import { getTeamForUser, type Participant, type TripSession } from './mockData';

interface Phase3Props {
  user: Participant;
  participants: Participant[];
  sessionData: TripSession | null;
  showToast: (msg: string) => void;
  globalPhase: number;
  onStartVote: () => void;
}

export default function Phase3DinnerMission({ user, participants, sessionData, showToast, globalPhase, onStartVote }: Phase3Props) {
  // Query team members from phase 3 (includes ourselves)
  const teamMembers = getTeamForUser(user.id, 3, participants, sessionData);

  return (
    <div style={{ paddingTop: 32 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em',
          color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
        }}>
          Dinner Team Mission
        </span>
        <h2 style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: 20, fontWeight: 700,
          color: '#f5f5f4', marginTop: 8, letterSpacing: '0.04em',
        }}>
          디너 팀 미션
        </h2>
        <p style={{ fontSize: 12, color: '#78716c', marginTop: 6, lineHeight: 1.6 }}>
          새로운 팀이 배정되었습니다. 이번엔 전체 프로필이 공개됩니다.
        </p>
      </div>

      {/* Dinner icebreaking guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'rgba(0,199,181,0.05)',
          border: '1px solid rgba(0,199,181,0.2)',
          borderRadius: 16, padding: '16px 20px', marginBottom: 28,
        }}
      >
        <h4 style={{
          fontSize: 14, color: '#00C7B5', fontWeight: 700,
          fontFamily: "'Noto Sans KR', sans-serif", margin: '0 0 8px 0',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          🍽️ 디너 밍글링 가이드라인
        </h4>
        <p style={{ fontSize: 12, color: '#d6d3d1', lineHeight: 1.6, margin: '0 0 12px 0' }}>
          맛있는 디너와 함께 편안한 대화를 나누며 서로에 대해 더 깊이 알아가는 시간입니다. 이미 서로를 조금씩 아는 멤버들이니 더 다정하고 활기차게 이야기를 시작해보세요!
        </p>
        <h4 style={{
          fontSize: 13, color: '#00C7B5', fontWeight: 700,
          fontFamily: "'Noto Sans KR', sans-serif", margin: '0 0 6px 0',
        }}>
          🍷 아이스브레이킹 추천 토픽
        </h4>
        <ul style={{ fontSize: 12, color: '#a8a29e', lineHeight: 1.6, margin: 0, paddingLeft: 20 }}>
          <li>오늘 진행했던 첫인상 팀 미션 중 가장 재미있었던 에피소드는 무엇인가요?</li>
          <li>각자가 선호하는 음식 취향이나 제주도 여행 명소에 대해 이야기해보세요.</li>
          <li>MBTI 성향이나 가벼운 취미 생활을 화두로 소통을 이어가보세요.</li>
        </ul>
      </motion.div>

      {/* Full Profile Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.2, duration: 0.5 }}
            style={{
              background: '#141414', border: member.id === user.id ? '1px solid #00C7B5' : '1px solid #1e1e1e',
              borderRadius: 20, padding: 20, position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
              background: member.id === user.id
                ? 'linear-gradient(180deg, #00C7B5, transparent)'
                : member.gender === 'MALE'
                  ? 'linear-gradient(180deg, #60a5fa, transparent)'
                  : 'linear-gradient(180deg, #f472b6, transparent)',
            }} />

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <img
                src={member.photo_urls[0] || ''}
                alt={member.nickname}
                style={{
                  width: 56, height: 56, borderRadius: 14, objectFit: 'cover',
                  border: '2px solid #2a2a2a', flexShrink: 0, background: '#1a1a1a',
                }}
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${member.nickname}`;
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h4 style={{
                    fontSize: 15, fontWeight: 700, color: '#f5f5f4',
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}>
                    {member.nickname} {member.id === user.id ? '(나)' : ''}
                  </h4>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 6,
                    background: member.gender === 'MALE' ? 'rgba(96,165,250,0.1)' : 'rgba(244,114,182,0.1)',
                    color: member.gender === 'MALE' ? '#60a5fa' : '#f472b6',
                    fontWeight: 600,
                  }}>
                    {member.gender === 'MALE' ? '남성' : '여성'}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#a8a29e', marginBottom: 6 }}>
                  {member.age}세 · {member.mbti} · {member.address}
                </p>
                <p style={{ fontSize: 12, color: '#78716c', margin: 0 }}>
                  💼 {member.company_name || '비공개'} · {member.job_type || '비공개'}
                </p>
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <span style={{ fontSize: 9, color: '#00C7B5', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  자기소개
                </span>
                <p style={{
                  fontSize: 12, color: '#a8a29e', lineHeight: 1.7, marginTop: 4,
                  background: '#0e0e0e', padding: '10px 12px', borderRadius: 8, margin: 0
                }}>
                  {member.bio || '안녕하세요!'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 9, color: '#00C7B5', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  이상형
                </span>
                <p style={{
                  fontSize: 12, color: '#a8a29e', lineHeight: 1.7, marginTop: 4,
                  background: '#0e0e0e', padding: '10px 12px', borderRadius: 8, margin: 0
                }}>
                  {member.ideal_type || '비공개'}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 11시 편지 Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <button
          onClick={() => {
            if (globalPhase < 4) {
              showToast("오후 11시 이후에 편지가 도착해요 🌙");
            } else {
              onStartVote();
            }
          }}
          style={{
            width: '100%', padding: '18px 0', fontSize: 15, fontWeight: 700,
            background: 'linear-gradient(135deg, #00C7B5, #00a89a)', color: '#fff',
            border: 'none', borderRadius: 14, cursor: 'pointer',
            fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.08em',
            boxShadow: '0 6px 24px rgba(0,199,181,0.25)',
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          💌 11시 편지
        </button>
      </motion.div>
    </div>
  );
}
