import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { MOCK_PARTICIPANTS, type Participant, type MatchResult } from './mockData';
import { Lock, Copy, Info, Sparkles, LogOut, Phone, Star, RefreshCw, Heart, ArrowRight } from 'lucide-react';
import Phase0Login from './Phase0Login';
import RuleNoticeModal from './RuleNoticeModal';

// ── BankAccountInfo Component ──
const BankAccountInfo: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const accountNo = "3333-07-1895056";

  const handleCopy = () => {
    navigator.clipboard.writeText(`카카오뱅크 ${accountNo} 이정진`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-stone-900 border border-stone-850 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#00C7B5] flex items-center gap-1.5">
          <Info size={12} /> 참가비 결제 안내
        </span>
        {copied && (
          <span className="text-[9px] text-teal-400 font-bold font-mono">복사 완료!</span>
        )}
      </div>
      
      <div className="bg-stone-950 border border-stone-900 rounded-lg p-3 flex items-center justify-between gap-2">
        <div className="text-left">
          <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-bold">무통장 입금 계좌</span>
          <span className="text-xs text-stone-200 font-mono font-bold">
            카카오뱅크 {accountNo} 이정진
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 bg-stone-900 border border-stone-850 hover:bg-stone-800 text-stone-400 hover:text-[#00C7B5] rounded-md transition-colors cursor-pointer"
          title="계좌 복사"
        >
          <Copy size={13} />
        </button>
      </div>
      
      <div className="text-left space-y-1">
        <p className="text-[9px] text-stone-500 font-light leading-relaxed">
          * 원활한 매칭 확인을 위해 입금자명은 가입 신청하신 **본명**으로 입금해 주세요.
        </p>
      </div>
    </div>
  );
};

// ── AlertModal Component ──
interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xs bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl"
        >
          <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto text-[#00C7B5]">
            <Sparkles size={18} />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xs font-extrabold text-stone-200 tracking-wide">{title}</h4>
            <p className="text-[11px] text-stone-400 font-light leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer transition-all duration-300 shadow-md shadow-teal-500/10"
          >
            확인했습니다
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ── Step 1 View ──
const Step1View = ({
  partnerProfile,
  isPaymentSubmitted,
  onSubmitPayment
}: {
  partnerProfile: Participant | null;
  isPaymentSubmitted: boolean;
  onSubmitPayment: () => void;
}) => {
  if (!partnerProfile) return null;

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="text-center space-y-1">
        <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase font-extrabold">Step 1</span>
        <h3 className="font-cinzel text-lg font-bold text-gold-premium tracking-wider">매칭 확인 및 입금 대기</h3>
        <p className="text-[11px] text-stone-400 font-light">나와 취향이 어우러진 메이트가 매칭되었습니다.</p>
      </div>

      {/* Blurred Teaser Card */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center space-y-4">
        {/* Photo Container with strong blur & lock */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-stone-800 shadow-inner flex items-center justify-center shrink-0">
          <img
            src={partnerProfile.photo_urls[0] || 'https://api.dicebear.com/7.x/identicon/svg?seed=placeholder'}
            alt="Mate Teaser"
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{ filter: 'blur(16px)' }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-stone-300">
            <Lock size={20} className="text-[#00C7B5] animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 w-full">
          <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider block">MATE PROFILE</span>
          <h4 className="text-base font-bold text-stone-200 font-sans tracking-wide">
            {partnerProfile.nickname}
          </h4>
          
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1.5">
            <span className="px-2 py-0.5 bg-stone-950 border border-stone-900 text-[9px] text-stone-500 font-bold rounded-full">
              나이: D-Day 보물찾기 시 공개
            </span>
            <span className="px-2 py-0.5 bg-stone-950 border border-stone-900 text-[9px] text-stone-500 font-bold rounded-full">
              직업: D-Day 보물찾기 시 공개
            </span>
            <span className="px-2 py-0.5 bg-stone-950 border border-stone-900 text-[9px] text-stone-500 font-bold rounded-full">
              MBTI: D-Day 보물찾기 시 공개
            </span>
          </div>
        </div>
      </div>

      <BankAccountInfo />

      {isPaymentSubmitted ? (
        <div className="bg-stone-900/40 border border-stone-850 rounded-xl p-4 text-center text-stone-400 space-y-2">
          <div className="w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto text-[#00C7B5] animate-spin">
            <RefreshCw size={12} />
          </div>
          <p className="text-xs font-semibold">참가 서류 및 입금 확인 대기 중...</p>
          <p className="text-[10px] text-stone-500 font-light leading-relaxed">
            호스트 팀에서 무통장 입금 내역을 신속히 확인한 후 승인해 드립니다. 승인이 완료되면 본 화면이 자동으로 다음 단계로 전환됩니다.
          </p>
        </div>
      ) : (
        <button
          onClick={onSubmitPayment}
          className="w-full py-4.5 bg-gradient-to-r from-[#00C7B5] to-[#00a89a] hover:from-[#00b0a0] hover:to-[#009285] text-stone-950 font-bold rounded-xl text-xs tracking-wider uppercase cursor-pointer transition-all duration-300 shadow-lg shadow-[#00C7B5]/10"
        >
          신원 증빙 및 참가비 입금 완료하기
        </button>
      )}
    </div>
  );
};

// ── Step 2 View ──
const Step2View = ({
  matchResult,
  onArriveAtPlace
}: {
  matchResult: MatchResult;
  onArriveAtPlace: () => void;
}) => {
  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="text-center space-y-1">
        <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase font-extrabold">Step 2</span>
        <h3 className="font-cinzel text-lg font-bold text-gold-premium tracking-wider">D-3 시크릿 미션 편지</h3>
        <p className="text-[11px] text-stone-400 font-light">두 사람의 만남을 위해 준비된 밀서입니다.</p>
      </div>

      {/* Secret Letter Invitation UI */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-5 border-t-4 border-t-[#00C7B5]">
        <div className="flex items-center justify-between border-b border-stone-850 pb-3">
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#00C7B5] font-bold">INVITATION</span>
          <span className="text-[9px] font-mono text-stone-500">D-3 SECRETS</span>
        </div>

        <div className="space-y-4 py-1">
          <p className="text-xs text-stone-300 leading-relaxed break-keep font-serif italic text-center">
            "제주의 낭만 속에서, 서로의 여행 결이 맞닿는 약속의 공간으로 당신을 초대합니다."
          </p>

          <div className="space-y-3 bg-stone-950 p-4 border border-stone-900 rounded-xl font-sans">
            <div className="flex items-start gap-2.5">
              <span className="text-[#00C7B5] shrink-0 text-xs mt-0.5">⏱</span>
              <div>
                <span className="text-[9px] text-stone-500 block uppercase font-bold tracking-wider">만남 시간</span>
                <span className="text-xs text-stone-200 font-semibold">{matchResult.meeting_time || '호스트 지정 시간'}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2.5">
              <span className="text-[#00C7B5] shrink-0 text-xs mt-0.5">📍</span>
              <div>
                <span className="text-[9px] text-stone-500 block uppercase font-bold tracking-wider">만남 장소</span>
                <span className="text-xs text-stone-200 font-semibold">{matchResult.meeting_place || '호스트 약속 장소'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-[#00C7B5] shrink-0 text-xs mt-0.5">🕵️‍♂️</span>
              <div>
                <span className="text-[9px] text-stone-500 block uppercase font-bold tracking-wider">상대방 힌트 (시그널)</span>
                <span className="text-xs text-stone-200 font-semibold leading-relaxed">{matchResult.partner_hint || '인증 심사 진행 중'}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-stone-500 leading-relaxed font-light mt-1">
          ※ 약속된 날짜에 장소에 도착하시면 [📍 장소 도착] 버튼을 터치해 주시기 바랍니다.
        </p>
      </div>

      <button
        onClick={onArriveAtPlace}
        className="w-full py-4 bg-gradient-to-r from-[#00C7B5] to-[#00a89a] hover:from-[#00b0a0] hover:to-[#009285] text-stone-950 font-bold rounded-xl text-xs tracking-wider uppercase cursor-pointer transition-all duration-300 shadow-lg shadow-[#00C7B5]/10"
      >
        📍 장소 도착 (도착 확인)
      </button>
    </div>
  );
};

// ── Step 3 View ──
const Step3View = ({
  matchResult,
  onStartTreasureHunt
}: {
  matchResult: MatchResult;
  onStartTreasureHunt: () => void;
}) => {
  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="text-center space-y-1">
        <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase font-extrabold">Step 3</span>
        <h3 className="font-cinzel text-lg font-bold text-gold-premium tracking-wider">D-Day 장소 도착</h3>
        <p className="text-[11px] text-stone-400 font-light">메이트가 가까운 곳에 도착하여 만남을 기다리고 있습니다.</p>
      </div>

      {/* Action Hint Card */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-5 border-t-4 border-t-rose-500">
        <div className="flex items-center justify-between border-b border-stone-850 pb-3">
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-rose-400 font-bold">MISSION HINT</span>
          <span className="text-[9px] font-mono text-stone-500">D-DAY INSTRUCTIONS</span>
        </div>

        <div className="space-y-4">
          <div className="bg-stone-950 p-4 border border-stone-900 rounded-xl space-y-2">
            <span className="text-[9px] text-[#00C7B5] font-extrabold uppercase tracking-widest block">만남 현장 지령 & 행동 힌트</span>
            <p className="text-xs text-stone-200 leading-relaxed font-medium">
              {matchResult.action_hint || '지령을 로드하는 중입니다.'}
            </p>
          </div>
          
          <p className="text-xs text-stone-400 leading-relaxed font-light">
            상대방의 시그널 힌트(인상착의 등)를 확인하여 메이트를 조심스럽게 탐색해 보세요. 서로 만나 가볍게 수줍은 첫인사를 나눈 다음, 아래 [💎 보물찾기 시작] 버튼을 터치해 주십시오.
          </p>
        </div>
      </div>

      <button
        onClick={onStartTreasureHunt}
        className="w-full py-4.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-stone-950 font-bold rounded-xl text-xs tracking-wider uppercase cursor-pointer transition-all duration-300 shadow-lg shadow-rose-500/10"
      >
        💎 보물찾기 시작 (프로필 해제)
      </button>
    </div>
  );
};

// ── Step 4 View ──
const Step4View = ({
  partnerProfile
}: {
  partnerProfile: Participant | null;
}) => {
  if (!partnerProfile) return null;

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="text-center space-y-1">
        <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase font-extrabold">Step 4</span>
        <h3 className="font-cinzel text-lg font-bold text-gold-premium tracking-wider">보물찾기 성공!</h3>
        <p className="text-[11px] text-stone-400 font-light">매칭 메이트의 실명 정보와 프로필이 완전히 해제되었습니다.</p>
      </div>

      {/* Unblurred Partner Profile Card */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#00C7B5]/30 shrink-0">
            <img
              src={partnerProfile.photo_urls[0] || 'https://api.dicebear.com/7.x/identicon/svg?seed=placeholder'}
              alt="Mate Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-stone-100">{partnerProfile.name}</h4>
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#00C7B5]/10 text-[#00C7B5] border border-[#00C7B5]/20 font-bold font-mono">
                {partnerProfile.nickname}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1 font-mono font-semibold flex items-center gap-1">
              <Phone size={11} className="text-[#00C7B5]" /> {partnerProfile.phone || '연락처 정보 없음'}
            </p>
          </div>
        </div>

        <div className="bg-stone-950 p-4 border border-stone-900 rounded-xl space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[9px] text-stone-500 font-bold block uppercase tracking-wider">나이 / 성별</span>
              <span className="text-stone-300 font-medium">{partnerProfile.age}세 / {partnerProfile.gender === 'MALE' ? '남성' : '여성'}</span>
            </div>
            <div>
              <span className="text-[9px] text-stone-500 font-bold block uppercase tracking-wider">MBTI</span>
              <span className="text-stone-300 font-medium">{partnerProfile.mbti}</span>
            </div>
            <div>
              <span className="text-[9px] text-stone-500 font-bold block uppercase tracking-wider">직업 분류</span>
              <span className="text-stone-300 font-medium">
                {partnerProfile.job_type === 'office_worker' && '직장인 (회사원)'}
                {partnerProfile.job_type === 'business_owner' && '사업자 (대표)'}
                {partnerProfile.job_type === 'professional' && '전문직'}
                {partnerProfile.job_type === 'civil_servant' && '공무원 / 공기업'}
                {partnerProfile.job_type === 'freelancer' && '프리랜서'}
                {partnerProfile.job_type === 'student' && '학생'}
                {partnerProfile.job_type === 'other' && '기타'}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-stone-500 font-bold block uppercase tracking-wider">소속 / 분야</span>
              <span className="text-stone-300 font-medium truncate block">{partnerProfile.company_name || '미기재'}</span>
            </div>
          </div>

          <div className="border-t border-stone-900 pt-2.5">
            <span className="text-[9px] text-stone-500 font-bold block uppercase tracking-wider">자기소개</span>
            <p className="text-stone-300 leading-relaxed font-light mt-1 whitespace-pre-wrap">{partnerProfile.bio}</p>
          </div>

          <div className="border-t border-stone-900 pt-2.5">
            <span className="text-[9px] text-stone-500 font-bold block uppercase tracking-wider">여행 스타일</span>
            <p className="text-stone-300 leading-relaxed font-light mt-1 whitespace-pre-wrap">{partnerProfile.ideal_type}</p>
          </div>
        </div>
      </div>

      {/* Private Dining Card Info */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-5 shadow-xl space-y-3">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#00C7B5] flex items-center gap-1.5">
          <Star size={14} className="fill-teal-500/10" /> 프라이빗 다이닝 예약 세부 정보
        </h4>
        
        <div className="bg-stone-950 p-4 border border-stone-900 rounded-xl space-y-3 text-xs">
          <div>
            <span className="text-[9px] text-stone-500 block uppercase font-bold tracking-wider">식당명</span>
            <span className="text-stone-200 font-bold">제주 애월 아쿠아 디너</span>
          </div>
          
          <div>
            <span className="text-[9px] text-stone-500 block uppercase font-bold tracking-wider">제공 코스</span>
            <span className="text-stone-200 font-medium">시그널 트립 특별 페어링 코스 (2인 기준 제공)</span>
          </div>

          <div>
            <span className="text-[9px] text-stone-500 block uppercase font-bold tracking-wider">식당 위치</span>
            <span className="text-stone-200 font-light block leading-relaxed">
              제주특별자치도 제주시 애월읍 애월로 123
            </span>
          </div>

          <div className="pt-2 border-t border-stone-900">
            <a
              href="https://map.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold"
            >
              네이버 지도에서 보기 <ArrowRight size={11} className="rotate-[-45deg]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Lobby Waiting View ──
const LobbyWaitingView = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fadeIn">
    <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00C7B5] animate-pulse">
      <Heart size={28} className="fill-teal-500/10" />
    </div>
    <div className="space-y-1.5">
      <h3 className="font-cinzel text-lg font-bold text-gold-premium tracking-wider">Lobby</h3>
      <h4 className="text-xs font-bold text-stone-200">현재 매칭 심사가 진행 중입니다.</h4>
      <p className="text-[11px] text-stone-400 font-light leading-relaxed max-w-xs mx-auto">
        가장 결이 잘 맞는 메이트와 취향 매칭을 완성하기 위해 시스템 조율 및 호스트 심사가 이루어지고 있습니다. 매칭이 성사되면 화면이 실시간으로 전환됩니다.
      </p>
    </div>
  </div>
);

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
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Participant | null>(null);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [lastShownStep, setLastShownStep] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({ isOpen: false, title: '', message: '' });

  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState<boolean>(false);

  // ── Toast helper ──
  const showToast = useCallback((message: string, duration = 3500) => {
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
        setIsPaymentSubmitted(localStorage.getItem(`payment_submitted_${parsed.id}`) === 'true');
      } catch { /* ignore */ }
    }
  }, []);

  // ── Sync user status & matching info ──
  const fetchMatchingInfo = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('match_results')
        .select('*')
        .eq('participant_id', userId)
        .single();

      if (data && !error) {
        setMatchResult(data as unknown as MatchResult);
      } else {
        // Fallback for tests if not in DB
        setMatchResult({
          participant_id: userId,
          matched_with_id: MOCK_PARTICIPANTS.find(p => p.id !== userId)?.id || null,
          is_matched: true,
          current_step: 1
        });
      }
    } catch {
      // Fallback
      setMatchResult({
        participant_id: userId,
        matched_with_id: MOCK_PARTICIPANTS.find(p => p.id !== userId)?.id || null,
        is_matched: true,
        current_step: 1
      });
    }
  }, []);

  // Fetch partner profile details
  useEffect(() => {
    if (matchResult && matchResult.is_matched && matchResult.matched_with_id) {
      const fetchPartner = async () => {
        try {
          const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('id', matchResult.matched_with_id)
            .single();

          if (data && !error) {
            setPartnerProfile(data as unknown as Participant);
          } else {
            // Fallback mock
            const mockPartner = MOCK_PARTICIPANTS.find(p => p.id === matchResult.matched_with_id);
            if (mockPartner) setPartnerProfile(mockPartner);
          }
        } catch {
          // Fallback mock
          const mockPartner = MOCK_PARTICIPANTS.find(p => p.id === matchResult.matched_with_id);
          if (mockPartner) setPartnerProfile(mockPartner);
        }
      };
      fetchPartner();
    } else {
      setPartnerProfile(null);
    }
  }, [matchResult]);

  // Fetch match details when user is authenticated
  useEffect(() => {
    if (user) {
      fetchMatchingInfo(user.id);
    }
  }, [user, fetchMatchingInfo]);

  // ── Step transition popup triggering ──
  useEffect(() => {
    if (!matchResult || !matchResult.is_matched) return;
    const step = matchResult.current_step || 1;
    if (step !== lastShownStep) {
      setLastShownStep(step);
      let title = '';
      let message = '';

      if (step === 1) {
        title = 'Step 1. 매칭 메이트 확인 🎉';
        message = '축하합니다! 당신과 여행 취향이 완벽히 일치하는 메이트를 찾았습니다.\n\n가장 안전하고 프라이빗한 만남을 위해 신원 증빙 서류를 제출하고 참가비 입금을 완료해 주세요. 모든 준비가 끝나면 여행 3일 전에 시크릿 미션 편지가 도착합니다!';
      } else if (step === 2) {
        title = 'Step 2. 미션 편지 도착 💌';
        message = '당신과 취향이 비슷한 여행 메이트를 만나는 장소가 공개되었어요!\n\n당일 약속된 장소에 도착하면 [📍 장소 도착] 버튼을 눌러주세요.';
      } else if (step === 3) {
        title = 'Step 3. 약속 장소 도착 확인 📍';
        message = '메이트가 가까운 곳에 있습니다!\n\n상대를 찾아 가볍게 인사를 나누고 함께 [💎 보물찾기 시작]을 눌러주세요.';
      } else if (step === 4) {
        title = 'Step 4. 보물찾기 성공 💎';
        message = '진짜 보물을 발견하셨군요!\n\n두 분만을 위해 준비된 프라이빗한 공간에서, 맛있는 음식과 함께 더 많은 대화를 나누시길 바랍니다.';
      }

      if (message) {
        setActiveModal({ isOpen: true, title, message });
      }
    }
  }, [matchResult?.current_step, lastShownStep]);

  // ── Supabase Realtime subscription for match results step change ──
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`match-results-realtime-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_results',
          filter: `participant_id=eq.${user.id}`
        },
        (payload) => {
          const newData = payload.new as MatchResult;
          if (newData) {
            setMatchResult(newData);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // ── On login ──
  const handleLogin = useCallback((userData: Participant) => {
    setUser(userData);
    localStorage.setItem('signal_trip_user', JSON.stringify(userData));
    setIsPaymentSubmitted(localStorage.getItem(`payment_submitted_${userData.id}`) === 'true');
    fetchMatchingInfo(userData.id);
  }, [fetchMatchingInfo]);

  // ── On logout ──
  const handleLogout = useCallback(() => {
    setUser(null);
    setMatchResult(null);
    setPartnerProfile(null);
    setLastShownStep(null);
    localStorage.removeItem('signal_trip_user');
  }, []);

  // ── Client updates database step ──
  const handleAdvanceStep = async (nextStep: number) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('match_results')
        .upsert({
          participant_id: user.id,
          matched_with_id: matchResult?.matched_with_id || null,
          is_matched: true,
          meeting_time: matchResult?.meeting_time || null,
          meeting_place: matchResult?.meeting_place || null,
          partner_hint: matchResult?.partner_hint || null,
          action_hint: matchResult?.action_hint || null,
          current_step: nextStep
        }, { onConflict: 'participant_id' });

      if (error) throw error;
      setMatchResult(prev => prev ? { ...prev, current_step: nextStep } : null);
    } catch (err) {
      console.warn("Database step transition error, fallback to local transition:", err);
      setMatchResult(prev => prev ? { ...prev, current_step: nextStep } : null);
    }
  };

  const handleSubmitPayment = () => {
    if (!user) return;
    localStorage.setItem(`payment_submitted_${user.id}`, 'true');
    setIsPaymentSubmitted(true);
    showToast("💖 신원 증빙 및 참가비 입금이 접수되었습니다.");
  };

  // ── Render View based on matchResult step ──
  const renderV2Step = () => {
    if (!matchResult || !matchResult.is_matched) {
      return <LobbyWaitingView />;
    }

    const step = matchResult.current_step || 1;

    switch (step) {
      case 1:
        return (
          <Step1View
            partnerProfile={partnerProfile}
            isPaymentSubmitted={isPaymentSubmitted}
            onSubmitPayment={handleSubmitPayment}
          />
        );
      case 2:
        return (
          <Step2View
            matchResult={matchResult}
            onArriveAtPlace={() => handleAdvanceStep(3)}
          />
        );
      case 3:
        return (
          <Step3View
            matchResult={matchResult}
            onStartTreasureHunt={() => handleAdvanceStep(4)}
          />
        );
      case 4:
        return <Step4View partnerProfile={partnerProfile} />;
      default:
        return <LobbyWaitingView />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', position: 'relative', overflow: 'hidden',
      fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      {/* Background glow effects */}
      <div className="fixed top-[-100px] right-[-100px] w-[400px] h-[400px] bg-radial-gradient from-[rgba(0,199,181,0.06)] to-transparent pointer-events-none rounded-full" />
      <div className="fixed bottom-[-80px] left-[-80px] w-[300px] h-[300px] bg-radial-gradient from-[rgba(0,199,181,0.04)] to-transparent pointer-events-none rounded-full" />

      {/* Mobile container */}
      <div className="max-w-md mx-auto min-h-screen relative flex flex-col justify-between">
        <div>
          {/* Header — only show when logged in */}
          {user && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-900 bg-stone-950/40 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="font-cinzel text-xs tracking-[0.15em] text-[#00C7B5] font-extrabold">
                  SIGNAL TRIP
                </span>
                {matchResult?.is_matched && (
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#00C7B5]/10 text-[#00C7B5] font-extrabold uppercase font-mono tracking-wider">
                    STEP {matchResult.current_step || 1}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-850 hover:border-rose-900/50 hover:bg-rose-950/20 rounded-lg text-[10px] text-stone-500 hover:text-rose-400 font-semibold cursor-pointer transition-all duration-300"
              >
                <LogOut size={12} />
                로그아웃
              </button>
            </div>
          )}

          {/* Core Content */}
          <div className="px-5 pt-6 pb-24">
            {user ? renderV2Step() : (
              <Phase0Login onLogin={handleLogin} showToast={showToast} />
            )}
          </div>
        </div>
      </div>

      {/* Popups & Overlays */}
      <Toast message={toast.message} visible={toast.visible} />
      <RuleNoticeModal />
      
      <AlertModal
        isOpen={activeModal.isOpen}
        title={activeModal.title}
        message={activeModal.message}
        onClose={() => setActiveModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
