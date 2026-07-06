import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight, ArrowDown, ArrowDownLeft } from 'lucide-react';
import Footer from './WebApp/Footer';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

interface HeroSectionProps {
  onOpenRegistration: () => void;
}

export default function HeroSection({ onOpenRegistration }: HeroSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout');
    }
    onOpenRegistration();
  };

  // Section 1 (Day) -> Section 2 (Night) 스크롤 페이드 트랜지션 비율 계산
  // 뷰포트 높이의 약 70% 시점까지 서서히 낮의 투명도가 0이 되도록 설정
  const dayOpacity = typeof window !== 'undefined'
    ? Math.max(0, 1 - scrollY / (window.innerHeight * 0.7 || 600))
    : 1;

  const faqData = [
    {
      q: "포구트립은 몇 명 정도 참가하나요?",
      a: "포구트립은 남녀 성비를 맞추어 8명 내외의 소규모로 진행되며, 1시간 후 테이블이 로테이션 되며 서로가 깊은 대화를 나눌 수 있도록 조절합니다."
    },
    {
      q: "날씨가 안 좋으면 어떻게 되나요?",
      a: "포구트립은 제주 밤바다의 낭만을 온전히 느끼는 야외 프로그램입니다. 따라서 우천 시나 기상 악화 시에는 프로그램 진행이 불가하며, 당일 100% 전액 환불 및 취소 처리를 해드립니다. 억지로 실내로 옮겨 감성을 해치지 않겠습니다."
    },
    {
      q: "초보자도 어색하지 않을까요?",
      a: "포포 포구 호스트의 친절한 안내와 아이스브레이킹, 및 다 함께 몰입할 수 있는 무선 헤드셋 음악이 준비되어 있어 누구나 어색함 없이 낭만적인 시간을 보낼 수 있습니다."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#070B19] flex flex-col items-center font-sans overflow-x-hidden">
      <style>{`
        @keyframes slide-right {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(6px); opacity: 1; }
        }
        .animate-slide-right {
          animation: slide-right 1.5s infinite ease-in-out;
        }
        @keyframes bounce-diagonal {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-4px, 4px); }
        }
        .animate-bounce-diagonal {
          animation: bounce-diagonal 1.5s infinite ease-in-out;
        }
      `}</style>
      {/* Full width container, responsive design */}
      <div className="w-full min-h-screen bg-[#070B19] text-stone-200 flex flex-col relative pb-32">
        
        {/* ================= SECTION 1: HERO (DAY) ================= */}
        <section className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-[#070B19]">
          {/* Day Background (Fades out on scroll) */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-75"
            style={{
              backgroundImage: "url('/images/jeju-day-bg.jpg')",
              opacity: dayOpacity,
            }}
          />
          {/* Slightly Dimmed Overlay for Day (Fades out with background) */}
          <div
            className="absolute inset-0 bg-black/25"
            style={{ opacity: dayOpacity }}
          />

          {/* Underneath Dark Overlay (Stays static as day background fades) */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070B19]/45 to-[#070B19] -z-10" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-6xl mx-auto px-6 w-full">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tight text-teal-300 drop-shadow-md mb-6 block text-center break-keep"
            >
              포포 포구
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-lg px-4 whitespace-nowrap"
            >
              제주 미드나잇 포구트립
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-24 flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/70">Scroll Down</span>
              <ChevronDown className="w-5 h-5 text-teal-300 animate-bounce" />
            </motion.div>
          </div>
        </section>

        {/* ================= SECTION 2: MAIN HOOK (NIGHT) ================= */}
        <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-8 py-24 overflow-hidden bg-[#070B19]">
          {/* Background Image (Original brightness 100%) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/silent table.png')" }}
          />
          {/* Light gradient overlay for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070B19]/30 via-transparent to-[#070B19]/30" />
          
          <div className="relative z-10 space-y-8 max-w-4xl mx-auto flex flex-col items-center w-full">
            <span 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#00C7B5] uppercase block text-center break-keep"
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85)' }}
            >
              포구 밤크닉
            </span>
            
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight break-keep"
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85)' }}
            >
              제주의 밤, 포구에 앉아 밤바다를 바라보며 단 2시간만.
            </h2>
            
            <p 
              className="text-stone-100 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed break-keep px-2 max-w-4xl"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.95)' }}
            >
              파도 소리가 채우는 비밀스러운 밤크닉으로 초대합니다.
            </p>
          </div>
        </section>

        {/* ================= SECTION 3: EMPATHY & NARRATIVE ================= */}
        <section className="px-6 py-24 bg-white text-stone-900 flex flex-col items-center text-center">
          <div className="max-w-4xl space-y-6 text-[16.8px] sm:text-[19.2px] md:text-[21.6px] lg:text-[22.8px] leading-[1.5] font-medium text-stone-700 break-keep">
            <div className="space-y-1 text-[19.2px] sm:text-[21.6px] md:text-[24px] lg:text-[28.8px] font-semibold text-stone-800">
              <p>제주의 밤은 길고 지루해요</p>
              <p className="text-stone-400 font-normal">우리는 낮 보다 아름다운 밤을 보내고 싶었어요</p>
            </div>
            
            <div className="h-4" />

            <div className="space-y-1">
              <p>로컬들은 밤이 되면 포구 근처로 나가</p>
              <p>캠핑의자를 놓고</p>
              <p>돗자리를 깔고 밤의 이야기를 나눠요</p>
            </div>

            <div className="h-4" />

            <div className="space-y-1">
              <p>우리는 로컬들만 아는 포구에서</p>
              <p>파도소리를 BGM 삼아 캠핑의자에 앉아</p>
              <p>와인을 마시며 이야기를 나누고</p>
              <p className="text-stone-400 font-normal">음악을 듣는 밤크닉을 준비했어요</p>
            </div>

            <div className="pt-2 border-none space-y-3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-stone-900 leading-normal">
              <p className="leading-normal">
                <span className="inline-block bg-[linear-gradient(transparent_60%,#00C7B5_40%)] text-stone-900 px-1 pb-1 break-keep">
                  단 2시간 로컬들만 아는 포구에서 펼쳐지는
                </span>
              </p>
              <p className="leading-normal">
                <span className="inline-block bg-[linear-gradient(transparent_60%,#00C7B5_40%)] text-stone-900 px-1 pb-1 break-keep">
                  제주 미드나잇 포구트립
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: HOW IT WORKS ================= */}
        <section className="px-6 py-24 bg-stone-50 text-stone-850">
          <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#00C7B5] uppercase block">
              OPERATIONAL STEPS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-stone-800 font-sans">
              포구트립은 이렇게 진행돼요
            </h2>
          </div>

          {/* Steps Responsive Grid (1-Column on Mobile, 2-Column Grid on Desktop) */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-y-16 md:gap-x-24 md:gap-y-24 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-4 transition-all duration-300">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-[1.5px] border-[#00C7B5] flex items-center justify-center bg-white p-3 mb-5 shadow-sm">
                <img src="/images/step1_envelope.png" className="w-full h-full object-contain" alt="신청서 접수 및 안내" />
              </div>
              <span className="text-sm font-medium tracking-widest text-[#00C7B5] mb-2">STEP 01</span>
              <h4 className="text-xl md:text-2xl font-bold text-stone-700 mb-3">신청서 접수 및 안내</h4>
              <p className="text-lg md:text-xl font-light text-stone-600 leading-relaxed break-keep text-left w-full">
                신청서를 받아요. 취향이 비슷한 분들을 남녀 성비에 맞춰서 연락을 드려요. 포구트립이 진행되는 장소, 시간을 정해서 일주일전에 알려드려요. (도착 시 연락하실 포포 포구의 연락처도 함께 안내해 드립니다.)
              </p>
              {/* PC Arrow Step 1 -> Step 2 */}
              <div className="hidden md:flex absolute top-[15%] -right-16 z-10 items-center justify-center">
                <ArrowRight className="w-8 h-8 text-[#00C7B5] animate-slide-right" strokeWidth={1.5} />
              </div>
            </div>

            {/* Mobile Arrow 1-to-2 */}
            <div className="flex md:hidden justify-center w-full -my-4">
              <ArrowDown className="w-6 h-6 text-[#00C7B5] animate-bounce" strokeWidth={1.5} />
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-4 transition-all duration-300">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-[1.5px] border-[#00C7B5] flex items-center justify-center bg-white p-3 mb-5 shadow-sm">
                <img src="/images/step2_chair.png" className="w-full h-full object-contain" alt="포구 현장 도착" />
              </div>
              <span className="text-sm font-medium tracking-widest text-[#00C7B5] mb-2">STEP 02</span>
              <h4 className="text-xl md:text-2xl font-bold text-stone-700 mb-3">포구 현장 도착</h4>
              <p className="text-lg md:text-xl font-light text-stone-600 leading-relaxed break-keep text-left w-full">
                당일날 밤, 포구에 도착하시면 포포 포구가 기다리고 있어요. 바다가 보이는 파도 소리가 들리는 포구에서 가까운 곳에 캠핑의자와 밀크박스를 준비해뒀어요.
              </p>
              {/* PC Arrow Step 2 -> Step 3 */}
              <div className="hidden md:flex absolute -bottom-16 left-0 -translate-x-[40%] z-10 items-center justify-center">
                <ArrowDownLeft className="w-8 h-8 text-[#00C7B5] animate-bounce-diagonal" strokeWidth={1.5} />
              </div>
            </div>

            {/* Mobile Arrow 2-to-3 */}
            <div className="flex md:hidden justify-center w-full -my-4">
              <ArrowDown className="w-6 h-6 text-[#00C7B5] animate-bounce" strokeWidth={1.5} />
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-4 transition-all duration-300">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-[1.5px] border-[#00C7B5] flex items-center justify-center bg-white p-3 mb-5 shadow-sm">
                <img src="/images/step3_basket.png" className="w-full h-full object-contain" alt="미드나잇 와인햄퍼 개봉" />
              </div>
              <span className="text-sm font-medium tracking-widest text-[#00C7B5] mb-2">STEP 03</span>
              <h4 className="text-xl md:text-2xl font-bold text-stone-700 mb-3">미드나잇 와인햄퍼 개봉</h4>
              <p className="text-lg md:text-xl font-light text-stone-600 leading-relaxed break-keep text-left w-full">
                우리가 준비한 1인용 미드나잇 와인햄퍼를 받아요 (논 알코올 음료도 있어요). 8명이 와서 4명(남녀2명씩) 두 테이블에 앉아요. 포포 포구에서 포구트립의 간단한 설명과 함께 이야기를 시작해요.
              </p>
              {/* PC Arrow Step 3 -> Step 4 */}
              <div className="hidden md:flex absolute top-[15%] -right-16 z-10 items-center justify-center">
                <ArrowRight className="w-8 h-8 text-[#00C7B5] animate-slide-right" strokeWidth={1.5} />
              </div>
            </div>

            {/* Mobile Arrow 3-to-4 */}
            <div className="flex md:hidden justify-center w-full -my-4">
              <ArrowDown className="w-6 h-6 text-[#00C7B5] animate-bounce" strokeWidth={1.5} />
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center p-4 transition-all duration-300">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-[1.5px] border-[#00C7B5] flex items-center justify-center bg-white p-3 mb-5 shadow-sm">
                <img src="/images/step4_headphone.png" className="w-full h-full object-contain" alt="사일런트 뮤직 & 테이블 교환" />
              </div>
              <span className="text-sm font-medium tracking-widest text-[#00C7B5] mb-2">STEP 04</span>
              <h4 className="text-xl md:text-2xl font-bold text-stone-700 mb-3">사일런트 뮤직 & 테이블 교환</h4>
              <p className="text-lg md:text-xl font-light text-stone-600 leading-relaxed break-keep text-left w-full">
                미드나잇 와인햄퍼에는 헤드셋도 있어요, 다 같이 음악을 듣고 이야기를 나눠요. 1시간이 지나면 테이블을 바꿔서 새로운 분들과 이야기를 나누고, 파도 소리 들으며 와인 마시는 밤바다의 낭만을 즐겨요.
              </p>
              {/* PC Arrow Step 4 -> Step 5 */}
              <div className="hidden md:flex absolute -bottom-16 left-0 -translate-x-[40%] z-10 items-center justify-center">
                <ArrowDownLeft className="w-8 h-8 text-[#00C7B5] animate-bounce-diagonal" strokeWidth={1.5} />
              </div>
            </div>

            {/* Mobile Arrow 4-to-5 */}
            <div className="flex md:hidden justify-center w-full -my-4">
              <ArrowDown className="w-6 h-6 text-[#00C7B5] animate-bounce" strokeWidth={1.5} />
            </div>

            {/* Step 5 */}
            <div className="relative flex flex-col items-center text-center p-4 transition-all duration-300 md:col-span-2 md:max-w-md md:mx-auto">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-[1.5px] border-[#00C7B5] flex items-center justify-center bg-white p-3 mb-5 shadow-sm">
                <img src="/images/step5_night.png" className="w-full h-full object-contain" alt="밤크닉 마무리" />
              </div>
              <span className="text-sm font-medium tracking-widest text-[#00C7B5] mb-2">STEP 05</span>
              <h4 className="text-xl md:text-2xl font-bold text-stone-700 mb-3">밤크닉 마무리</h4>
              <p className="text-lg md:text-xl font-light text-stone-600 leading-relaxed break-keep text-left w-full">
                단 2시간만 진행되는 포구트립이에요. 짧지만 깊은 여운을 남긴 채 제주의 밤바다와 작별을 고합니다.
              </p>
            </div>

          </div>
        </section>

        {/* ================= SECTION 5: VISUAL PROOF ================= */}
        <section className="px-6 py-24 bg-[#04060F] text-stone-200">
          <div className="text-center space-y-4 mb-14 max-w-3xl mx-auto">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#00C7B5] uppercase block">
              THE EXPERIENCES
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white font-sans tracking-tight break-keep leading-tight">
              포포 포구에서 준비했어요
            </h2>
            <p className="text-[19.2px] md:text-[24px] font-extrabold text-stone-100 tracking-tight mt-4">
              1인용 미드나잇 와인햄퍼
            </p>
            <div className="bg-[#070B19] border border-stone-850 rounded-2xl p-5 mt-6">
              <p className="text-xs font-bold text-[#00C7B5] mb-2 uppercase tracking-wider">BOX CONTENTS</p>
              <p className="text-sm sm:text-base md:text-lg text-stone-200 leading-relaxed font-medium break-keep">
                와인햄퍼 + 캔 와인(논 알코올 음료도 있어요) + 제주 로컬 핑거푸드(치즈, 감귤 칩 등) + 야광 팔찌 + 무선 헤드셋
              </p>
            </div>
          </div>

          {/* Cards Layout (Grid 3 columns on PC) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Card 1 */}
            <div className="bg-[#070B19] border border-stone-850 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#00C7B5]/30 transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/midnight box.png"
                  alt="미드나잇 와인햄퍼"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B19] to-transparent opacity-60" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-[#00C7B5] uppercase block">Object 01</span>
                <div className="space-y-2 flex-1">
                  <strong className="text-[21.6px] md:text-[24px] font-bold text-white block mb-2">미드나잇 와인햄퍼</strong>
                  <p className="text-sm sm:text-base md:text-lg text-stone-200 leading-relaxed font-normal break-keep">
                    미드나잇 와인햄퍼: 파도 소리를 BGM 삼아, 나만을 위해 준비된 감성 와인햄퍼를 엽니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#070B19] border border-stone-850 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#00C7B5]/30 transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/camping table.png"
                  alt="시크릿 포구 라운지"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B19] to-transparent opacity-60" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-[#00C7B5] uppercase block">Object 02</span>
                <div className="space-y-2 flex-1">
                  <strong className="text-[21.6px] md:text-[24px] font-bold text-white block mb-2">시크릿 포구 라운지</strong>
                  <p className="text-sm sm:text-base md:text-lg text-stone-200 leading-relaxed font-normal break-keep">
                    시크릿 포구 라운지: 매일 가장 아름답고 조용한 로컬 포구로 안내합니다. 결이 맞는 사람들과 캠핑 의자에 기대어 나누는 깊고 낭만적인 대화.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#070B19] border border-stone-850 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#00C7B5]/30 transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/silent table.png"
                  alt="사일런트 뮤직 믹싱"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B19] to-transparent opacity-60" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-[#00C7B5] uppercase block">Object 03</span>
                <div className="space-y-2 flex-1">
                  <strong className="text-[21.6px] md:text-[24px] font-bold text-white block mb-2">사일런트 뮤직 믹싱</strong>
                  <p className="text-sm sm:text-base md:text-lg text-stone-200 leading-relaxed font-normal break-keep">
                    사일런트 뮤직 믹싱: 어색함이 감돌 땐, 호스트가 큐레이션 한 음악을 무선 헤드셋으로 다 함께 감상하며 밤바다에 완벽히 몰입합니다.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= SECTION 6: FAQ ================= */}
        <section className="px-6 py-24 bg-[#070B19] border-t border-stone-900">
          <div className="text-center space-y-3 mb-12 max-w-3xl mx-auto">
            <HelpCircle className="w-8 h-8 text-[#00C7B5] mx-auto opacity-80" />
            <h2 className="text-2xl font-bold text-white font-sans">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-stone-850 rounded-2xl overflow-hidden bg-[#04060F]/60 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center p-5 text-left font-sans focus:outline-none cursor-pointer hover:bg-stone-900/40 transition-colors"
                  >
                    <span className="text-base sm:text-lg md:text-xl font-bold text-white break-keep pr-4">{faq.q}</span>
                    <span className="text-[#00C7B5] flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-base sm:text-lg text-stone-300 leading-relaxed font-sans border-t border-stone-900/30 break-keep font-light">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <div className="bg-[#04060F]">
          <Footer />
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pt-4 pb-8 bg-gradient-to-t from-[#04060F] via-[#04060F]/95 to-transparent z-50">
          <button
            onClick={handleCtaClick}
            className="w-full bg-[#00C7B5] text-white py-4 rounded-xl font-bold text-base shadow-[0_8px_30px_rgba(0,199,181,0.4)] hover:bg-[#00b2a2] active:scale-[0.98] transition-all duration-200 cursor-pointer text-center tracking-wide"
          >
            [포구 밤크닉 초대장 신청하기]
          </button>
        </div>

      </div>
    </div>
  );
}
