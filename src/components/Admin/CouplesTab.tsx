import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import type { Participant, MatchResult } from '../WebApp/mockData';
import {
  Heart,
  Save,
  RefreshCw,
  Layers,
  Compass,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

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
    step4PopupMsg: string;
    diningName: string;
    diningCourse: string;
    diningAddress: string;
  }>>({});

  const [previewTabs, setPreviewTabs] = useState<Record<string, 'step2' | 'step3'>>({});
  const [previewUserSelector, setPreviewUserSelector] = useState<Record<string, 'A' | 'B'>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: apps, error: appsErr } = await supabase
        .from('applications')
        .select('*')
        .eq('status', 'approved');

      if (appsErr) throw appsErr;

      const { data: matches, error: matchesErr } = await supabase
        .from('match_results')
        .select('*');

      if (matchesErr) throw matchesErr;

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
          step4PopupMsg: pair.matchA.step4_popup_msg || '',
          diningName: pair.matchA.dining_name || '',
          diningCourse: pair.matchA.dining_course || '',
          diningAddress: pair.matchA.dining_address || '',
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
          step4_popup_msg: values.step4PopupMsg,
          dining_name: values.diningName,
          dining_course: values.diningCourse,
          dining_address: values.diningAddress,
        }, { onConflict: 'participant_id' });

      if (errA) throw errA;

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
          step4_popup_msg: values.step4PopupMsg,
          dining_name: values.diningName,
          dining_course: values.diningCourse,
          dining_address: values.diningAddress,
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
          1:1 매칭 커플 티타임 관리 (총 {pairs.length}커플)
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
              step4PopupMsg: '',
              diningName: '',
              diningCourse: '',
              diningAddress: '',
            };

            return (
              <div
                key={key}
                className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden shadow-xl"
              >
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
                      <p className="text-[10px] text-stone-500 mt-0.5">취향 일치 커플 개별 맞춤 미션 설정</p>
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

                {/* 커플 정보 입력 및 미리보기 (Split View) */}
                <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-8">

                  {/* ── 좌측: 직관적인 스텝별 입력 폼 구성 (col-span-7) ── */}
                  <div className="xl:col-span-7 space-y-6">

                    {/* Step 1. 매칭 상태 & 진행 단계 제어 */}
                    <div className="bg-stone-950 p-4.5 border border-stone-850 rounded-xl space-y-4">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-widest text-teal-400 flex items-center gap-1.5 border-b border-stone-900 pb-2.5">
                        <Layers size={13} /> Step 1. 매칭 상태 & 진행 단계 제어
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Partner A 단계 설정 */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-300">
                              {pair.partnerA.nickname} ({pair.partnerA.name})
                            </span>
                            <span className="text-[9px] font-bold text-teal-400 px-1.5 py-0.5 rounded bg-teal-500/5 border border-teal-500/10">
                              메이트 A ({pair.partnerA.gender === 'MALE' ? '남' : '여'})
                            </span>
                          </div>
                          <select
                            value={values.currentStepA}
                            onChange={(e) => handleInputChange(key, 'currentStepA', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-teal-500/80 cursor-pointer"
                          >
                            <option value={1}>Step 1. 매칭 확인 및 입금 유도 (티저 블러)</option>
                            <option value={2}>Step 2. D-3 미션 편지 해제 (약속 장소 공개)</option>
                            <option value={3}>Step 3. D-Day 장소 도착 (행동 지령 노출)</option>
                            <option value={4}>Step 4. 보물찾기 성공 (블러 완전 해제/프로필 공개)</option>
                          </select>
                        </div>

                        {/* Partner B 단계 설정 */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-300">
                              {pair.partnerB.nickname} ({pair.partnerB.name})
                            </span>
                            <span className="text-[9px] font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/5 border border-rose-500/10">
                              메이트 B ({pair.partnerB.gender === 'MALE' ? '남' : '여'})
                            </span>
                          </div>
                          <select
                            value={values.currentStepB}
                            onChange={(e) => handleInputChange(key, 'currentStepB', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-teal-500/80 cursor-pointer"
                          >
                            <option value={1}>Step 1. 매칭 확인 및 입금 유도 (티저 블러)</option>
                            <option value={2}>Step 2. D-3 미션 편지 해제 (약속 장소 공개)</option>
                            <option value={3}>Step 3. D-Day 장소 도착 (행동 지령 노출)</option>
                            <option value={4}>Step 4. 보물찾기 성공 (블러 완전 해제/프로필 공개)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Step 2. D-3 프라이빗 공간 안내 */}
                    <div className="bg-stone-950 p-4.5 border border-stone-850 rounded-xl space-y-4">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-widest text-[#00C7B5] flex items-center gap-1.5 border-b border-stone-900 pb-2.5">
                        <Compass size={13} /> STEP 2. D-3 프라이빗 공간 안내
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-stone-400">만남 일정 및 시간 (`meeting_time`)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-600">
                              <Clock size={13} />
                            </span>
                            <input
                              type="text"
                              placeholder="예) 7월 4일 (토) 오후 2시"
                              value={values.meetingTime}
                              onChange={(e) => handleInputChange(key, 'meetingTime', e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-teal-500/80"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-stone-400">만남 장소 (`meeting_place`)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-600">
                              <MapPin size={13} />
                            </span>
                            <input
                              type="text"
                              placeholder="예) 제주 애월 아쿠아 디너"
                              value={values.meetingPlace}
                              onChange={(e) => handleInputChange(key, 'meetingPlace', e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-teal-500/80"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-900/50 pt-3">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-stone-400">
                            A ({pair.partnerA.nickname})가 볼 B의 착장 시그널 ('partner_hint' - 당일 유저가 자동 업데이트함)
                          </label>
                          <input
                            type="text"
                            placeholder="예) 검은 자켓에 크로스백을 매고 있는 상대"
                            value={values.partnerAHint}
                            onChange={(e) => handleInputChange(key, 'partnerAHint', e.target.value)}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-teal-500/80"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-stone-400">
                            B ({pair.partnerB.nickname})가 볼 A의 착장 시그널 ('partner_hint' - 당일 유저가 자동 업데이트함)
                          </label>
                          <input
                            type="text"
                            placeholder="예) 청바지에 흰 셔츠를 입고 선글라스를 쓴 상대"
                            value={values.partnerBHint}
                            onChange={(e) => handleInputChange(key, 'partnerBHint', e.target.value)}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-teal-500/80"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 3. D-DAY 티타임 안내 메시지 */}
                    <div className="bg-stone-950 p-4.5 border border-stone-850 rounded-xl space-y-4">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-widest text-rose-400 flex items-center gap-1.5 border-b border-stone-900 pb-2.5">
                        <Sparkles size={13} className="text-rose-400" /> STEP 3. D-DAY 티타임 안내 메시지
                      </h5>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-stone-400">도착 시 안내 메시지 ('action_hint')</label>
                        <textarea
                          rows={3}
                          placeholder="예) 카운터에 '시그널 예약'이라고 귀디 후, 예약석으로 가서 깊은 이야기를 나누세요."
                          value={values.actionHint}
                          onChange={(e) => handleInputChange(key, 'actionHint', e.target.value)}
                          className="w-full p-3 bg-stone-900 border border-stone-850 rounded-lg text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-teal-500/80 resize-none font-sans"
                        />
                      </div>
                    </div>

                  </div>

                  {/* ── 우측: 실시간 모바일 편지/미션 미리보기 (col-span-5) ── */}
                  <div className="xl:col-span-5 flex flex-col items-center justify-start border-t xl:border-t-0 xl:border-l border-stone-850 pt-6 xl:pt-0 xl:pl-8">
                    <div className="w-full text-center space-y-1 mb-4">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-widest text-teal-400 font-mono">
                        Live WYSIWYG Preview
                      </h5>
                      <p className="text-[10px] text-stone-500 font-light">
                        운영자가 편집 중인 데이터가 참가자 모바일 화면에 실시간으로 반영됩니다.
                      </p>
                    </div>

                    {/* 미리보기 탭 컨트롤러 (Step 2 vs Step 3) */}
                    <div className="flex bg-[#000] p-1 rounded-xl border border-stone-850 w-full max-w-[280px] mb-2.5 z-20 relative">
                      <button
                        type="button"
                        onClick={() => setPreviewTabs(prev => ({ ...prev, [key]: 'step2' }))}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${(previewTabs[key] || 'step2') === 'step2'
                            ? 'bg-[#00C7B5] text-stone-950'
                            : 'text-stone-400 hover:text-stone-200'
                          }`}
                      >
                        Step 2 편지
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTabs(prev => ({ ...prev, [key]: 'step3' }))}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${(previewTabs[key] || 'step2') === 'step3'
                            ? 'bg-rose-500 text-white'
                            : 'text-stone-400 hover:text-stone-200'
                          }`}
                      >
                        Step 3 미션
                      </button>
                    </div>

                    {/* 미리보기 대상자 컨트롤러 (A 기준 vs B 기준) */}
                    <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-850 w-full max-w-[280px] mb-4.5 z-20 relative">
                      <button
                        type="button"
                        onClick={() => setPreviewUserSelector(prev => ({ ...prev, [key]: 'A' }))}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center truncate px-1.5 ${(previewUserSelector[key] || 'A') === 'A'
                            ? 'bg-stone-900 text-teal-400 border border-teal-500/20'
                            : 'text-stone-500 hover:text-stone-400'
                          }`}
                        title={`${pair.partnerA.nickname} 화면`}
                      >
                        A ({pair.partnerA.nickname}) 기준
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewUserSelector(prev => ({ ...prev, [key]: 'B' }))}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center truncate px-1.5 ${(previewUserSelector[key] || 'A') === 'B'
                            ? 'bg-stone-900 text-rose-400 border border-rose-500/20'
                            : 'text-stone-500 hover:text-stone-400'
                          }`}
                        title={`${pair.partnerB.nickname} 화면`}
                      >
                        B ({pair.partnerB.nickname}) 기준
                      </button>
                    </div>

                    {/* 20% Zoomed in wrapper (CSS transform scale-[1.2]) */}
                    <div className="transform scale-[1.2] origin-top mt-2 mb-24">
                      {/* 모바일 폰 프레임 목업 */}
                      <div className="relative w-[280px] h-[520px] bg-stone-950 border-[6px] border-stone-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col font-sans text-stone-200 select-none">

                        {/* 폰 상단 상태바 */}
                        <div className="h-6 bg-stone-950 flex items-center justify-between px-4 text-stone-600 text-[8px] font-mono select-none border-b border-stone-900/60 shrink-0">
                          <span>14:21</span>
                          <div className="w-12 h-3 bg-black rounded-full flex items-center justify-center border border-stone-900/20">
                            <span className="w-1 h-1 rounded-full bg-stone-800" />
                          </div>
                          <span className="flex items-center gap-1">📶 🔋</span>
                        </div>

                        {/* 모바일 내부 헤더 */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-900/80 bg-stone-950/40 shrink-0 select-none">
                          <span className="text-[10px] font-cinzel tracking-wider text-[#00C7B5] font-extrabold">
                            SIGNAL TRIP
                          </span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#00C7B5]/10 text-[#00C7B5] border border-[#00C7B5]/20 font-bold font-mono">
                            {(previewTabs[key] || 'step2') === 'step2' ? 'STEP 2' : 'STEP 3'}
                          </span>
                        </div>

                        {/* 모바일 내부 스크롤 콘텐츠 */}
                        <div className="flex-1 overflow-y-auto px-4 py-5 relative flex flex-col justify-between text-left text-xs bg-[#0a0a0a]">
                          {/* 백그라운드 후광 데코레이터 */}
                          <div className="absolute top-[-30px] right-[-30px] w-28 h-28 bg-[#00C7B5]/4 blur-xl rounded-full pointer-events-none" />
                          <div className="absolute bottom-[-30px] left-[-30px] w-28 h-28 bg-[#00C7B5]/2 blur-xl rounded-full pointer-events-none" />

                          {/* ── Step 2 미리보기 ── */}
                          {(previewTabs[key] || 'step2') === 'step2' && (
                            <div className="space-y-4 animate-fadeIn flex-1 flex flex-col justify-between">
                              <div className="space-y-3.5">
                                <div className="text-center space-y-1">
                                  <span className="text-[9px] text-[#00C7B5] font-mono tracking-widest uppercase font-extrabold">Step 2</span>
                                  <h3 className="text-xs font-extrabold text-stone-200 tracking-wider">D-3 시크릿 미션 편지</h3>
                                  <p className="text-[8px] text-stone-500 font-light">두 사람의 만남을 위해 준비된 초대장입니다.</p>
                                </div>

                                <div className="bg-stone-900 border border-stone-850 rounded-xl p-3.5 space-y-3 shadow-md border-t-2 border-t-[#00C7B5] relative z-10">
                                  <div className="flex items-center justify-between border-b border-stone-850 pb-2 text-[8px] font-bold text-stone-400">
                                    <span className="font-cinzel tracking-wider text-[#00C7B5]">INVITATION</span>
                                    <span>D-3 SECRETS</span>
                                  </div>

                                  <div className="space-y-3.5 py-0.5">
                                    <p className="text-[10px] text-stone-300 leading-relaxed font-sans italic text-center break-keep">
                                      \"{(previewUserSelector[key] || 'A') === 'A' ? pair.partnerA.nickname : pair.partnerB.nickname}님, 제주의 낭만 속에서 서로의 여행 결이 맞닿는 약속의 공간으로 당신을 초대합니다.\"
                                    </p>

                                    <div className="space-y-2.5 bg-stone-950 p-3 border border-stone-900 rounded-lg">
                                      <div className="flex items-start gap-2">
                                        <span className="text-[#00C7B5] text-[10px] mt-0.5">⏱</span>
                                        <div>
                                          <span className="text-[8px] text-stone-500 block font-bold tracking-wider">만남 시간</span>
                                          <span className="text-[10px] text-stone-300 font-semibold">
                                            {values.meetingTime || '호스트 지정 시간'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <span className="text-[#00C7B5] text-[10px] mt-0.5">📍</span>
                                        <div>
                                          <span className="text-[8px] text-stone-500 block font-bold tracking-wider">만남 장소</span>
                                          <span className="text-[10px] text-stone-300 font-semibold">
                                            {values.meetingPlace || '호스트 약속 장소'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <span className="text-[#00C7B5] text-[10px] mt-0.5">🕵️‍♂️</span>
                                        <div>
                                          <span className="text-[8px] text-stone-500 block font-bold tracking-wider">상대방 힌트 (시그널)</span>
                                          <span className="text-[10px] text-stone-300 font-semibold leading-relaxed">
                                            {((previewUserSelector[key] || 'A') === 'A' ? values.partnerAHint : values.partnerBHint) || '인증 심사 진행 중'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-[8px] text-stone-500 leading-normal font-light">
                                    ※ 약속된 날짜에 장소에 도착하시면 [📍 장소 도착] 버튼을 터치해 주시기 바랍니다.
                                  </p>
                                </div>
                              </div>

                              <div className="w-full pt-4">
                                <div className="w-full py-2.5 bg-gradient-to-r from-stone-800 to-stone-900 border border-stone-700 text-stone-400 font-bold rounded-lg text-[9px] tracking-wider uppercase text-center cursor-not-allowed">
                                  📍 장소 도착 (도착 확인)
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── Step 3 미리보기 ── */}
                          {(previewTabs[key] || 'step2') === 'step3' && (
                            <div className="space-y-4 animate-fadeIn flex-1 flex flex-col justify-between">
                              <div className="space-y-3.5">
                                <div className="text-center space-y-1">
                                  <span className="text-[9px] text-[#00C7B5] font-mono tracking-widest uppercase font-extrabold">Step 3</span>
                                  <h3 className="text-xs font-extrabold text-stone-200 tracking-wider">D-Day 장소 도착</h3>
                                  <p className="text-[8px] text-stone-500 font-light">메이트가 가까운 곳에 도착하여 만남을 기다리고 있습니다.</p>
                                </div>

                                <div className="bg-stone-900 border border-stone-850 rounded-xl p-3.5 space-y-3.5 shadow-md border-t-2 border-t-rose-500 relative z-10">
                                  <div className="flex items-center justify-between border-b border-stone-850 pb-2 text-[8px] font-bold text-stone-400">
                                    <span className="font-cinzel tracking-wider text-rose-400">MISSION HINT</span>
                                    <span>D-DAY INSTRUCTIONS</span>
                                  </div>

                                  <div className="space-y-2.5">
                                    <div className="bg-stone-950 p-3 border border-stone-900 rounded-lg space-y-1.5">
                                      <span className="text-[8.5px] text-rose-500 font-extrabold uppercase tracking-widest block">💌 시크릿 미션</span>
                                      <p className="text-[10px] text-stone-200 leading-relaxed font-semibold">
                                        {values.actionHint || "두 분의 완벽한 만남을 위한 시크릿 미션이 곧 도착합니다. 💌"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="w-full pt-4">
                                  <div className="w-full py-2.5 bg-gradient-to-r from-stone-800 to-stone-900 border border-stone-700 text-stone-400 font-bold rounded-lg text-[9px] tracking-wider uppercase text-center cursor-not-allowed">
                                    💎 보물찾기 완료 (프로필 해제)
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
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
