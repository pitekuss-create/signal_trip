import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import type { Participant } from './mockData';
import { MOCK_PARTICIPANTS } from './mockData';

interface Phase0Props {
  onLogin: (user: Participant) => void;
  showToast: (msg: string) => void;
}

export default function Phase0Login({ onLogin, showToast }: Phase0Props) {
  const [nickname, setNickname] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!nickname.trim()) { setError('닉네임을 입력해 주세요.'); return; }
    if (!phoneLast4.trim() || phoneLast4.length !== 4) { setError('연락처 뒷자리 4자리를 입력해 주세요.'); return; }

    setIsLoading(true);
    setError('');

    try {
      // Query Supabase for matching approved user
      const { data, error: dbError } = await supabase
        .from('applications')
        .select('*')
        .eq('nickname', nickname.trim())
        .eq('status', 'approved');

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        // Check if phone ends with the provided 4 digits
        const matched = data.find((row: Record<string, unknown>) => {
          const phone = String(row.phone || '');
          return phone.slice(-4) === phoneLast4;
        });

        if (matched) {
          showToast(`환영합니다, ${matched.nickname}님! ✨`);
          onLogin(matched as unknown as Participant);
          return;
        }
      }

      // Fallback: try mock data for testing
      const mockMatch = MOCK_PARTICIPANTS.find(
        (p) => p.nickname === nickname.trim() && p.phone.slice(-4) === phoneLast4,
      );

      if (mockMatch) {
        showToast(`환영합니다, ${mockMatch.nickname}님! ✨ (테스트 모드)`);
        onLogin(mockMatch);
        return;
      }

      setError('닉네임 또는 연락처 뒷자리가 일치하지 않습니다.');
    } catch (err) {
      console.error('Login error:', err);

      // Even on network error, try mock data
      const mockMatch = MOCK_PARTICIPANTS.find(
        (p) => p.nickname === nickname.trim() && p.phone.slice(-4) === phoneLast4,
      );
      if (mockMatch) {
        showToast(`환영합니다, ${mockMatch.nickname}님! ✨ (오프라인 모드)`);
        onLogin(mockMatch);
        return;
      }

      setError('서버 연결에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <h1 style={{
          fontFamily: "'Cinzel', serif", fontSize: 34, fontWeight: 800,
          letterSpacing: '0.2em', color: '#f5f5f4', marginBottom: 8,
        }}>
          SIGNAL TRIP
        </h1>
        <div style={{
          width: 40, height: 2, background: 'linear-gradient(90deg, transparent, #00C7B5, transparent)',
          margin: '0 auto 16px',
        }} />
        <p style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: 16,
          color: '#78716c', letterSpacing: '0.15em', fontWeight: 400,
        }}>
          참가자 전용 인증
        </p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          width: '100%', maxWidth: 400,
          background: '#141414', border: '1px solid #1e1e1e',
          borderRadius: 24, padding: '40px 36px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Nickname */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontSize: 14, fontWeight: 600, color: '#78716c',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
          }}>
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError(''); }}
            placeholder="시그널 트립 닉네임"
            style={{
              width: '100%', padding: '18px 20px', fontSize: 18,
              background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 14,
              color: '#f5f5f4', outline: 'none', boxSizing: 'border-box',
              fontFamily: "'Noto Sans KR', sans-serif",
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#00C7B5'; }}
            onBlur={(e) => { e.target.style.borderColor = '#2a2a2a'; }}
          />
        </div>

        {/* Phone last 4 digits */}
        <div style={{ marginBottom: 36 }}>
          <label style={{
            display: 'block', fontSize: 14, fontWeight: 600, color: '#78716c',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
          }}>
            연락처 뒷자리 4자리
          </label>
          <input
            type="tel"
            value={phoneLast4}
            onChange={(e) => { setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
            placeholder="0000"
            maxLength={4}
            style={{
              width: '100%', padding: '18px 20px', fontSize: 18,
              background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 14,
              color: '#f5f5f4', outline: 'none', boxSizing: 'border-box',
              fontFamily: "'Noto Sans KR', sans-serif",
              letterSpacing: '0.3em', textAlign: 'center',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#00C7B5'; }}
            onBlur={(e) => { e.target.style.borderColor = '#2a2a2a'; }}
          />
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 14, color: '#ef4444', textAlign: 'center',
              marginBottom: 20, fontWeight: 505,
            }}
          >
            {error}
          </motion.p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            width: '100%', padding: '20px 0', fontSize: 18, fontWeight: 700,
            background: isLoading ? '#1a1a1a' : 'linear-gradient(135deg, #00C7B5, #00a89a)',
            color: '#fff', border: 'none', borderRadius: 16, cursor: isLoading ? 'not-allowed' : 'pointer',
            fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.1em',
            boxShadow: isLoading ? 'none' : '0 6px 20px rgba(0,199,181,0.25)',
            transition: 'all 0.3s',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? '인증 중...' : '입장하기'}
        </button>
      </motion.div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          fontSize: 14, color: '#44403c', marginTop: 36, textAlign: 'center',
          lineHeight: 1.8, fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        ※ 심사 승인된 참가자만 입장 가능합니다
      </motion.p>
    </div>
  );
}
