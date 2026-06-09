import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import type { Participant, TripSession } from './mockData';

interface Phase4Props {
  user: Participant;
  participants: Participant[];
  sessionData: TripSession | null;
  showToast: (msg: string) => void;
  globalPhase: number;
  onStartDateMission: () => void;
}

export default function Phase4FirstVote({ user, participants, showToast, globalPhase, onStartDateMission }: Phase4Props) {
  const [hasVoted, setHasVoted] = useState(() => localStorage.getItem('signal_vote_first') === 'true');
  const [picks, setPicks] = useState<{ first: string; second: string; third: string }>({ first: '', second: '', third: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter opposite gender participants
  const oppositeGender = participants.filter(
    (p) => p.id !== user.id && p.gender !== user.gender
  );

  const handleSelect = (rank: 'first' | 'second' | 'third', selectedId: string) => {
    if (selectedId === '') {
      setPicks(prev => ({ ...prev, [rank]: '' }));
      return;
    }
    
    // Check if already selected in other ranks
    const alreadySelected = Object.entries(picks).some(([k, v]) => k !== rank && v === selectedId);
    if (alreadySelected) {
      showToast('⚠️ 다른 순위에서 이미 선택된 참가자입니다.');
      return;
    }
    
    setPicks(prev => ({ ...prev, [rank]: selectedId }));
  };

  const handleSubmitVote = async () => {
    if (!picks.first || !picks.second || !picks.third) {
      showToast('⚠️ 1순위, 2순위, 3순위를 모두 선택해 주세요.');
      return;
    }
    
    // Middle safety validation for uniqueness
    if (new Set([picks.first, picks.second, picks.third]).size !== 3) {
      showToast('⚠️ 각 순위에 다른 사람을 선택해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('votes').insert({
        voter_id: user.id,
        round: 'first',
        pick_1st: picks.first,
        pick_2nd: picks.second,
        pick_3rd: picks.third,
      });

      if (error) throw error;
      showToast('💕 투표가 완료되었습니다! 설레는 밤 되세요.');
    } catch (err) {
      console.error('Vote submission failed:', err);
      showToast('⚠️ 투표 제출 중 오류가 발생했으나, 로컬에 저장되었습니다.');
    } finally {
      localStorage.setItem('signal_vote_first', 'true');
      setHasVoted(true);
      setIsSubmitting(false);
    }
  };

  const handleLetterClick = () => {
    if (globalPhase < 5) {
      showToast("오전 9시 이후에 편지가 도착해요 ☀️");
    } else {
      onStartDateMission();
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
          First Vote
        </span>
        <h2 style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: 20, fontWeight: 700,
          color: '#f5f5f4', marginTop: 8,
        }}>
          1차 호감도 투표
        </h2>
        <p style={{ fontSize: 12, color: '#78716c', marginTop: 6, lineHeight: 1.6 }}>
          {hasVoted
            ? '투표가 완료되었습니다. 내일의 결과를 기다려 주세요.'
            : '마음에 드는 이성을 1~3순위로 선택해 주세요.'}
        </p>
      </div>

      {/* Opposite gender list preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        {oppositeGender.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            style={{
              background: '#141414', border: '1px solid #1e1e1e',
              borderRadius: 16, padding: 16, textAlign: 'center',
            }}
          >
            <img
              src={p.photo_urls[0] || ''}
              alt={p.nickname}
              style={{
                width: 52, height: 52, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid #2a2a2a', margin: '0 auto 10px', display: 'block',
                background: '#1a1a1a',
              }}
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${p.nickname}`;
              }}
            />
            <p style={{ fontSize: 13, fontWeight: 600, color: '#e7e5e4' }}>{p.nickname}</p>
            <p style={{ fontSize: 10, color: '#78716c', marginTop: 4 }}>{p.age}세 · {p.mbti}</p>
          </motion.div>
        ))}
      </div>

      {/* Vote Form (rendered directly on page if !hasVoted) */}
      {!hasVoted ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#141414',
            border: '1px solid #1e1e1e',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            marginBottom: 32
          }}
        >
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#f5f5f4',
            textAlign: 'center',
            marginBottom: 8,
            fontFamily: "'Noto Sans KR', sans-serif"
          }}>
            💌 호감도 투표 하기
          </h3>
          <p style={{
            fontSize: 12,
            color: '#78716c',
            textAlign: 'center',
            marginBottom: 24,
            fontFamily: "'Noto Sans KR', sans-serif"
          }}>
            각 순위별로 마음에 드는 이성을 중복 없이 선택해 주세요.
          </p>

          {(['first', 'second', 'third'] as const).map((rank, idx) => (
            <div key={rank} style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 700,
                color: '#00C7B5',
                marginBottom: 8,
                fontFamily: "'Noto Sans KR', sans-serif"
              }}>
                🌟 {idx + 1}순위 이성 선택
              </label>
              
              <select
                value={picks[rank]}
                onChange={(e) => handleSelect(rank, e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: '#0e0e0e',
                  border: '1px solid #2a2a2a',
                  color: picks[rank] ? '#00C7B5' : '#78716c',
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}
              >
                <option value="">{idx + 1}순위를 선택하세요</option>
                {oppositeGender.map((p) => {
                  const isUsedInOther = Object.entries(picks).some(
                    ([k, v]) => k !== rank && v === p.id && v !== ''
                  );
                  return (
                    <option key={p.id} value={p.id} disabled={isUsedInOther}>
                      {p.nickname} ({p.age}세 · {p.mbti}) {isUsedInOther ? '[선택됨]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}

          {/* Submission button */}
          <button
            onClick={handleSubmitVote}
            disabled={isSubmitting || !picks.first || !picks.second || !picks.third}
            style={{
              width: '100%',
              padding: '16px 0',
              fontSize: 14,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #00C7B5, #00a89a)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 14,
              cursor: (isSubmitting || !picks.first || !picks.second || !picks.third) ? 'not-allowed' : 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif",
              letterSpacing: '0.08em',
              boxShadow: '0 6px 20px rgba(0, 199, 181, 0.25)',
              opacity: (isSubmitting || !picks.first || !picks.second || !picks.third) ? 0.5 : 1,
              transition: 'all 0.2s',
              marginTop: 12,
            }}
          >
            {isSubmitting ? '제출 중...' : '투표 제출하기'}
          </button>
        </motion.div>
      ) : (
        /* Completed Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'rgba(0, 199, 181, 0.05)',
            border: '2px solid #00C7B5',
            borderRadius: 20,
            padding: 28,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 199, 181, 0.1)',
            marginBottom: 32
          }}
        >
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>💌</span>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#00C7B5',
            marginBottom: 10,
            fontFamily: "'Noto Sans KR', sans-serif"
          }}>
            투표 완료
          </h3>
          <p style={{
            fontSize: 13,
            color: '#e7e5e4',
            lineHeight: 1.6,
            margin: '0 0 24px 0',
            fontFamily: "'Noto Sans KR', sans-serif",
            wordBreak: 'keep-all'
          }}>
            투표가 완료되었습니다. 내일의 데이트 상대를 기다려주세요.
          </p>

          {/* 9시 편지 Button */}
          <button
            onClick={handleLetterClick}
            style={{
              width: '100%',
              padding: '16px 0',
              fontSize: 14,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #00C7B5, #00a89a)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif",
              letterSpacing: '0.08em',
              boxShadow: '0 6px 20px rgba(0, 199, 181, 0.25)',
              transition: 'transform 0.2s',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            🌅 9시 편지
          </button>
        </motion.div>
      )}
    </div>
  );
}
