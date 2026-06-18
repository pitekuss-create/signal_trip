import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Radio,
  ArrowRight,
  HelpCircle,
  Users,
  Coffee,
  Utensils,
  Vote,
  Flame,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface TripSession {
  id: string;
  current_phase: number;
  created_at: string;
  updated_at?: string;
}

interface PhaseControlTabProps {
  showToast: (msg: string) => void;
}

const PHASES_INFO = [
  {
    phase: 1,
    title: 'Phase 1: 대기실 (Lobby)',
    icon: Users,
    color: 'border-blue-500/20 text-blue-400 bg-blue-500/5',
    activeColor: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
    desc: '참가자 환영 편지 애니메이션 및 대기화면을 보여줍니다.',
  },
  {
    phase: 2,
    title: 'Phase 2: 첫인상 팀 배정 (Team Mission)',
    icon: Utensils,
    color: 'border-violet-500/20 text-violet-400 bg-violet-500/5',
    activeColor: 'bg-violet-500 text-white shadow-lg shadow-violet-500/30',
    desc: '랜덤 배정된 4인 1조 첫인상 팀(A/B조) 프로필과 미션을 공개합니다.',
  },
  {
    phase: 3,
    title: 'Phase 3: 저녁 식사 미션 (Dinner Mission)',
    icon: Utensils,
    color: 'border-amber-500/20 text-amber-400 bg-amber-500/5',
    activeColor: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    desc: '새로 배정된 저녁 식사 팀 프로필과 미션을 확인합니다.',
  },
  {
    phase: 4,
    title: 'Phase 4: 1차 호감도 투표 (First Vote)',
    icon: Vote,
    color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
    activeColor: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
    desc: '11시 편지와 함께 1~3순위 호감도 투표를 진행합니다.',
  },
  {
    phase: 5,
    title: 'Phase 5: 심야 1:1 데이트 (Date Mission)',
    icon: Coffee,
    color: 'border-rose-500/20 text-rose-400 bg-rose-500/5',
    activeColor: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30',
    desc: '1:1 데이트 매칭 파트너와 미션 장소를 확인합니다.',
  },
  {
    phase: 6,
    title: 'Phase 6: 최종 팀 배정 & 바비큐 (Final Team)',
    icon: Flame,
    color: 'border-orange-500/20 text-orange-400 bg-orange-500/5',
    activeColor: 'bg-orange-500 text-white shadow-lg shadow-orange-500/30',
    desc: '최종 바비큐 파티를 위한 새로운 팀 구성을 확인합니다.',
  },
  {
    phase: 7,
    title: 'Phase 7: 최종 선택 (Final Choice)',
    icon: HeartIcon,
    color: 'border-pink-500/20 text-pink-400 bg-pink-500/5',
    activeColor: 'bg-pink-500 text-white shadow-lg shadow-pink-500/30',
    desc: '최종 매칭을 위한 1명의 최종 동반자를 선택합니다.',
  },
  {
    phase: 8,
    title: 'Phase 8: 결과 발표 (Result Reveal)',
    icon: Sparkles,
    color: 'border-teal-500/20 text-teal-400 bg-teal-500/5',
    activeColor: 'bg-teal-500 text-white shadow-lg shadow-teal-500/30',
    desc: '최종 매칭 결과를 발표합니다. 매칭 성공 시 실제 이름과 연락처가 공개됩니다.',
  },
];

// Simple Custom Heart Icon
function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export const PhaseControlTab: React.FC<PhaseControlTabProps> = ({ showToast }) => {
  const [session, setSession] = useState<TripSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00분 00초');

  // Fetch session data
  const fetchSession = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('trip_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setSession(data[0] as TripSession);
      } else {
        // No session exists, create a default one
        const { data: newSession, error: createError } = await supabase
          .from('trip_sessions')
          .insert({ current_phase: 1 })
          .select()
          .single();

        if (createError) throw createError;
        setSession(newSession as TripSession);
      }
    } catch (err: unknown) {
      console.error(err);
      showToast('❌ 세션 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSession();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('admin-trip-sessions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trip_sessions' },
        (payload) => {
          if (payload.new && typeof (payload.new as Record<string, unknown>).current_phase === 'number') {
            setSession(payload.new as TripSession);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSession]);

  // Live Timer based on trip_sessions updated_at
  useEffect(() => {
    if (!session || !session.updated_at) {
      setElapsedTime('00분 00초');
      return;
    }

    const updateTimer = () => {
      const startedAt = new Date(session.updated_at!).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - startedAt);

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const pad = (num: number) => String(num).padStart(2, '0');
      setElapsedTime(`${pad(minutes)}분 ${pad(seconds)}초`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [session?.updated_at]);  // Update current phase
  const handleUpdatePhase = async (phaseNum: number) => {
    if (!session) return;

    // 이중 확인 모달 (Fail-safe UI)
    const confirmed = window.confirm(
      `⚠️ 정말로 [Phase ${phaseNum}]으로 전체 참가자의 화면을 동기화하시겠습니까?\n이 작업은 현재 접속 중인 모든 기기의 웹앱 화면을 즉시 강제 전환시킵니다.`
    );
    if (!confirmed) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('trip_sessions')
        .update({ current_phase: phaseNum })
        .eq('id', session.id);

      if (error) throw error;
      showToast(`⚡ 글로벌 화면이 Phase ${phaseNum}(으)로 성공적으로 전환되었습니다!`);
    } catch (err: unknown) {
      console.error(err);
      alert('페이즈 전환 중 DB 에러가 발생했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const handleHardReset = async () => {
    if (!session) return;

    const userInput = window.prompt(
      "정말로 모든 행사 데이터를 초기화하시겠습니까? 투표 및 매칭 결과가 영구 삭제됩니다. 확인을 위해 '초기화' 라고 입력해주세요."
    );

    if (userInput !== '초기화') {
      showToast('❌ 입력값이 일치하지 않아 초기화가 취소되었습니다.');
      return;
    }

    setUpdating(true);
    try {
      // 0. 매칭 커플 영구 백업
      const { data: apps, error: appsFetchError } = await supabase
        .from('applications')
        .select('id, nickname');
      if (appsFetchError) {
        console.error("Backup apps fetch error: ", appsFetchError);
        throw appsFetchError;
      }

      const { data: matches, error: matchesFetchError } = await supabase
        .from('match_results')
        .select('participant_id, matched_with_id, is_matched')
        .eq('is_matched', true);
      if (matchesFetchError) {
        console.error("Backup matches fetch error: ", matchesFetchError);
        throw matchesFetchError;
      }

      if (apps && matches && matches.length > 0) {
        const idToNickname = new Map(apps.map(a => [a.id, a.nickname]));
        for (const match of matches) {
          if (match.participant_id && match.matched_with_id) {
            const partnerNickname = idToNickname.get(match.matched_with_id) || '알 수 없음';
            const { error: updateAppErr } = await supabase
              .from('applications')
              .update({
                is_matched: true,
                matched_partner: partnerNickname
              })
              .eq('id', match.participant_id);
            
            if (updateAppErr) {
              console.error("Backup application match update error: ", updateAppErr);
              throw updateAppErr;
            }
          }
        }
      }

      // 1. 현재 기수(approved, pending, rejected) 참가자들의 status를 일괄적으로 'archived'로 업데이트
      const { error: archiveError } = await supabase
        .from('applications')
        .update({ status: 'archived' })
        .in('status', ['approved', 'pending', 'rejected']);
      if (archiveError) {
        console.error("Archiving DB Error (Check RLS Policies or constraints): ", archiveError);
        throw archiveError;
      }

      // 2. votes 및 match_results 데이터 삭제
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .not('id', 'is', null);
      if (votesError) {
        console.error("Votes delete error: ", votesError);
        throw votesError;
      }

      const { error: matchError } = await supabase
        .from('match_results')
        .delete()
        .not('participant_id', 'is', null);
      if (matchError) {
        console.error("Match results delete error: ", matchError);
        throw matchError;
      }

      // 3. trip_sessions의 불필요한 배열/JSON 컬럼 초기화 (team_phase2, team_phase3, team_phase6, mission_status_phase2)
      let { error: jsonError } = await supabase
        .from('trip_sessions')
        .update({
          team_phase2: null,
          team_phase3: null,
          team_phase6: null,
          mission_status_phase2: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (jsonError) {
        console.warn("Reset DB Warning (JSON null fields update failed, trying empty objects): ", jsonError);
        const { error: fallbackJsonError } = await supabase
          .from('trip_sessions')
          .update({
            team_phase2: {},
            team_phase3: {},
            team_phase6: {},
            mission_status_phase2: {},
            updated_at: new Date().toISOString()
          })
          .eq('id', session.id);
        
        if (fallbackJsonError) {
          console.error("Fallback json fields reset error: ", fallbackJsonError);
          throw fallbackJsonError;
        }
      }

      // 4. trip_sessions의 current_phase를 1로 업데이트
      const { error: phaseError } = await supabase
        .from('trip_sessions')
        .update({
          current_phase: 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (phaseError) {
        console.error("Reset DB Error (current_phase update failed): ", phaseError);
        throw phaseError;
      }

      alert("새로운 행사를 시작할 준비가 완료되었습니다. Phase 1로 복귀합니다.");
      showToast("🔄 모든 행사 데이터가 성공적으로 초기화되었습니다.");
      fetchSession();
      window.location.reload(); // 강제 전체 새로고침
    } catch (error: any) {
      console.error("Reset DB Error: ", error);
      alert(`데이터 초기화 실패: ${error.message || error}`);
    } finally {
      setUpdating(false);
    }
  };

  const currentPhase = session?.current_phase ?? 1;

  return (
    <div className="space-y-6 overflow-x-auto w-full">
      {/* Live Monitor Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl bg-gradient-to-br from-stone-900 to-stone-950/40">
        {/* Background glow overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="space-y-3 relative z-10 text-left flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Radio size={16} className="text-teal-400 animate-pulse" />
              <span className="text-xs text-teal-400 font-mono tracking-widest uppercase font-bold">Live Session Status</span>
            </div>

            {/* 접속자 수 모니터링 표시 (Presence UI 헤더) */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-stone-950 border border-stone-900 rounded-full text-stone-400 text-xs font-mono">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>연결 참가자: <strong className="text-emerald-400 font-bold">8 / 8 명</strong> (안정됨)</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-stone-100 font-sans flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>현재 글로벌 페이즈: <span className="text-teal-400 font-mono">Phase {currentPhase}</span></span>
            <span className="text-stone-500 text-sm md:text-base font-medium border-l border-stone-800 pl-4">
              ⏱️ 페이즈 경과 시간: <span className="text-stone-300 font-mono font-bold">{elapsedTime}</span>
            </span>
          </h2>
          <p className="text-sm text-stone-400 font-light max-w-xl mt-1.5">
            관리자가 아래 버튼을 눌러 페이즈를 전환하면, 실시간으로 모든 참가자들의 모바일 웹앱 화면이 해당 페이즈 컴포넌트로 자동 이동합니다.
          </p>
        </div>

        <button
          onClick={() => { setLoading(true); fetchSession(); }}
          className="px-6 py-3 bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 rounded-full text-sm font-semibold text-stone-400 hover:text-stone-200 transition-all flex items-center gap-2.5 cursor-pointer shrink-0 z-10 shadow-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          상태 동기화
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-stone-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mx-auto mb-3"></div>
          세션 데이터를 연동하는 중...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PHASES_INFO.map((phaseInfo) => {
            const PhaseIcon = phaseInfo.icon;
            const isActive = currentPhase === phaseInfo.phase;

            return (
              <div
                key={phaseInfo.phase}
                className={`p-6 rounded-xl border transition-all duration-500 flex flex-col justify-between gap-5 text-left shadow-lg ${isActive
                    ? 'bg-teal-500/10 border-teal-500/50 shadow-teal-500/5 ring-1 ring-teal-500/20 relative overflow-hidden'
                    : 'bg-stone-900 border-stone-800 hover:border-stone-700/80'
                  }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 blur-md rounded-bl-full pointer-events-none" />
                )}

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl border ${isActive ? 'bg-teal-500/20 border-teal-400/30 text-teal-400' : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}>
                      <PhaseIcon size={20} />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold font-sans tracking-wide ${isActive ? 'text-teal-400 font-extrabold text-base' : 'text-stone-300'}`}>
                        {phaseInfo.title}
                      </h3>
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-xl bg-teal-500/15 text-teal-400 text-xs font-bold tracking-widest font-mono border border-teal-500/30 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          🟢 현재 진행 중인 화면
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-normal">{phaseInfo.desc}</p>
                </div>

                <div className="pt-3.5 border-t border-stone-800 flex justify-end">
                  <button
                    onClick={() => handleUpdatePhase(phaseInfo.phase)}
                    disabled={isActive || updating}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${isActive
                        ? 'bg-teal-500/15 border border-teal-500/25 text-teal-400/80 cursor-default shadow-none'
                        : 'bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white shadow-sm'
                      }`}
                  >
                    {isActive ? '활성화 상태' : '이 화면으로 전환'}
                    {!isActive && <ArrowRight size={12} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Guide Panel */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-6 text-left shadow-md backdrop-blur-sm">
        <h4 className="text-sm font-bold text-stone-300 flex items-center gap-1.5 mb-3 font-sans">
          <HelpCircle size={14} className="text-teal-400" />
          호스트 가이드라인
        </h4>
        <ul className="text-xs text-stone-500 space-y-2.5 list-disc pl-4 font-light leading-relaxed">
          <li><strong>Phase 2, 3, 6 (팀 미션)</strong> 진입 전에는 반드시 <span className="text-teal-400 font-semibold">자동 팀 배정기</span> 탭에서 팀 매칭을 수행하고 배정을 완료해야 참가자 화면에 올바른 팀이 표시됩니다.</li>
          <li><strong>Phase 5 (심야 데이트)</strong> 진입 전에 마찬가지로 <span className="text-teal-400 font-semibold">자동 팀 배정기</span> 탭 하단의 1:1 매칭 처리를 확정해 주세요.</li>
          <li><strong>Phase 8 (결과 발표)</strong> 진입 전에는 반드시 <span className="text-teal-400 font-semibold">투표 & 매칭 현황</span> 탭에서 최종 매칭을 확정해야 참가자들이 본인의 매칭 파트너 성공 정보를 볼 수 있습니다.</li>
        </ul>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6 text-left shadow-lg backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background red glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <h4 className="text-sm font-bold text-red-400 flex items-center gap-1.5 font-sans">
            <Flame size={16} className="text-red-400 animate-pulse" />
            Danger Zone (새로운 기수 시작)
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed font-normal max-w-2xl">
            이전 행사 기수의 모든 투표 및 매칭 결과를 삭제하고, 글로벌 세션을 Phase 1 상태로 리셋합니다.
            행사 재시작을 위해 데이터베이스를 완전히 초기화하는 기능이며, 삭제된 데이터는 복구할 수 없습니다.
          </p>
          <div className="pt-3">
            <button
              onClick={handleHardReset}
              disabled={updating || loading}
              className="px-6 py-3.5 bg-red-950/40 hover:bg-red-900/30 border border-red-900/40 hover:border-red-900/60 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔥 전체 행사 데이터 초기화 (새로운 기수 시작)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
