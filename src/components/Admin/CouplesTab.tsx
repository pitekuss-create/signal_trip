import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import type { Participant, MatchResult } from '../WebApp/mockData';
import { Heart, Save, RefreshCw, Layers, Compass, Clock, MapPin } from 'lucide-react';

interface CouplesTabProps {
  showToast: (message: string) => void;
}

interface CouplePair {
  partnerA: Participant;
  partnerB: Participant;
  matchA: MatchResult;
  matchB: MatchResult;
}

export const CouplesTab: React.FC<CouplesTabProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [pairs, setPairs] = useState<CouplePair[]>([]);
  const [formData, setFormData] = useState<Record<string, {
    meetingTime: string;
    meetingPlace: string;
    partnerAHint: string;
    partnerBHint: string;
    actionHint: string;
    currentStepA: number;
    currentStepB: number;
  }>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch approved participants
      const { data: apps, error: appsErr } = await supabase
        .from('applications')
        .select('*')
        .eq('status', 'approved');

      if (appsErr) throw appsErr;

      // 2. Fetch match results
      const { data: matches, error: matchesErr } = await supabase
        .from('match_results')
        .select('*');

      if (matchesErr) throw matchesErr;

      // 3. Pair matched couples
      const matchedPairs: CouplePair[] = [];
      const seen = new Set<string>();

      (matches || []).forEach((m: any) => {
        if (m.is_matched && m.matched_with_id) {
          const id1 = m.participant_id;
          const id2 = m.matched_with_id;
          const pairKey = [id1, id2].sort().join('-');

          if (!seen.has(pairKey)) {
            seen.add(pairKey);
            const partnerA = (apps || []).find((p: any) => p.id === id1);
            const partnerB = (apps || []).find((p: any) => p.id === id2);
            const matchA = m as MatchResult;
            const matchB = (matches || []).find((x: any) => x.participant_id === id2) as MatchResult;

            if (partnerA && partnerB && matchA && matchB) {
              matchedPairs.push({ partnerA, partnerB, matchA, matchB });
            }
          }
        }
      });

      setPairs(matchedPairs);

      // Initialize form values
      const initialForm: typeof formData = {};
      matchedPairs.forEach((pair) => {
        const key = `${pair.partnerA.id}-${pair.partnerB.id}`;
        initialForm[key] = {
          meetingTime: pair.matchA.meeting_time || '',
          meetingPlace: pair.matchA.meeting_place || '',
          partnerAHint: pair.matchA.partner_hint || '',
          partnerBHint: pair.matchB.partner_hint || '',
          actionHint: pair.matchA.action_hint || '',
          currentStepA: pair.matchA.current_step || 1,
          currentStepB: pair.matchB.current_step || 1,
        };
      });
      setFormData(initialForm);

    } catch (err: any) {
      console.error(err);
      showToast(`❌ 데이터를 불러오는 도중 오류가 발생했습니다: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (
    pairKey: string,
    field: keyof typeof formData[string],
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [pairKey]: {
        ...prev[pairKey],
        [field]: value,
      },
    }));
  };

  const handleSavePair = async (pair: CouplePair) => {
    const key = `${pair.partnerA.id}-${pair.partnerB.id}`;
    const values = formData[key];
    if (!values) return;

    setLoading(true);
    try {
      // Update partner A match_result
      const { error: errA } = await supabase
        .from('match_results')
        .upsert({
          participant_id: pair.partnerA.id,
          matched_with_id: pair.partnerB.id,
          is_matched: true,
          meeting_time: values.meetingTime,
          meeting_place: values.meetingPlace,
          partner_hint: values.partnerAHint,
          action_hint: values.actionHint,
          current_step: values.currentStepA,
        }, { onConflict: 'participant_id' });

      if (errA) throw errA;

      // Update partner B match_result
      const { error: errB } = await supabase
        .from('match_results')
        .upsert({
          participant_id: pair.partnerB.id,
          matched_with_id: pair.partnerA.id,
          is_matched: true,
          meeting_time: values.meetingTime,
          meeting_place: values.meetingPlace,
          partner_hint: values.partnerBHint,
          action_hint: values.actionHint,
          current_step: values.currentStepB,
        }, { onConflict: 'participant_id' });

      if (errB) throw errB;

      showToast(`💖 ${pair.partnerA.nickname} & ${pair.partnerB.nickname} 커플 설정이 저장되었습니다.`);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`❌ 저장 오류: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-sans text-stone-100 flex items-center gap-2">
          <Heart className="text-rose-500 fill-rose-500/20" size={20} />
          매칭 커플 미션 & 진행 제어 (총 {pairs.length}커플)
        </h3>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 border border-stone-850 hover:bg-stone-800 text-stone-300 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          새로고침
        </button>
      </div>

      {pairs.length === 0 ? (
        <div className="bg-stone-900/40 border border-stone-900 rounded-2xl p-12 text-center text-stone-500">
          <Heart size={40} className="mx-auto mb-3 text-stone-700" />
          <p className="text-sm font-medium">현재 매칭 완료된 커플이 존재하지 않습니다.</p>
          <p className="text-xs text-stone-600 mt-1">자동 매칭 배정기나 투표 결과 탭에서 매칭 확정을 진행해 주세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {pairs.map((pair) => {
            const key = `${pair.partnerA.id}-${pair.partnerB.id}`;
            const values = formData[key] || {
              meetingTime: '',
              meetingPlace: '',
              partnerAHint: '',
              partnerBHint: '',
              actionHint: '',
              currentStepA: 1,
              currentStepB: 1,
            };

            return (
              <div
                key={key}
                className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* 커플 카드 헤더 */}
                <div className="bg-stone-950 px-6 py-4.5 border-b border-stone-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#00C7B5]/10 border border-[#00C7B5]/30 flex items-center justify-center text-xs font-extrabold text-[#00C7B5]">
                        {pair.partnerA.gender === 'MALE' ? ' 남 ' : ' 여 '}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-xs font-extrabold text-rose-400">
                        {pair.partnerB.gender === 'MALE' ? ' 남 ' : ' 여 '}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-200">
                        {pair.partnerA.name}({pair.partnerA.nickname}) 🤍 {pair.partnerB.name}({pair.partnerB.nickname})
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        취향 일치 커플 개별 맞춤 미션 설정
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSavePair(pair)}
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer transition-all duration-300 disabled:opacity-50 shadow-md shadow-teal-500/10"
                  >
                    <Save size={14} />
                    이 커플 설정 저장
                  </button>
                </div>

                {/* 커플 정보 입력 폼 */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 만남 약속 정보 (공통) */}
                  <div className="space-y-4">
                    <h5 className="text-xs uppercase font-extrabold tracking-widest text-[#00C7B5] flex items-center gap-1.5 mb-1">
                      <Compass size={14} /> 만남 약속 & 행동 요령 (공통)
                    </h5>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-stone-400">만남 시간 (`meeting_time`)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-600">
                          <Clock size={14} />
                        </span>
                        <input
                          type="text"
                          placeholder="예) Day 3 14:00 (또는 오후 3시 정각)"
                          value={values.meetingTime}
                          onChange={(e) => handleInputChange(key, 'meetingTime', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-teal-500/80"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-stone-400">만남 장소 (`meeting_place`)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-600">
                          <MapPin size={14} />
                        </span>
                        <input
                          type="text"
                          placeholder="예) 본태박물관 물의 정원"
                          value={values.meetingPlace}
                          onChange={(e) => handleInputChange(key, 'meetingPlace', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-teal-500/80"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-stone-400">행동 힌트 및 행동 요령 (`action_hint`)</label>
                      <textarea
                        rows={3}
                        placeholder="예) 오후 3시 30분 쿠사마 야요이의 무한거울방 작품 앞이 함께 작품을 감상하기에 가장 좋은 타이밍입니다."
                        value={values.actionHint}
                        onChange={(e) => handleInputChange(key, 'actionHint', e.target.value)}
                        className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-teal-500/80 resize-none"
                      />
                    </div>
                  </div>

                  {/* 상대방 개별 식별 힌트 및 진행 단계 제어 */}
                  <div className="space-y-5">
                    <h5 className="text-xs uppercase font-extrabold tracking-widest text-rose-400 flex items-center gap-1.5 mb-1">
                      <Layers size={14} /> 개별 메이트 힌트 & 단계 제어
                    </h5>

                    {/* Partner A (왼쪽 참가자) 설정 */}
                    <div className="bg-stone-950 p-4 border border-stone-850 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                        <span className="text-xs font-bold text-stone-300">
                          {pair.partnerA.nickname} ({pair.partnerA.name})
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-mono uppercase font-bold">
                          메이트 A
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-stone-500 font-bold">상대 식별 힌트 (`partner_hint` - A가 보는 B 힌트)</label>
                        <input
                          type="text"
                          placeholder="예) 파란 머플러를 두르고 박물관 팜플렛을 반으로 접어 쥔 사람"
                          value={values.partnerAHint}
                          onChange={(e) => handleInputChange(key, 'partnerAHint', e.target.value)}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-stone-850 rounded-lg text-xs text-stone-300 placeholder-stone-700 focus:outline-none focus:border-rose-400/80"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-stone-500 font-bold">진행 스텝 (`current_step`)</label>
                        <select
                          value={values.currentStepA}
                          onChange={(e) => handleInputChange(key, 'currentStepA', parseInt(e.target.value))}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-stone-850 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-rose-400/80 cursor-pointer"
                        >
                          <option value={1}>Step 1. 매칭 확인 및 입금 유도 (티저 블러)</option>
                          <option value={2}>Step 2. D-3 미션 편지 해제 (약속 장소 공개)</option>
                          <option value={3}>Step 3. D-Day 장소 도착 (행동 지령 노출)</option>
                          <option value={4}>Step 4. 보물찾기 성공 (블러 완전 해제/프로필 공개)</option>
                        </select>
                      </div>
                    </div>

                    {/* Partner B (오른쪽 참가자) 설정 */}
                    <div className="bg-stone-950 p-4 border border-stone-850 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                        <span className="text-xs font-bold text-stone-300">
                          {pair.partnerB.nickname} ({pair.partnerB.name})
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono uppercase font-bold">
                          메이트 B
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-stone-500 font-bold">상대 식별 힌트 (`partner_hint` - B가 보는 A 힌트)</label>
                        <input
                          type="text"
                          placeholder="예) 베이지색 자켓을 입고 박물관 팜플렛을 오른손에 쥔 사람"
                          value={values.partnerBHint}
                          onChange={(e) => handleInputChange(key, 'partnerBHint', e.target.value)}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-stone-850 rounded-lg text-xs text-stone-300 placeholder-stone-700 focus:outline-none focus:border-rose-400/80"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-stone-500 font-bold">진행 스텝 (`current_step`)</label>
                        <select
                          value={values.currentStepB}
                          onChange={(e) => handleInputChange(key, 'currentStepB', parseInt(e.target.value))}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-stone-850 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-rose-400/80 cursor-pointer"
                        >
                          <option value={1}>Step 1. 매칭 확인 및 입금 유도 (티저 블러)</option>
                          <option value={2}>Step 2. D-3 미션 편지 해제 (약속 장소 공개)</option>
                          <option value={3}>Step 3. D-Day 장소 도착 (행동 지령 노출)</option>
                          <option value={4}>Step 4. 보물찾기 성공 (블러 완전 해제/프로필 공개)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
