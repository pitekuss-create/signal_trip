import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Shuffle, 
  Save, 
  Users, 
  Heart, 
  Grid, 
  CheckCircle,
  HelpCircle,
  RefreshCw,
  PlusCircle,
  X
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

interface TripSession {
  id: string;
  current_phase: number;
  team_phase2?: Record<string, string[]>;
  team_phase3?: Record<string, string[]>;
  team_phase6?: Record<string, string[]>;
  date_pairings?: Record<string, string>;
}

interface TeamMixerTabProps {
  showToast: (msg: string) => void;
}

export const TeamMixerTab: React.FC<TeamMixerTabProps> = ({ showToast }) => {
  const [session, setSession] = useState<TripSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [saving, setSaving] = useState(false);

  // Mixer state
  const [targetPhase, setTargetPhase] = useState<2 | 3 | 6>(2);
  const [draftTeamA, setDraftTeamA] = useState<string[]>([]);
  const [draftTeamB, setDraftTeamB] = useState<string[]>([]);

  // Date pairing state (Phase 5)
  const [draftPairings, setDraftPairings] = useState<Record<string, string>>({}); // MaleId -> FemaleId

  // Bot Injection Modal State
  const [showBotModal, setShowBotModal] = useState(false);
  const [botGender, setBotGender] = useState<'MALE' | 'FEMALE'>('MALE');

  // Fetch approved participants and latest session
  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch approved participants with full metadata for display
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('id, name, nickname, gender, photo_urls, age, mbti, job_type, company_name')
        .eq('status', 'approved');

      if (appError) throw appError;
      setParticipants((appData as unknown as Participant[]) || []);

      // 2. Fetch latest session
      const { data: sessionData, error: sessionError } = await supabase
        .from('trip_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (sessionError) throw sessionError;

      if (sessionData && sessionData.length > 0) {
        const activeSession = sessionData[0] as TripSession;
        setSession(activeSession);
        
        // Load existing team assignments if available for targetPhase
        const phaseKey = `team_phase${targetPhase}` as 'team_phase2' | 'team_phase3' | 'team_phase6';
        const existingTeams = activeSession[phaseKey] as { team_a?: string[]; team_b?: string[] } | undefined;
        if (existingTeams?.team_a && existingTeams?.team_b) {
          setDraftTeamA(existingTeams.team_a);
          setDraftTeamB(existingTeams.team_b);
        } else {
          setDraftTeamA([]);
          setDraftTeamB([]);
        }

        // Load existing date pairings
        if (activeSession.date_pairings) {
          setDraftPairings(activeSession.date_pairings);
        } else {
          setDraftPairings({});
        }
      }
    } catch (err: unknown) {
      console.error(err);
      showToast('❌ 데이터를 가져오는데 실패했습니다.');
    }
  }, [targetPhase, showToast]);

  useEffect(() => {
    fetchData();
  }, [targetPhase]);

  // Load existing teams whenever targetPhase changes
  useEffect(() => {
    if (session) {
      const phaseKey = `team_phase${targetPhase}` as 'team_phase2' | 'team_phase3' | 'team_phase6';
      const existingTeams = session[phaseKey] as { team_a?: string[]; team_b?: string[] } | undefined;
      if (existingTeams?.team_a && existingTeams?.team_b) {
        setDraftTeamA(existingTeams.team_a);
        setDraftTeamB(existingTeams.team_b);
      } else {
        setDraftTeamA([]);
        setDraftTeamB([]);
      }
    }
  }, [targetPhase, session]);

  // Team Mixing Logic (2 Males + 2 Females per team)
  const handleMixTeams = () => {
    const males = participants.filter(p => p.gender === 'MALE');
    const females = participants.filter(p => p.gender === 'FEMALE');

    if (males.length < 2 || females.length < 2) {
      showToast('⚠️ 성비 균형(남녀 각각 최소 2명 이상)이 맞는 승인된 참가자가 부족합니다.');
      return;
    }

    const shuffledMales = [...males].sort(() => Math.random() - 0.5);
    const shuffledFemales = [...females].sort(() => Math.random() - 0.5);

    // Calculate mid-points to distribute evenly
    const halfMale = Math.ceil(shuffledMales.length / 2);
    const halfFemale = Math.ceil(shuffledFemales.length / 2);

    const teamA = [
      ...shuffledMales.slice(0, halfMale).map(p => p.id),
      ...shuffledFemales.slice(0, halfFemale).map(p => p.id),
    ];
    
    const teamB = [
      ...shuffledMales.slice(halfMale).map(p => p.id),
      ...shuffledFemales.slice(halfFemale).map(p => p.id),
    ];

    setDraftTeamA(teamA);
    setDraftTeamB(teamB);
    showToast(`🎲 Phase ${targetPhase} 임시 조 배정이 완료되었습니다! 드래그로 조율한 뒤 확정 버튼을 눌러주세요.`);
  };

  // Save Team assignments to Database
  const handleSaveTeams = async () => {
    if (!session) return;
    if (draftTeamA.length === 0 || draftTeamB.length === 0) {
      showToast('⚠️ 배정된 팀 정보가 없습니다. 팀 믹싱을 먼저 진행해 주세요.');
      return;
    }

    setSaving(true);
    try {
      const phaseKey = `team_phase${targetPhase}`;
      const payload = {
        [phaseKey]: {
          team_a: draftTeamA,
          team_b: draftTeamB
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('trip_sessions')
        .update(payload)
        .eq('id', session.id);

      if (error) throw error;

      // Update local session state
      setSession(prev => prev ? { ...prev, ...payload } : null);
      showToast(`💾 Phase ${targetPhase} 조 배정 정보가 DB에 최종 확정 저장되었습니다!`);
    } catch (err: unknown) {
      console.error(err);
      showToast('❌ DB 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // Date Matcher logic (Phase 5)
  const handleAutoDateMix = () => {
    const males = participants.filter(p => p.gender === 'MALE');
    const females = participants.filter(p => p.gender === 'FEMALE');

    if (males.length === 0 || females.length === 0) {
      showToast('⚠️ 매칭할 수 있는 승인된 남/녀 참가자가 부족합니다.');
      return;
    }

    const shuffledMales = [...males].sort(() => Math.random() - 0.5);
    const shuffledFemales = [...females].sort(() => Math.random() - 0.5);

    const pairings: Record<string, string> = {};
    const size = Math.min(shuffledMales.length, shuffledFemales.length);

    for (let i = 0; i < size; i++) {
      const maleId = shuffledMales[i].id;
      const femaleId = shuffledFemales[i].id;
      pairings[maleId] = femaleId;
      pairings[femaleId] = maleId; // Bidirectional
    }

    setDraftPairings(pairings);
    showToast('💘 1:1 심야 데이트 매칭 초안이 구성되었습니다. 드래그로 교체 후 저장해 주세요!');
  };

  // Save date pairings to DB
  const handleSaveDatePairings = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const payload = {
        date_pairings: draftPairings,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('trip_sessions')
        .update(payload)
        .eq('id', session.id);

      if (error) throw error;

      setSession(prev => prev ? { ...prev, ...payload } : null);
      showToast('💾 1:1 데이트 페어링 정보가 DB에 최종 확정 저장되었습니다!');
    } catch (err: unknown) {
      console.error(err);
      showToast('❌ 데이트 페어링 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // Emergency Dummy Bot Injection Logic
  const handleInjectDummyBot = async () => {
    try {
      const randSuffix = Math.floor(100 + Math.random() * 900);
      const nickname = `시그널봇_${botGender === 'MALE' ? '남' : '여'}${randSuffix}`;
      const name = `${botGender === 'MALE' ? '김' : '이'}로봇`;
      
      const dummyApp = {
        name,
        nickname,
        phone: `010-0000-${randSuffix}`,
        age: 28 + Math.floor(Math.random() * 8),
        gender: botGender,
        address: '서울시 강남구',
        mbti: botGender === 'MALE' ? 'ESTP' : 'INFJ',
        ideal_type: '데이터 코드 분석이 잘 통하는 사람',
        bio: 'No-Show 결원 충원을 위해 긴급 주입된 인공지능 시그널봇입니다.',
        photo_urls: [`https://api.dicebear.com/7.x/bottts/svg?seed=Bot-${randSuffix}`],
        sns_link: '@signal_bot',
        job_type: 'freelancer',
        company_name: '시그널 시스템즈',
        verification_file_url: `https://api.dicebear.com/7.x/bottts/svg?seed=Doc-${randSuffix}`,
        preferred_schedules: ['상시'],
        single_pledge: true,
        privacy_pledge: true,
        status: 'approved',
        signal_code: Math.floor(1000 + Math.random() * 9000).toString()
      };

      const { error } = await supabase
        .from('applications')
        .insert(dummyApp);

      if (error) throw error;

      showToast(`🤖 시그널봇(${nickname})이 성공적으로 승인 완료 상태로 주입되었습니다!`);
      setShowBotModal(false);
      fetchData(); // Refetch
    } catch (err) {
      console.error(err);
      showToast('❌ 봇 인젝션 중 오류가 발생했습니다.');
    }
  };

  // HTML5 Drag & Drop Handlers for Teams (Phase 2, 3, 6)
  const handleDragStart = (e: React.DragEvent, id: string, source: 'team_a' | 'team_b' | 'pool') => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id, source }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnTeam = (e: React.DragEvent, targetContainer: 'team_a' | 'team_b' | 'pool') => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const { id, source } = JSON.parse(dataStr);

      if (source === targetContainer) return;

      // Remove from source
      if (source === 'team_a') {
        setDraftTeamA(prev => prev.filter(item => item !== id));
      } else if (source === 'team_b') {
        setDraftTeamB(prev => prev.filter(item => item !== id));
      }

      // Add to target (max limit updated to 4)
      if (targetContainer === 'team_a') {
        if (draftTeamA.length >= 4) return;
        setDraftTeamA(prev => [...prev, id]);
      } else if (targetContainer === 'team_b') {
        if (draftTeamB.length >= 4) return;
        setDraftTeamB(prev => [...prev, id]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDropOnCard = (e: React.DragEvent, targetId: string, targetContainer: 'team_a' | 'team_b' | 'pool') => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const { id: draggedId, source: sourceContainer } = JSON.parse(dataStr);

      if (draggedId === targetId) return;

      // Swapping cards!
      if (sourceContainer === targetContainer) {
        // Rearrange indices
        if (sourceContainer === 'team_a') {
          setDraftTeamA(prev => {
            const idx1 = prev.indexOf(draggedId);
            const idx2 = prev.indexOf(targetId);
            const next = [...prev];
            next[idx1] = targetId;
            next[idx2] = draggedId;
            return next;
          });
        } else if (sourceContainer === 'team_b') {
          setDraftTeamB(prev => {
            const idx1 = prev.indexOf(draggedId);
            const idx2 = prev.indexOf(targetId);
            const next = [...prev];
            next[idx1] = targetId;
            next[idx2] = draggedId;
            return next;
          });
        }
        return;
      }

      // Cross-container Swap
      if (sourceContainer === 'team_a' && targetContainer === 'team_b') {
        setDraftTeamA(prev => prev.map(item => item === draggedId ? targetId : item));
        setDraftTeamB(prev => prev.map(item => item === targetId ? draggedId : item));
      } else if (sourceContainer === 'team_b' && targetContainer === 'team_a') {
        setDraftTeamB(prev => prev.map(item => item === draggedId ? targetId : item));
        setDraftTeamA(prev => prev.map(item => item === targetId ? draggedId : item));
      } else if (sourceContainer === 'pool') {
        if (targetContainer === 'team_a') {
          if (draftTeamA.length < 4) {
            setDraftTeamA(prev => [...prev.filter(item => item !== draggedId), draggedId]);
          } else {
            setDraftTeamA(prev => prev.map(item => item === targetId ? draggedId : item));
          }
        } else if (targetContainer === 'team_b') {
          if (draftTeamB.length < 4) {
            setDraftTeamB(prev => [...prev.filter(item => item !== draggedId), draggedId]);
          } else {
            setDraftTeamB(prev => prev.map(item => item === targetId ? draggedId : item));
          }
        }
      } else if (targetContainer === 'pool') {
        if (sourceContainer === 'team_a') {
          setDraftTeamA(prev => prev.filter(item => item !== draggedId));
        } else if (sourceContainer === 'team_b') {
          setDraftTeamB(prev => prev.filter(item => item !== draggedId));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // HTML5 Drag & Drop handlers for Female cards in 1:1 Date Pairing (Phase 5)
  const handleDragStartFemale = (e: React.DragEvent, femaleId: string, fromMaleId: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ femaleId, fromMaleId, type: 'female_pairing' }));
  };

  const handleDropOnMaleRow = (e: React.DragEvent, targetMaleId: string) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      if (data.type !== 'female_pairing') return;

      const { femaleId, fromMaleId } = data;
      if (fromMaleId === targetMaleId) return;

      // Swap female pairings bidirectional
      setDraftPairings(prev => {
        const next = { ...prev };
        
        const targetFemaleId = next[targetMaleId]; // Female currently paired with target male
        
        if (targetFemaleId) {
          next[fromMaleId] = targetFemaleId;
          next[targetFemaleId] = fromMaleId;
        } else {
          delete next[fromMaleId];
        }
        
        next[targetMaleId] = femaleId;
        next[femaleId] = targetMaleId;

        return next;
      });
      showToast('💘 1:1 데이트 파트너가 즉시 교환되었습니다. 아래 확정 버튼을 클릭해 주세요.');
    } catch (err) {
      console.error(err);
    }
  };

  // UI helpers
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

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case 'professional': return '전문직';
      case 'business_owner': return '사업가';
      case 'office_worker': return '회사원';
      default: return jobType || '일반';
    }
  };

  const unassignedPool = useMemo(() => {
    const assignedIds = new Set([...draftTeamA, ...draftTeamB]);
    return participants.filter(p => !assignedIds.has(p.id));
  }, [participants, draftTeamA, draftTeamB]);

  const males = useMemo(() => participants.filter(p => p.gender === 'MALE'), [participants]);
  const females = useMemo(() => participants.filter(p => p.gender === 'FEMALE'), [participants]);

  return (
    <div className="space-y-8 text-left overflow-x-auto w-full">
      {/* Overview of approved participants */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-stone-300 flex items-center gap-1.5 font-sans">
              <Users size={16} className="text-teal-400" />
              현재 승인 완료된 참가자 리스트 ({participants.length}명)
            </h3>
            <p className="text-xs text-stone-500 font-light">행사 안정성을 위해 남녀 각각 4명씩 총 8명이 승인되어야 합니다.</p>
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* 긴급 더미 참가자 주입 버튼 */}
            <button
              onClick={() => setShowBotModal(true)}
              className="px-5 py-2.5 bg-rose-650 hover:bg-rose-600 border border-rose-500/20 rounded-full text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-500/10"
            >
              <PlusCircle size={14} />
              긴급: 더미 참가자 주입
            </button>

            <button 
              onClick={fetchData}
              className="p-2.5 bg-stone-950 border border-stone-900 hover:bg-stone-900 rounded-full text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
              title="새로고침"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {participants.length === 0 ? (
          <p className="text-sm text-stone-500 font-light">승인된 참가자가 없습니다. CRM 탭에서 먼저 참가를 승인해 주세요.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {participants.map(p => (
              <div key={p.id} className="p-3.5 bg-stone-950 border border-stone-900 rounded-xl flex flex-col items-center text-center gap-1.5 relative overflow-hidden shadow-inner">
                <img 
                  src={p.photo_urls?.[0]} 
                  alt={p.nickname}
                  className="w-12 h-12 rounded-full object-cover border border-stone-850"
                  onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${p.nickname}`; }}
                />
                <div className="min-w-0 w-full">
                  <p className="text-xs font-bold text-stone-200 truncate">{p.name}</p>
                  <p className="text-[10px] text-stone-500 truncate">@{p.nickname}</p>
                </div>
                <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  p.gender === 'MALE' ? 'bg-blue-400 shadow-md shadow-blue-400/20' : 'bg-rose-400 shadow-md shadow-rose-400/20'
                }`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Mixer Layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: 4인 1조 드래그앤드롭 칸반 보드 */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-200 flex items-center gap-2 font-sans">
                <Grid size={18} className="text-teal-400" />
                4인 1조 자동 및 수동 조 배정기 (Kanban Swapper)
              </h3>
              
              {/* Target Phase selector */}
              <div className="flex bg-stone-950 p-1 border border-stone-900 rounded-full shrink-0">
                {([2, 3, 6] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setTargetPhase(p)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      targetPhase === p
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/15'
                        : 'text-stone-550 hover:text-stone-300'
                    }`}
                  >
                    Phase {p}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              [랜덤 조 배정] 버튼으로 5:5 조 구성을 만들고, 성비나 직업 조율을 위해 참가자 카드를 다른 팀 컬럼으로 드래그하거나 다른 카드 위에 떨궈 Swap(맞교환) 하세요.
            </p>

            {/* Action buttons */}
            <div className="flex gap-2.5 pb-2">
              <button
                onClick={handleMixTeams}
                disabled={participants.length < 4}
                className="px-6 py-3 bg-teal-650 hover:bg-teal-600 border border-teal-500 hover:border-teal-400 rounded-full text-sm font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-teal-500/10"
              >
                <Shuffle size={14} />
                랜덤 조 배정
              </button>
              
              <button
                onClick={handleSaveTeams}
                disabled={draftTeamA.length === 0 || saving}
                className="px-6 py-3 bg-stone-950 hover:bg-stone-850 border border-stone-800 rounded-full text-sm font-semibold text-teal-400 hover:text-teal-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Save size={14} />
                배정 결과 DB 확정
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Team A Column Dropzone */}
              <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnTeam(e, 'team_a')}
                className="p-5 bg-stone-950/60 border border-stone-900 rounded-2xl space-y-3.5 min-h-[300px] shadow-inner"
              >
                <div className="flex justify-between items-center pb-2 border-b border-stone-900">
                  <span className="text-sm font-bold text-teal-400 flex items-center gap-1">
                    <Grid size={14} /> A 팀 컬럼
                  </span>
                  <span className="text-xs text-stone-400 font-mono">{draftTeamA.length}명 배정됨</span>
                </div>
                
                <div className="space-y-2">
                  {draftTeamA.map(id => {
                    const p = getParticipantInfo(id);
                    if (!p) return null;
                    return (
                      <div 
                        key={id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, id, 'team_a')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnCard(e, id, 'team_a')}
                        className={`flex items-center justify-between p-3.5 bg-stone-900 border rounded-xl cursor-grab active:cursor-grabbing hover:border-teal-500/40 transition-all duration-200 ${
                          p.gender === 'MALE' ? 'border-blue-500/20' : 'border-rose-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={getParticipantPhoto(id)} 
                            alt={p.nickname} 
                            className="w-8 h-8 rounded-full object-cover border border-stone-850 shrink-0"
                            onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=A`; }}
                          />
                          <div className="min-w-0 text-left">
                            <span className="text-sm font-bold text-stone-200 block truncate">{p.nickname}</span>
                            <span className="text-[11px] text-stone-400 font-mono block mt-0.5">
                              {p.age}세 / {p.mbti} / {getJobTypeLabel(p.job_type)}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 ${
                          p.gender === 'MALE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                        }`}>
                          {p.gender === 'MALE' ? '남' : '여'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Team B Column Dropzone */}
              <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnTeam(e, 'team_b')}
                className="p-5 bg-stone-950/60 border border-stone-900 rounded-2xl space-y-3.5 min-h-[300px] shadow-inner"
              >
                <div className="flex justify-between items-center pb-2 border-b border-stone-900">
                  <span className="text-sm font-bold text-teal-400 flex items-center gap-1">
                    <Grid size={14} /> B 팀 컬럼
                  </span>
                  <span className="text-xs text-stone-400 font-mono">{draftTeamB.length}명 배정됨</span>
                </div>
                
                <div className="space-y-2">
                  {draftTeamB.map(id => {
                    const p = getParticipantInfo(id);
                    if (!p) return null;
                    return (
                      <div 
                        key={id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, id, 'team_b')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnCard(e, id, 'team_b')}
                        className={`flex items-center justify-between p-3.5 bg-stone-900 border rounded-xl cursor-grab active:cursor-grabbing hover:border-teal-500/40 transition-all duration-200 ${
                          p.gender === 'MALE' ? 'border-blue-500/20' : 'border-rose-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={getParticipantPhoto(id)} 
                            alt={p.nickname} 
                            className="w-8 h-8 rounded-full object-cover border border-stone-850 shrink-0"
                            onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=B`; }}
                          />
                          <div className="min-w-0 text-left">
                            <span className="text-sm font-bold text-stone-200 block truncate">{p.nickname}</span>
                            <span className="text-[11px] text-stone-400 font-mono block mt-0.5">
                              {p.age}세 / {p.mbti} / {getJobTypeLabel(p.job_type)}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 ${
                          p.gender === 'MALE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                        }`}>
                          {p.gender === 'MALE' ? '남' : '여'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Unassigned Pool column (if any exists or when starting) */}
            {unassignedPool.length > 0 && (
              <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnTeam(e, 'pool')}
                className="mt-4 p-4.5 bg-stone-950/40 border border-stone-900 rounded-xl space-y-2.5"
              >
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">미배정 풀 (Drag to Assign)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {unassignedPool.map(p => (
                    <div 
                      key={p.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, p.id, 'pool')}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnCard(e, p.id, 'pool')}
                      className={`flex items-center justify-between p-3 bg-stone-900 border rounded-xl cursor-grab hover:border-stone-800 transition-all ${
                        p.gender === 'MALE' ? 'border-blue-500/10' : 'border-rose-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={p.photo_urls?.[0]} alt={p.nickname} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-stone-200 truncate">{p.nickname}</p>
                          <p className="text-[10px] text-stone-500 truncate mt-0.5">{p.age}세/{p.mbti}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 ${
                        p.gender === 'MALE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                      }`}>
                        {p.gender === 'MALE' ? '남' : '여'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Active indicator */}
          {session && (
            <div className="mt-4 p-3.5 bg-stone-950 border border-stone-900 rounded-xl flex items-center gap-2">
              <CheckCircle size={16} className="text-teal-400 shrink-0" />
              <p className="text-xs text-stone-400 font-light">
                DB 상태: Phase {targetPhase} {session[`team_phase${targetPhase}` as 'team_phase2' | 'team_phase3' | 'team_phase6']?.team_a ? (
                  <span className="text-emerald-400 font-bold">배정 완료 (DB에 존재)</span>
                ) : (
                  <span className="text-rose-400 font-bold">미배정 상태</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: 1:1 심야 데이트 매칭 및 여성 카드 드래그 앤 드롭 */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-lg">
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-stone-200 flex items-center gap-2 font-sans">
              <Heart size={18} className="text-rose-400 fill-rose-400/10" />
              Phase 5: 1:1 심야 데이트 페어링 (Draggable Swap)
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              [자동 1:1 페어링]으로 파트너를 무작위로 매칭한 뒤, 우측 **여성 참가자 카드를 드래그**하여 다른 남성의 로우(Dropzone)에 놓으면 파트너가 즉시 상호 스왑됩니다.
            </p>

            {/* Action buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={handleAutoDateMix}
                disabled={males.length === 0 || females.length === 0}
                className="px-6 py-3 bg-rose-650 hover:bg-rose-600 border border-rose-500/25 hover:border-rose-400 rounded-full text-sm font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-500/10"
              >
                <Shuffle size={14} />
                자동 1:1 페어링
              </button>
              
              <button
                onClick={handleSaveDatePairings}
                disabled={Object.keys(draftPairings).length === 0 || saving}
                className="px-6 py-3 bg-stone-950 hover:bg-stone-850 border border-stone-800 rounded-full text-sm font-semibold text-rose-400 hover:text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Save size={14} />
                페어링 DB 확정
              </button>
            </div>

            {/* Draggable Pair Grid */}
            {males.length > 0 ? (
              <div className="space-y-3.5 mt-4 max-h-[350px] overflow-y-auto pr-1">
                {males.map(m => {
                  const femalePartnerId = draftPairings[m.id] || '';
                  const female = getParticipantInfo(femalePartnerId);

                  return (
                    <div 
                      key={m.id} 
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnMaleRow(e, m.id)}
                      className="p-4 bg-stone-950/60 border border-stone-900 rounded-2xl grid grid-cols-1 sm:grid-cols-9 gap-2 items-center hover:border-stone-800/80 transition-colors shadow-sm"
                    >
                      {/* Male (Static Left Side) */}
                      <div className="sm:col-span-4 flex items-center gap-2.5">
                        <img 
                          src={getParticipantPhoto(m.id)} 
                          alt={m.nickname} 
                          className="w-8 h-8 rounded-full object-cover border border-stone-850"
                        />
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-blue-400 truncate">{m.nickname}</p>
                          <p className="text-xs text-stone-400 truncate mt-0.5">
                            {m.age}세 / {m.mbti} / {getJobTypeLabel(m.job_type)}
                          </p>
                        </div>
                      </div>

                      {/* Heart Icon Indicator */}
                      <div className="sm:col-span-1 text-rose-500/30 flex justify-center py-1">
                        <Heart size={16} className={female ? 'text-rose-500 fill-rose-500/20' : ''} />
                      </div>

                      {/* Female Partner (Draggable Right Side) */}
                      <div className="sm:col-span-4">
                        {female ? (
                          <div 
                            draggable
                            onDragStart={(e) => handleDragStartFemale(e, female.id, m.id)}
                            className="flex items-center gap-2.5 p-2 bg-stone-900 border border-rose-500/20 hover:border-rose-500/40 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200"
                          >
                            <img 
                              src={getParticipantPhoto(female.id)} 
                              alt={female.nickname} 
                              className="w-7 h-7 rounded-full object-cover border border-stone-850 shrink-0"
                            />
                            <div className="min-w-0 text-left flex-1">
                              <p className="text-sm font-bold text-rose-400 truncate">{female.nickname}</p>
                              <p className="text-xs text-stone-400 truncate mt-0.5">
                                {female.age}세 / {female.mbti} / {getJobTypeLabel(female.job_type)}
                              </p>
                            </div>
                            <span className="text-[10px] text-stone-500 font-mono shrink-0 select-none">DRAG</span>
                          </div>
                        ) : (
                          <div className="py-3 text-center text-xs text-stone-500 bg-stone-900/40 border border-dashed border-stone-800 rounded-xl">
                            배정되지 않음 (Drop here)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-stone-500 bg-stone-950/40 border border-stone-900 rounded-2xl font-light">
                승인 완료된 남성 지원자가 아직 없습니다.
              </div>
            )}
          </div>

          {/* Active indicator */}
          {session && (
            <div className="mt-4 p-3.5 bg-stone-950 border border-stone-900 rounded-xl flex items-center gap-2">
              <CheckCircle size={16} className="text-rose-400 shrink-0" />
              <p className="text-xs text-stone-400 font-light">
                DB 상태: 데이트 페어링 {session.date_pairings && Object.keys(session.date_pairings).length > 0 ? (
                  <span className="text-emerald-400 font-bold">배정 완료 (DB에 존재)</span>
                ) : (
                  <span className="text-rose-400 font-bold">미배정 상태</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Guide Note */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-6 shadow-md backdrop-blur-sm">
        <h4 className="text-sm font-bold text-stone-300 flex items-center gap-1.5 mb-3 font-sans">
          <HelpCircle size={14} className="text-teal-400" />
          배정 확정 프로세스 안내
        </h4>
        <ul className="text-xs text-stone-500 space-y-2 list-disc pl-4 font-light leading-relaxed">
          <li><strong>조 배정 또는 페어링</strong> 작업 후에 꼭 우측의 <span className="text-stone-300 font-bold">[배정 결과 DB 확정]</span> 또는 <span className="text-stone-300 font-bold">[페어링 DB 확정]</span> 버튼을 눌러야 실제 Supabase 데이터베이스에 저장됩니다.</li>
          <li>수동으로 카드를 교체하여도 바로 DB에 업로드되지 않고, 확정 버튼을 눌렀을 때만 반영되므로 안심하고 조율하셔도 됩니다.</li>
          <li>8명(남4, 여4)의 정보가 완벽히 입력되어 있을 때 가장 아름다운 UX를 제공합니다.</li>
        </ul>
      </div>

      {/* Dummy Bot Injection Modal */}
      {showBotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-stone-900/95 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4 backdrop-blur-md">
            <div className="flex justify-between items-center pb-2 border-b border-stone-850">
              <h4 className="text-base font-extrabold text-stone-200 flex items-center gap-1.5">
                🤖 긴급: 더미 참가자 주입
              </h4>
              <button 
                onClick={() => setShowBotModal(false)}
                className="text-stone-500 hover:text-stone-300 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed font-normal text-left">
              불참 인원(No-Show) 발생 시, 매칭 및 투표 연산이 먹통되는 에러를 방지하기 위해 가상의 AI 로봇 캐릭터를 `status = 'approved'`로 즉시 주입합니다.
            </p>

            <div className="space-y-2.5 text-left">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">주입할 로봇 성별</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
                  <input 
                    type="radio" 
                    name="bot-gender" 
                    checked={botGender === 'MALE'}
                    onChange={() => setBotGender('MALE')}
                    className="accent-teal-500"
                  />
                  남성 로봇 생성
                </label>
                <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
                  <input 
                    type="radio" 
                    name="bot-gender" 
                    checked={botGender === 'FEMALE'}
                    onChange={() => setBotGender('FEMALE')}
                    className="accent-teal-500"
                  />
                  여성 로봇 생성
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                onClick={() => setShowBotModal(false)}
                className="px-5 py-3 bg-stone-850 hover:bg-stone-800 border border-stone-800 rounded-full text-xs font-bold text-stone-300 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleInjectDummyBot}
                className="px-5 py-3 bg-teal-650 hover:bg-teal-600 border border-teal-500 rounded-full text-xs font-bold text-white cursor-pointer shadow-lg shadow-teal-500/10"
              >
                로봇 생성 주입
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
