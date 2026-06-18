import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Heart, 
  HelpCircle, 
  RefreshCw, 
  Vote 
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  photo_urls: string[];
  age: number;
  mbti: string;
  job_type: string;
  company_name: string;
}

interface VoteRecord {
  id: string;
  voter_id: string;
  round: 'first' | 'final';
  pick_1st: string;
  pick_2nd?: string | null;
  pick_3rd?: string | null;
  created_at: string;
}

interface MatchRecord {
  participant_id: string;
  matched_with_id: string | null;
  is_matched: boolean;
}

interface VoteViewerTabProps {
  showToast: (msg: string) => void;
}

export const VoteViewerTab: React.FC<VoteViewerTabProps> = ({ showToast }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [dbMatches, setDbMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeRound, setActiveRound] = useState<'first' | 'final'>('first');

  // Ref and State for SVG node coordinate calculations
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [coords, setCoords] = useState<Record<string, { x: number; y: number; w: number; h: number }>>({});

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch approved participants with full metadata
      const { data: pData, error: pError } = await supabase
        .from('applications')
        .select('id, name, nickname, gender, photo_urls, age, mbti, job_type, company_name')
        .eq('status', 'approved');

      if (pError) throw pError;
      setParticipants((pData as unknown as Participant[]) || []);

      // 2. Fetch all votes
      const { data: vData, error: vError } = await supabase
        .from('votes')
        .select('*')
        .order('created_at', { ascending: false });

      if (vError) throw vError;
      setVotes((vData as VoteRecord[]) || []);

      // 3. Fetch match results
      const { data: mData, error: mError } = await supabase
        .from('match_results')
        .select('participant_id, matched_with_id, is_matched');

      if (mError) throw mError;
      setDbMatches((mData as MatchRecord[]) || []);

    } catch (err: unknown) {
      console.error(err);
      showToast('❌ 투표/매칭 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, []);

  // Update SVG node coordinates dynamically
  const updateCoords = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newCoords: Record<string, { x: number; y: number; w: number; h: number }> = {};
    
    for (const [id, el] of Object.entries(nodeRefs.current)) {
      if (el) {
        const rect = el.getBoundingClientRect();
        newCoords[id] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          w: rect.width,
          h: rect.height,
        };
      }
    }
    setCoords(newCoords);
  }, []);

  useEffect(() => {
    updateCoords();
    window.addEventListener('resize', updateCoords);
    const timer = setTimeout(updateCoords, 300); // Wait for components to paint
    return () => {
      window.removeEventListener('resize', updateCoords);
      clearTimeout(timer);
    };
  }, [participants, votes, activeRound, updateCoords]);

  // Filter votes based on activeRound
  const filteredVotes = useMemo(() => {
    return votes.filter(v => v.round === activeRound);
  }, [votes, activeRound]);

  // Map participant properties for quick access
  const participantsMap = useMemo(() => {
    return new Map(participants.map(p => [p.id, p]));
  }, [participants]);

  const getParticipantInfo = (id: string) => {
    return participantsMap.get(id) || null;
  };

  const getParticipantPhoto = (id: string) => {
    const p = getParticipantInfo(id);
    if (p && p.photo_urls && p.photo_urls.length > 0) return p.photo_urls[0];
    return `https://api.dicebear.com/7.x/initials/svg?seed=${p ? p.nickname : 'Unknown'}`;
  };


  // Identify mutual matches in the final round
  const finalMatches = useMemo(() => {
    const finalRoundVotes = votes.filter(v => v.round === 'final');
    
    // voterId -> pick1st
    const picksMap = new Map<string, string>();
    finalRoundVotes.forEach(v => {
      picksMap.set(v.voter_id, v.pick_1st);
    });

    const matches: Record<string, string> = {}; // id1 -> id2 (bidirectional representation)
    const matchedPairs: Array<[string, string]> = [];
    const processed = new Set<string>();

    participants.forEach(p => {
      const myPick = picksMap.get(p.id);
      if (myPick && picksMap.get(myPick) === p.id) {
        // Mutual Match!
        matches[p.id] = myPick;
        if (!processed.has(p.id) && !processed.has(myPick)) {
          matchedPairs.push([p.id, myPick]);
          processed.add(p.id);
          processed.add(myPick);
        }
      }
    });

    return { matches, matchedPairs };
  }, [votes, participants]);

  // Save final match results to Supabase (match_results table)
  const handleConfirmMatchResults = async () => {
    if (participants.length === 0) return;
    setSaving(true);

    try {
      const { matches } = finalMatches;
      const matchRecords = participants.map(p => {
        const partnerId = matches[p.id];
        return {
          participant_id: p.id,
          matched_with_id: partnerId || null,
          is_matched: !!partnerId,
          created_at: new Date().toISOString()
        };
      });

      const { error } = await supabase
        .from('match_results')
        .upsert(matchRecords, { onConflict: 'participant_id' });

      if (error) throw error;

      setDbMatches(matchRecords);
      showToast('💖 최종 매칭 결과가 성공적으로 저장 및 확정되었습니다!');
    } catch (err: unknown) {
      console.error(err);
      showToast('❌ 매칭 결과 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };



  const males = useMemo(() => participants.filter(p => p.gender === 'MALE'), [participants]);
  const females = useMemo(() => participants.filter(p => p.gender === 'FEMALE'), [participants]);

  return (
    <div className="space-y-6 text-left overflow-x-auto w-full">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
        <div className="flex bg-stone-950 p-1.5 border border-stone-900 rounded-full shrink-0">
          {(['first', 'final'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRound(r)}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                activeRound === r
                  ? 'bg-teal-500/10 text-teal-400 font-bold'
                  : 'text-stone-400 hover:text-stone-250'
              }`}
            >
              {r === 'first' ? '1차 호감도 투표 (Phase 4)' : '최종 동반자 선택 (Phase 7)'}
            </button>
          ))}
        </div>
        <button
          onClick={fetchData}
          className="px-6 py-3 bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 rounded-full text-sm font-bold text-stone-300 hover:text-stone-100 transition-all flex items-center gap-2.5 cursor-pointer shadow-sm"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          투표 실시간 동기화
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm md:text-base text-stone-400 font-medium">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          투표 집계 및 매칭 결과 연동 중...
        </div>
      ) : (
        <div className="space-y-8">
          {activeRound === 'first' && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="space-y-1.5 text-left">
                <h3 className="text-lg md:text-xl font-extrabold text-stone-200 flex items-center gap-2.5 font-sans">
                  <Vote size={20} className="text-teal-400" />
                  1차 호감도 지목 리스트 ({filteredVotes.length}명 제출)
                </h3>
                <p className="text-xs md:text-sm text-stone-400 font-normal">
                  참가자들이 Phase 4에서 비밀리에 제출한 순위별 지목 리스트 데이터 테이블입니다.
                </p>
              </div>
              <div className="overflow-x-auto border border-stone-800 rounded-2xl shadow-inner bg-stone-900/50">
                <table className="w-full text-left border-collapse text-sm md:text-base bg-stone-900">
                  <thead>
                    <tr className="bg-stone-800/50">
                      <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">지목한 참가자</th>
                      <th className="py-5 px-6 text-base text-teal-300 font-bold tracking-wide border-b border-stone-800">1순위</th>
                      <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">2순위</th>
                      <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">3순위</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850">
                    {filteredVotes.map((vote) => {
                      const voter = getParticipantInfo(vote.voter_id);
                      if (!voter) return null;
                      return (
                        <tr key={vote.id} className="hover:bg-stone-800/80 transition-colors">
                          <td className="py-5 px-6 font-extrabold text-stone-100 text-base">{voter.name}</td>
                          <td className="py-5 px-6 text-teal-300 font-extrabold text-base">{vote.pick_1st ? getParticipantInfo(vote.pick_1st)?.nickname : '-'}</td>
                          <td className="py-5 px-6 text-stone-200 font-semibold">{vote.pick_2nd ? getParticipantInfo(vote.pick_2nd)?.nickname : '-'}</td>
                          <td className="py-5 px-6 text-stone-400 font-medium">{vote.pick_3rd ? getParticipantInfo(vote.pick_3rd)?.nickname : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeRound === 'final' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-lg">
                <h3 className="text-lg md:text-xl font-extrabold text-stone-200 flex items-center gap-2.5">
                  <Heart size={20} className="text-pink-500" />
                  최종 매칭 시각화
                </h3>
                <div ref={containerRef} className="relative bg-stone-950 border border-stone-900 rounded-2xl p-8 min-h-[480px] flex justify-between items-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {filteredVotes.map(vote => {
                      const p1 = coords[vote.voter_id];
                      const p2 = coords[vote.pick_1st];
                      if (!p1 || !p2) return null;
                      const isMutual = finalMatches.matches[vote.voter_id] === vote.pick_1st;
                      return (
                        <line key={vote.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isMutual ? "#ec4899" : "#4b5563"} strokeWidth={isMutual ? 4 : 1.5} />
                      );
                    })}
                  </svg>
                  <div className="flex flex-col gap-6 w-64 z-10">
                    {males.map(m => (
                      <div 
                        key={m.id} 
                        ref={el => { nodeRefs.current[m.id] = el; }} 
                        className="p-4 bg-stone-900 border border-blue-500/20 rounded-xl flex items-center gap-3 shadow-md hover:border-blue-500/40 transition-colors"
                      >
                        <img 
                          src={getParticipantPhoto(m.id)} 
                          alt={m.nickname} 
                          className="w-8 h-8 rounded-full object-cover border border-stone-850 shrink-0"
                          onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${m.nickname}`; }}
                        />
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-blue-400 truncate">{m.nickname}</p>
                          <p className="text-xs font-semibold text-stone-400 truncate">{m.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-6 w-64 z-10">
                    {females.map(f => (
                      <div 
                        key={f.id} 
                        ref={el => { nodeRefs.current[f.id] = el; }} 
                        className="p-4 bg-stone-900 border border-rose-500/20 rounded-xl flex items-center gap-3 shadow-md hover:border-rose-500/40 transition-colors"
                      >
                        <img 
                          src={getParticipantPhoto(f.id)} 
                          alt={f.nickname} 
                          className="w-8 h-8 rounded-full object-cover border border-stone-850 shrink-0"
                          onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${f.nickname}`; }}
                        />
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-rose-400 truncate">{f.nickname}</p>
                          <p className="text-xs font-semibold text-stone-400 truncate">{f.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-4">
                    <h3 className="text-base md:text-lg font-extrabold text-stone-200">최종 매칭 집계 결과</h3>
                    <span className="text-xs text-stone-400 font-mono font-bold bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800 font-sans">DB에 {dbMatches.filter(m => m.is_matched).length}개 매칭 저장됨</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    최종 선택 Phase 7 투표 집계가 완료되면, 해당 결과를 DB에 동기화하고 확정합니다.
                  </p>
                </div>
                <button
                  onClick={handleConfirmMatchResults}
                  disabled={saving}
                  className="w-full py-4 bg-pink-600 rounded-full text-sm font-extrabold text-white hover:bg-pink-500 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
                >
                  {saving ? '매칭 결과 저장 중...' : '최종 매칭 결과 DB 확정하기'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-6 backdrop-blur-sm">
        <h4 className="text-sm font-bold text-stone-200 flex items-center gap-1.5 mb-3 font-sans">
          <HelpCircle size={16} className="text-teal-400" />
          투표 진행 및 매칭 가이드라인
        </h4>
        <ul className="text-xs md:text-sm text-stone-400 space-y-2 list-disc pl-4 font-normal leading-relaxed">
          <li><strong>1차 투표 결과</strong>는 참가자들이 Phase 4에서 입력한 순위별 목록이 표 형식으로 제공되며, 운영진의 방송 흐름 조율 참고용으로 활용됩니다.</li>
          <li><strong>최종 매칭 확정</strong> 작업은 Phase 8 결과 발표 화면으로 넘어가기 전, 관리자가 <span className="text-stone-200 font-bold">[최종 매칭 결과 DB 확정하기]</span> 버튼을 반드시 클릭하여 `match_results` 테이블을 업로드해야 유저 단에 적용됩니다.</li>
          <li>DB에 확정되지 않고 Phase 8로 페이즈를 전환할 경우 참가자는 매칭 실패 메세지 또는 무한 로딩 상태를 보게 되므로 주의하세요.</li>
        </ul>
      </div>

    </div>
  );
};
