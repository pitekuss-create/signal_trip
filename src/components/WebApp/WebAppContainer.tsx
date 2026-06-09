import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { MOCK_PARTICIPANTS, type Participant, type TripSession, type MatchResult } from './mockData';
import { Calendar, Lock, CheckCircle2, X } from 'lucide-react';
import Phase0Login from './Phase0Login';
import Phase1Lobby from './Phase1Lobby';
import Phase2TeamMission from './Phase2TeamMission';
import Phase3DinnerMission from './Phase3DinnerMission';
import Phase4FirstVote from './Phase4FirstVote';
import Phase5DateMission from './Phase5DateMission';
import Phase6FinalTeam from './Phase6FinalTeam';
import Phase7FinalChoice from './Phase7FinalChoice';
import Phase8Result from './Phase8Result';

interface TimelineItem {
  phase: number;
  time: string;
  title: string;
}

const TIMELINE_DATA: TimelineItem[] = [
  { phase: 1, time: 'Day 1 14:00', title: '베이스캠프 집결 및 웰컴티' },
  { phase: 2, time: 'Day 1 15:00', title: '첫인상 팀 미션 및 프로필 깨기' },
  { phase: 3, time: 'Day 1 19:00', title: '시크릿 디너 및 바이닐(Vinyl) 밍글링' },
  { phase: 4, time: 'Day 1 23:00', title: '심야의 편지 (1차 호감도 선택)' },
  { phase: 5, time: 'Day 2 09:00', title: '1:1 데이트 코스 미션' },
  { phase: 6, time: 'Day 2 15:00', title: '최종 바비큐 팀 미션 및 대화 찬스' },
  { phase: 7, time: 'Day 2 23:00', title: '운명의 시간 (최종 동반자 선택)' },
  { phase: 8, time: 'Day 3 09:00', title: '시그널 트립 최종 결과 발표' }
];

// ── Toast Component ──
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            zIndex: 99999, maxWidth: 360, width: '90%',
          }}
        >
          <div style={{
            background: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,199,181,0.25)', borderRadius: 16,
            padding: '16px 24px', textAlign: 'center',
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: 14, fontWeight: 500,
            color: '#e7e5e4', letterSpacing: '0.02em',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Container ──
export default function WebAppContainer() {
  const [user, setUser] = useState<Participant | null>(null);
  const [globalPhase, setGlobalPhase] = useState<number>(0);
  const [localViewPhase, setLocalViewPhase] = useState<number>(() => {
    const saved = localStorage.getItem('signal_local_phase');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 1;
  });
  const [sessionData, setSessionData] = useState<TripSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // ── Toast helper ──
  const showToast = useCallback((message: string, duration = 3000) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), duration);
  }, []);

  // ── Restore auth from localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem('signal_trip_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Participant;
        setUser(parsed);
      } catch { /* ignore */ }
    }
  }, []);

  // ── Save localViewPhase to localStorage when changed ──
  useEffect(() => {
    if (localViewPhase > 0) {
      localStorage.setItem('signal_local_phase', String(localViewPhase));
    } else {
      localStorage.removeItem('signal_local_phase');
    }
  }, [localViewPhase]);

  // ── Fetch current phase from trip_sessions ──
  const fetchSession = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('trip_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        const phase = data.current_phase;
        setGlobalPhase(phase);
        setSessionData(data as unknown as TripSession);
        
        if (phase === 1) {
          localStorage.removeItem('signal_phase2_step');
          localStorage.removeItem('signal_phase2_mission_started');
          localStorage.removeItem('signal_trip_phase2_state');
          localStorage.removeItem('signal_phase2_random_animal');
          localStorage.removeItem('signal_trip_started');
        }
        
        
        const saved = localStorage.getItem('signal_local_phase');
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed)) {
            if (parsed > phase) {
              setLocalViewPhase(phase);
              localStorage.setItem('signal_local_phase', String(phase));
            } else {
              setLocalViewPhase(parsed);
            }
            return;
          }
        }

        const started = localStorage.getItem('signal_trip_started') === 'true';
        if (phase === 2) {
          setLocalViewPhase(started ? 2 : 1);
        } else {
          setLocalViewPhase(phase);
        }
      } else {
        setGlobalPhase(1);
        const saved = localStorage.getItem('signal_local_phase');
        if (!saved) {
          setLocalViewPhase(1);
        } else {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed > 1) {
            setLocalViewPhase(1);
            localStorage.setItem('signal_local_phase', '1');
          }
        }
      }
    } catch {
      setGlobalPhase(1);
      const saved = localStorage.getItem('signal_local_phase');
      if (!saved) {
        setLocalViewPhase(1);
      } else {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 1) {
          setLocalViewPhase(1);
          localStorage.setItem('signal_local_phase', '1');
        }
      }
    }
  }, []);

  // ── Fetch approved participants ──
  const fetchParticipants = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('status', 'approved');

      if (data && !error && data.length > 0) {
        setParticipants(data as unknown as Participant[]);
      }
      // else keep mock data
    } catch { /* keep mock */ }
  }, []);

  // ── Fetch match result for Phase 8 ──
  const fetchMatchResult = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('match_results')
        .select('*')
        .eq('participant_id', userId)
        .single();

      if (data && !error) {
        setMatchResult(data as unknown as MatchResult);
      }
    } catch { /* use mock */ }
  }, []);

  // ── On login ──
  const handleLogin = useCallback(async (userData: Participant) => {
    setUser(userData);
    localStorage.setItem('signal_trip_user', JSON.stringify(userData));
    try {
      const { data, error } = await supabase
        .from('trip_sessions')
        .select('current_phase')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data && !error) {
        const gp = data.current_phase;
        if (gp > 1) {
          localStorage.setItem('signal_trip_started', 'true');
          localStorage.setItem('signal_local_phase', String(gp));
        }
      }
    } catch (err) {
      console.error('Failed to Catch-up phase on login:', err);
    }
    fetchSession();
    fetchParticipants();
  }, [fetchSession, fetchParticipants]);

  // ── On logout ──
  const handleLogout = useCallback(() => {
    setUser(null);
    setGlobalPhase(0);
    setLocalViewPhase(0);
    localStorage.removeItem('signal_trip_user');
    localStorage.removeItem('signal_trip_started');
    localStorage.removeItem('signal_vote_first');
    localStorage.removeItem('signal_vote_final');
    localStorage.removeItem('signal_date_step');
    localStorage.removeItem('signal_local_phase');
  }, []);

  // ── Fetch data when user is set ──
  useEffect(() => {
    if (user) {
      fetchSession();
      fetchParticipants();
      fetchMatchResult(user.id);
    }
  }, [user, fetchSession, fetchParticipants, fetchMatchResult]);

  // ── Supabase Realtime subscription for Phase changes ──
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('trip-session-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trip_sessions' },
        (payload) => {
          const newData = payload.new as Record<string, any>;
          if (newData) {
            setSessionData(newData as TripSession);
            const newGlobal = newData.current_phase;
            if (typeof newGlobal === 'number') {
              setGlobalPhase(newGlobal); // 글로벌 상태는 무조건 동기화

              if (newGlobal === 1) {
                localStorage.removeItem('signal_phase2_step');
                localStorage.removeItem('signal_phase2_mission_started');
                localStorage.removeItem('signal_trip_phase2_state');
                localStorage.removeItem('signal_phase2_random_animal');
                localStorage.removeItem('signal_trip_started');
              }

              setLocalViewPhase((prevLocal) => {
                // 관리자가 페이즈를 뒤로 돌린 경우 (Rollback) -> 강제로 참가자 화면도 뒤로 돌림 (Force Sync)
                if (newGlobal < prevLocal) {
                  localStorage.setItem('signal_local_phase', String(newGlobal)); // 스토리지도 함께 업데이트
                  return newGlobal;
                }
                // 그 외의 경우 (전진) -> 기존 화면 유지 (하이브리드 버튼으로 넘어가도록)
                return prevLocal;
              });
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // ── Phase renderer ──
  const renderPhase = () => {
    if (!user) {
      return <Phase0Login key="p0" onLogin={handleLogin} showToast={showToast} />;
    }

    const commonProps = {
      user,
      participants,
      sessionData,
      showToast,
    };

    switch (localViewPhase) {
      case 1:
        return (
          <Phase1Lobby
            key="p1"
            {...commonProps}
            globalPhase={globalPhase}
            onStartTrip={() => {
              localStorage.setItem('signal_trip_started', 'true');
              setLocalViewPhase(2);
              showToast('✨ 여행이 시작되었습니다! 1차 팀 미션으로 이동합니다.');
            }}
          />
        );
      case 2:
        return (
          <Phase2TeamMission
            key="p2"
            {...commonProps}
            globalPhase={globalPhase}
            onStartDinner={() => setLocalViewPhase(3)}
          />
        );
      case 3:
        return (
          <Phase3DinnerMission
            key="p3"
            {...commonProps}
            globalPhase={globalPhase}
            onStartVote={() => setLocalViewPhase(4)}
          />
        );
      case 4:
        return (
          <Phase4FirstVote
            key="p4"
            {...commonProps}
            globalPhase={globalPhase}
            onStartDateMission={() => setLocalViewPhase(5)}
          />
        );
      case 5:
        return (
          <Phase5DateMission
            key="p5"
            {...commonProps}
            globalPhase={globalPhase}
            onStartPhase6={() => setLocalViewPhase(6)}
          />
        );
      case 6:
        return (
          <Phase6FinalTeam
            key="p6"
            {...commonProps}
            globalPhase={globalPhase}
            onStartChoice={() => setLocalViewPhase(7)}
          />
        );
      case 7:
        return (
          <Phase7FinalChoice
            key="p7"
            {...commonProps}
            globalPhase={globalPhase}
            onStartResult={() => setLocalViewPhase(8)}
          />
        );
      case 8:
        return <Phase8Result key="p8" {...commonProps} matchResult={matchResult} />;
      default:
        return (
          <Phase1Lobby
            key="p1-default"
            {...commonProps}
            globalPhase={globalPhase}
            onStartTrip={() => {
              localStorage.setItem('signal_trip_started', 'true');
              setLocalViewPhase(2);
              showToast('✨ 여행이 시작되었습니다! 1차 팀 미션으로 이동합니다.');
            }}
          />
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', position: 'relative', overflow: 'hidden',
      fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'fixed', top: -100, right: -100, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0,199,181,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -80, left: -80, width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(0,199,181,0.04) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Mobile container */}
      <div style={{ maxWidth: 448, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
        {/* Header — only show when logged in */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid #1a1a1a',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700,
                letterSpacing: '0.15em', color: '#00C7B5',
              }}>
                SIGNAL TRIP
              </span>
              <span style={{
                fontSize: 9, padding: '2px 8px', borderRadius: 4,
                background: 'rgba(0,199,181,0.1)', color: '#00C7B5',
                fontWeight: 600, letterSpacing: '0.1em',
              }}>
                PHASE {localViewPhase}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8,
                padding: '6px 14px', fontSize: 11, color: '#78716c', cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00C7B5'; e.currentTarget.style.color = '#00C7B5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#78716c'; }}
            >
              로그아웃
            </button>
          </div>
        )}

        {/* Phase content with animation */}
        <div style={{ padding: '0 20px 40px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`phase-${localViewPhase}-${user?.id ?? 'anon'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {renderPhase()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Toast overlay */}
      <Toast message={toast.message} visible={toast.visible} />

      {/* Timeline FAB */}
      {user && localViewPhase >= 1 && (
        <button
          onClick={() => setIsTimelineOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            padding: '12px 18px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #00C7B5 0%, #00a89a 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0, 199, 181, 0.4)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            zIndex: 9999,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 199, 181, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 199, 181, 0.4)';
          }}
        >
          <Calendar size={18} />
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>타임라인</span>
        </button>
      )}

      {/* Timeline Bottom Sheet */}
      <AnimatePresence>
        {isTimelineOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTimelineOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 99999,
              }}
            />

            {/* Bottom Sheet Card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '75vh',
                background: '#141414',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                zIndex: 100000,
                overflowY: 'auto',
                boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Drag indicator bar */}
              <div style={{
                width: 40,
                height: 4,
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 2,
                margin: '12px auto 8px',
                flexShrink: 0,
              }} />

              {/* Sheet Header */}
              <div style={{
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                flexShrink: 0,
              }}>
                <div style={{ textAlign: 'left' }}>
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#00C7B5',
                    letterSpacing: '0.15em',
                  }}>JOURNEY TIMELINE</span>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#e7e5e4',
                    marginTop: 2,
                  }}>시그널 트립 일정</h3>
                </div>
                <button
                  onClick={() => setIsTimelineOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a8a29e',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Timeline List */}
              <div style={{ padding: '24px 24px 40px', overflowY: 'auto', textAlign: 'left' }}>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                }}>
                  {/* Vertical progress line */}
                  <div style={{
                    position: 'absolute',
                    left: 15,
                    top: 8,
                    bottom: 8,
                    width: 2,
                    background: 'linear-gradient(180deg, #00C7B5 0%, rgba(255, 255, 255, 0.03) 100%)',
                    zIndex: 0,
                  }} />

                  {TIMELINE_DATA.map((item) => {
                    const isPast = item.phase < localViewPhase;
                    const isCurrent = item.phase === localViewPhase;
                    const isFuture = item.phase > localViewPhase;

                    return (
                      <div
                        key={item.phase}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          position: 'relative',
                          zIndex: 1,
                          opacity: isPast ? 0.4 : 1,
                          transition: 'opacity 0.3s',
                        }}
                      >
                        {/* Status node */}
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: isCurrent 
                            ? 'rgba(0, 199, 181, 0.12)' 
                            : isPast 
                              ? 'rgba(0, 199, 181, 0.03)'
                              : 'rgba(255, 255, 255, 0.02)',
                          border: isCurrent
                            ? '2px solid #00C7B5'
                            : isPast
                              ? '1px solid rgba(0, 199, 181, 0.25)'
                              : '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16,
                          flexShrink: 0,
                          boxShadow: isCurrent ? '0 0 12px rgba(0, 199, 181, 0.25)' : 'none',
                        }}>
                          {isPast && <CheckCircle2 size={16} color="#00C7B5" />}
                          {isCurrent && (
                            <motion.div
                              animate={{ scale: [1, 1.25, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#00C7B5',
                              }}
                            />
                          )}
                          {isFuture && <Lock size={12} color="#57534e" />}
                        </div>

                        {/* Details card */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                          }}>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: isCurrent ? '#00C7B5' : '#78716c',
                              fontFamily: "'Outfit', sans-serif",
                            }}>
                              {item.time}
                            </span>
                            
                            {isCurrent && (
                              <span style={{
                                fontSize: 9,
                                fontWeight: 700,
                                padding: '2px 6px',
                                background: 'rgba(0, 199, 181, 0.12)',
                                color: '#00C7B5',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}>
                                <motion.span
                                  animate={{ opacity: [1, 0.3, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.2 }}
                                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#00C7B5', display: 'inline-block' }}
                                />
                                진행 중
                              </span>
                            )}
                          </div>

                          <h4 style={{
                            fontSize: 13,
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? '#e7e5e4' : isPast ? '#a8a29e' : '#57534e',
                            marginTop: 4,
                            filter: isFuture ? 'blur(5px)' : 'none',
                            userSelect: isFuture ? 'none' : 'auto',
                            transition: 'filter 0.3s, color 0.3s',
                          }}>
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
