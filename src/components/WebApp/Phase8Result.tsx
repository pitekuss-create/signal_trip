import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMatchResultForUser, type Participant, type TripSession, type MatchResult } from './mockData';

interface Phase8Props {
  user: Participant;
  participants: Participant[];
  sessionData: TripSession | null;
  showToast: (msg: string) => void;
  matchResult: MatchResult | null;
}

// Heart particle for celebration
function FloatingHeart({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 0 }}
      animate={{
        y: -400,
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        x: [0, x * 0.5, x, x * 0.3],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        bottom: 0,
        left: `${30 + Math.random() * 40}%`,
        fontSize: 18 + Math.random() * 14,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {['💕', '✨', '💗', '🌟', '💖'][Math.floor(Math.random() * 5)]}
    </motion.div>
  );
}

export default function Phase8Result({ user, participants, matchResult }: Phase8Props) {
  const { is_matched, partner } = getMatchResultForUser(user.id, participants, matchResult);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (is_matched) {
      const timer = setTimeout(() => setRevealed(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [is_matched]);

  // ── MATCHED ──
  if (is_matched && partner) {
    return (
      <div style={{ paddingTop: 32, position: 'relative', overflow: 'hidden', minHeight: '80vh' }}>
        {/* Floating hearts */}
        {Array.from({ length: 8 }).map((_, i) => (
          <FloatingHeart key={i} delay={i * 0.6} x={(Math.random() - 0.5) * 60} />
        ))}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          style={{ textAlign: 'center', marginBottom: 36, position: 'relative', zIndex: 1 }}
        >
          <motion.p
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 48, marginBottom: 16 }}
          >
            💕
          </motion.p>
          <span style={{
            fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em',
            color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
          }}>
            Perfect Match
          </span>
          <h2 style={{
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: 22, fontWeight: 700,
            color: '#f5f5f4', marginTop: 8,
          }}>
            축하합니다!
          </h2>
          <p style={{
            fontSize: 14, color: '#a8a29e', marginTop: 8, lineHeight: 1.7,
            wordBreak: 'keep-all',
          }}>
            두 사람의 마음이 만났습니다.<br/>
            48시간의 여행이 새로운 시작이 됩니다.
          </p>
        </motion.div>

        {/* Partner reveal card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            background: 'linear-gradient(145deg, #181818, #141414)',
            border: '2px solid rgba(0,199,181,0.3)',
            borderRadius: 28, padding: 32, textAlign: 'center',
            position: 'relative', zIndex: 1, overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div style={{
            position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(0,199,181,0.1) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <img
            src={partner.photo_urls[0] || ''}
            alt={partner.nickname}
            style={{
              width: 96, height: 96, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid #00C7B5', margin: '0 auto 16px', display: 'block',
              background: '#1a1a1a',
              boxShadow: '0 0 30px rgba(0,199,181,0.2)',
            }}
          />

          <p style={{
            fontSize: 13, color: '#78716c', marginBottom: 4,
            fontFamily: "'Noto Sans KR', sans-serif",
          }}>
            {partner.nickname}
          </p>

          {/* Real name reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          >
            <div style={{
              margin: '20px 0', padding: '20px 0',
              borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e',
            }}>
              <span style={{
                fontSize: 9, fontWeight: 600, color: '#00C7B5',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                display: 'block', marginBottom: 10,
              }}>
                Real Identity
              </span>
              <h3 style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: 26, fontWeight: 800, color: '#f5f5f4',
                letterSpacing: '0.15em', marginBottom: 8,
              }}>
                {partner.name}
              </h3>
              <p style={{
                fontSize: 18, color: '#00C7B5', fontWeight: 700,
                fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em',
              }}>
                📞 {partner.phone}
              </p>
            </div>
          </motion.div>

          {!revealed && (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ marginTop: 20 }}
            >
              <p style={{ fontSize: 12, color: '#78716c', fontStyle: 'italic' }}>
                상대방의 정보가 공개됩니다...
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          style={{
            textAlign: 'center', fontSize: 12, color: '#78716c',
            marginTop: 28, lineHeight: 1.8, position: 'relative', zIndex: 1,
          }}
        >
          이 여행이 두 사람에게 아름다운 시작이 되길 바랍니다.<br />
          시그널 트립이 언제나 응원합니다.
        </motion.p>
      </div>
    );
  }

  // ── NOT MATCHED ──
  return (
    <div style={{ paddingTop: 48, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ textAlign: 'center' }}
      >
        {/* Subtle decorative element */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 120, height: 120, margin: '0 auto 36px',
            borderRadius: '50%',
            border: '1px solid rgba(0,199,181,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            border: '1px solid rgba(0,199,181,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 32 }}>🌿</span>
          </div>
        </motion.div>

        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em',
          color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
          display: 'block', marginBottom: 16,
        }}>
          A New Beginning
        </span>
      </motion.div>

      {/* Warm consolation message */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        style={{
          background: '#141414', border: '1px solid #1e1e1e',
          borderRadius: 24, padding: '36px 28px', position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(0,199,181,0.3), transparent)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {[
            '우리는 당신의 모습에서',
            '아름다운 미소와',
            '여행을 하는 매순간',
            '어린아이와 같은 모습을',
            '발견했어요.',
          ].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.5, duration: 0.8 }}
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: 16, fontWeight: 300, color: '#d6d3d1',
                lineHeight: 2.4, textAlign: 'center',
                letterSpacing: '0.06em',
              }}
            >
              {line}
            </motion.p>
          ))}

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 4.5, duration: 1 }}
            style={{
              width: 40, height: 1, margin: '28px auto',
              background: 'linear-gradient(90deg, transparent, #00C7B5, transparent)',
            }}
          />

          {[
            '당신에게는',
            '새로운 시작이 되는 순간이에요.',
          ].map((line, i) => (
            <motion.p
              key={`b-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 5 + i * 0.5, duration: 0.8 }}
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: 16, fontWeight: line.includes('새로운') ? 600 : 300,
                color: line.includes('새로운') ? '#00C7B5' : '#d6d3d1',
                lineHeight: 2.4, textAlign: 'center',
                letterSpacing: '0.06em',
              }}
            >
              {line}
            </motion.p>
          ))}

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 6.5, duration: 1 }}
            style={{
              width: 40, height: 1, margin: '28px auto',
              background: 'linear-gradient(90deg, transparent, #00C7B5, transparent)',
            }}
          />

          {[
            '언제든 놀러 오세요.',
            '당신은 우리의 가족이에요.',
          ].map((line, i) => (
            <motion.p
              key={`c-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 7 + i * 0.5, duration: 0.8 }}
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: line.includes('가족') ? 18 : 16,
                fontWeight: line.includes('가족') ? 700 : 300,
                color: line.includes('가족') ? '#f5f5f4' : '#d6d3d1',
                lineHeight: 2.4, textAlign: 'center',
                letterSpacing: '0.06em',
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Signal Trip signature */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 8.5 }}
        style={{
          textAlign: 'center', marginTop: 32,
          fontFamily: "'Cinzel', serif", fontSize: 11,
          letterSpacing: '0.25em', color: '#44403c',
        }}
      >
        — SIGNAL TRIP —
      </motion.p>
    </div>
  );
}
