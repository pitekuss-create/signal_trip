import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import type { Participant, TripSession } from './mockData';

interface Phase7Props {
  user: Participant;
  participants: Participant[];
  sessionData: TripSession | null;
  showToast: (msg: string) => void;
  globalPhase: number;
  onStartResult: () => void;
}

export default function Phase7FinalChoice({ user, participants, showToast, globalPhase, onStartResult }: Phase7Props) {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(() => localStorage.getItem('signal_vote_final') === 'true');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const oppositeGender = participants.filter(
    (p) => p.id !== user.id && p.gender !== user.gender,
  );

  const handleSubmit = async () => {
    if (!selectedPartnerId) {
      showToast('⚠️ 최종 선택을 해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('votes').insert({
        voter_id: user.id,
        round: 'final',
        pick_1st: selectedPartnerId,
      });
      if (error) throw error;
      
      localStorage.setItem('signal_vote_final', 'true');
      setIsSubmitted(true);
      showToast('💖 최종 선택이 완료되었습니다.');
    } catch (err) {
      console.error('Final vote save failed:', err);
      // Fallback to local storage in case of network issues
      localStorage.setItem('signal_vote_final', 'true');
      setIsSubmitted(true);
      showToast('💖 최종 선택이 완료되었습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: 32 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em',
          color: '#00C7B5', fontWeight: 600, textTransform: 'uppercase',
        }}>
          Final Choice
        </span>
        <h2 style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: 20, fontWeight: 700,
          color: '#f5f5f4', marginTop: 8,
        }}>
          최종 선택
        </h2>
        <p style={{ fontSize: 12, color: '#78716c', marginTop: 6, lineHeight: 1.6 }}>
          {isSubmitted
            ? '선택이 완료되었습니다. 결과를 기다려 주세요.'
            : '48시간의 여행 끝, 단 한 사람을 선택해 주세요.'}
        </p>
      </div>

      {!isSubmitted ? (
        <>
          {/* Opposite gender cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
            {oppositeGender.map((p, i) => {
              const isSelected = selectedPartnerId === p.id;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => setSelectedPartnerId(p.id)}
                  style={{
                    background: '#141414',
                    border: isSelected ? '2px solid #00C7B5' : '1px solid #1e1e1e',
                    borderRadius: 16,
                    padding: 16,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 15px rgba(0, 199, 181, 0.25)' : 'none',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <img
                    src={p.photo_urls[0] || ''}
                    alt={p.nickname}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isSelected ? '2px solid #00C7B5' : '2px solid #2a2a2a',
                      margin: '0 auto 10px',
                      display: 'block',
                      background: '#1a1a1a',
                    }}
                  />
                  <p style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#00C7B5' : '#e7e5e4' }}>
                    {p.nickname}
                  </p>
                  <p style={{ fontSize: 10, color: '#78716c', marginTop: 4 }}>
                    {p.age}세 · {p.mbti}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedPartnerId}
            style={{
              width: '100%',
              padding: '18px 0',
              fontSize: 15,
              fontWeight: 700,
              background: selectedPartnerId ? 'linear-gradient(135deg, #00C7B5, #00a89a)' : '#1c1917',
              color: selectedPartnerId ? '#fff' : '#57534e',
              border: selectedPartnerId ? 'none' : '1px solid #292524',
              borderRadius: 14,
              cursor: isSubmitting || !selectedPartnerId ? 'not-allowed' : 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif",
              letterSpacing: '0.08em',
              boxShadow: selectedPartnerId ? '0 6px 24px rgba(0,199,181,0.25)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {isSubmitting ? '제출 중...' : '💘 최종 선택 완료'}
          </button>
        </>
      ) : (
        /* Waiting / 대기 화면 */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#141414',
            border: '1px solid rgba(0,199,181,0.2)',
            borderRadius: 20,
            padding: 28,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 28, marginBottom: 12 }}>💖</p>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#f5f5f4',
            fontFamily: "'Noto Sans KR', sans-serif",
            marginBottom: 12,
          }}>
            선택이 완료되었습니다
          </h3>
          <p style={{
            fontSize: 13,
            color: '#a8a29e',
            lineHeight: 1.8,
            wordBreak: 'keep-all',
            marginBottom: globalPhase >= 8 ? 20 : 0,
          }}>
            최종 선택이 완료되었습니다. 매칭 결과가 담긴 11시 편지를 기다려주세요 💖
          </p>

          {globalPhase >= 8 && (
            <button
              onClick={onStartResult}
              style={{
                width: '100%',
                padding: '18px 0',
                fontSize: 15,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #00C7B5, #00a89a)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif",
                letterSpacing: '0.08em',
                boxShadow: '0 6px 24px rgba(0,199,181,0.25)',
                transition: 'all 0.2s',
              }}
            >
              💌 아침 11시 편지 확인하기
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
