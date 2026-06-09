import { motion } from 'framer-motion';
import { getTeamForUser, type Participant, type TripSession } from './mockData';

interface Phase6Props {
  user: Participant;
  participants: Participant[];
  sessionData: TripSession | null;
  globalPhase: number;
  onStartChoice: () => void;
}

export default function Phase6FinalTeam({ user, participants, sessionData, globalPhase, onStartChoice }: Phase6Props) {
  const teamMembers = getTeamForUser(user.id, 6, participants, sessionData);

  return (
    <div style={{ paddingTop: 32 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em',
          color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
        }}>
          Final Team Mission
        </span>
        <h2 style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: 20, fontWeight: 700,
          color: '#f5f5f4', marginTop: 8,
        }}>
          최종 팀 미션
        </h2>
        <p style={{ fontSize: 12, color: '#78716c', marginTop: 6, lineHeight: 1.6 }}>
          마지막 팀이 배정되었습니다. 남은 여행을 함께 해 주세요.
        </p>
      </div>

      {/* Final team notification */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, rgba(0,199,181,0.08), rgba(0,199,181,0.02))',
          border: '1px solid rgba(0,199,181,0.2)',
          borderRadius: 16, padding: '16px 20px', marginBottom: 28, textAlign: 'center',
        }}
      >
        <p style={{
          fontSize: 13, color: '#00C7B5', fontWeight: 600,
          fontFamily: "'Noto Sans KR', sans-serif",
        }}>
          🌟 여행의 마지막을 함께할 팀입니다
        </p>
      </motion.div>

      {/* Full Profile Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
            style={{
              background: '#141414', border: '1px solid #1e1e1e',
              borderRadius: 20, padding: 20, position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
              background: member.gender === 'MALE'
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
                    {member.gender === 'MALE' ? '남' : '여'}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#78716c' }}>
                  {member.age}세 · {member.mbti} · {member.address}
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
                  background: '#0e0e0e', padding: '10px 12px', borderRadius: 8,
                }}>
                  {member.bio}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 9, color: '#00C7B5', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  이상형
                </span>
                <p style={{
                  fontSize: 12, color: '#a8a29e', lineHeight: 1.7, marginTop: 4,
                  background: '#0e0e0e', padding: '10px 12px', borderRadius: 8,
                }}>
                  {member.ideal_type}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bridge Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={() => {
            if (globalPhase < 7) {
              alert("오후 11시 이후에 최종 편지가 도착해요 🌙");
            } else {
              onStartChoice();
            }
          }}
          style={{
            width: '100%', padding: '18px 0', fontSize: 15, fontWeight: 700,
            background: 'linear-gradient(135deg, #00C7B5, #00a89a)', color: '#fff',
            border: 'none', borderRadius: 14, cursor: 'pointer',
            fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.08em',
            boxShadow: '0 6px 24px rgba(0,199,181,0.25)',
            transition: 'transform 0.1s',
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
