import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
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

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout');
    }
    onOpenRegistration();
  };

  const faqData = [
    {
      q: "혼자 신청해도 되나요?",
      a: "네, 시그널 트립은 오직 혼자 여행 오신 분들(1인 신청자)만을 위한 서비스입니다. 일행이 있으신 분은 참여가 불가능합니다."
    },
    {
      q: "매칭 기준이 어떻게 되나요?",
      a: "작성해주신 전시, 체험, F&B 선호도와 여행 스타일 데이터를 종합적으로 분석하여 99% 취향이 일치하는 단 한 명의 여행 메이트를 시스템이 선별합니다."
    },
    {
      q: "티타임 후 마음에 들지 않으면 연락처를 줘야 하나요?",
      a: "아니요. 연락처는 현장에서 교환하지 않습니다. 티타임 종료 2시간 후 시스템을 통해 서로 '수락'을 누른 경우에만 연락처가 공개되므로 거절의 민망함이 전혀 없습니다."
    },
    {
      q: "연락처도 없는데 사진만 보고 서로 어떻게 알아보죠? 못 찾으면 어떡하죠?",
      a: "도착 직전, 시스템을 통해 서로의 '오늘의 착장 정보(예: 하얀색 셔츠, 베이지색 가디건)'를 간단히 입력하게 됩니다. 약속 장소에 도착해 버튼을 누르는 순간 프로필과 함께 착장 정보가 공개되어 영화처럼 자연스럽게 마주할 수 있습니다. 만일의 상황을 대비해 운영진이 '3분 거리'에 대기 중이니 안심하셔도 좋습니다."
    },
    {
      q: "만남 시 운영진이 동행하나요? 단둘이 만나면 어색하거나 위험하진 않을까요?",
      a: "어색한 아이스브레이킹이나 운영진의 개입은 전혀 없습니다. 웹앱의 안내에 따라 두 분이서만 자연스럽게 티타임을 진행합니다. 단, 안전과 돌발 상황에 대비해 운영진이 항상 만남 장소 '3분 거리'에서 밀착 대기하며 즉각 도와드리니 안심하셔도 좋습니다."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] flex flex-col items-center">
      {/* Mobile Outer Container: Centered on desktop, restricted to max-w-md */}
      <div className="w-full max-w-md min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col relative border-x border-stone-200/40 shadow-2xl overflow-x-hidden animate-fadeIn pb-24">

        {/* Section 1: Hero 1 (Bright & Emotional - hero-bright.png - Bottom Align, Badge Removed) */}
        <section className="relative h-[80vh] flex flex-col justify-end px-6 pb-20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bright.png')" }}
          />

          {/* Warm/Light Overlay for Contrast */}
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF8F5]/30 to-[#FAF8F5]" />

          {/* Main Hook Copy */}
          <div className="relative z-10 text-left">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00A896] uppercase mb-3 block">
              JEJU SECRET TRAVEL
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[28px] sm:text-[32px] font-extrabold leading-snug text-stone-900 break-keep tracking-tight font-serif"
            >
              나의 완벽한 반쪽을 찾는,<br />
              제주에서의 가장 로맨틱한 보물찾기
            </motion.h1>
          </div>
        </section>

        {/* Section 1.5: Hero 2 (Directly below Hero 1 - serendipity.png - Black Overlay, White Text & Mint Highlights) */}
        <section className="relative h-[60vh] flex flex-col justify-end px-6 pb-16 overflow-hidden border-t border-stone-200/20">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/serendipity.png')" }}
          />

          {/* Dark Overlay for Text legibility */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

          {/* Sub Copy */}
          <div className="relative z-10 text-left">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-2 block font-mono">
              ROMANTIC TEA TIME
            </span>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans break-keep"
            >
              시끄러운 게하 파티, 어두운 술집의 어색함은 뺐어요.<br />
              오직 대화에 집중할 수 있는 제주의 프라이빗 공간에서 검증된 인연을 만나보세요.
            </motion.p>
          </div>
        </section>

        {/* Section 2: 실시간 대기자 스펙 리스트 (남녀 혼합 Social Proof - 사진 없음, 나이 수정) */}
        <section className="px-6 py-12 bg-[#FAF8F5] border-b border-stone-200/30 flex flex-col items-center">
          <div className="text-center space-y-2 mb-6">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#00C7B5] uppercase block">
              MATCHING WAITLIST
            </span>
            <h2 className="text-xl font-extrabold text-stone-900 leading-snug tracking-tight font-sans break-keep">
              당신과의 취향 매칭을 기다리는 분들입니다
            </h2>
          </div>

          {/* Swipe Indicator (Visual Cue) */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#00C7B5] mb-5 tracking-wider bg-[#00C7B5]/5 px-3.5 py-1.5 rounded-full border border-[#00C7B5]/10 w-fit mx-auto shadow-sm">
            <span>옆으로 넘겨보세요</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="inline-block"
            >
              →
            </motion.span>
          </div>

          {/* Horizontal Scroll Cards Container */}
          <div className="w-full flex overflow-x-auto gap-4 snap-x snap-mandatory pb-6 flex-nowrap scrollbar-none px-2">
            {/* Card 1: Male (Age: 28세) */}
            <div className="w-[260px] flex-shrink-0 snap-center bg-white border border-stone-200/60 rounded-2xl shadow-sm flex flex-col p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-extrabold font-mono">
                  M
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#00C7B5] block">MEMBER SPECS</span>
                  <span className="text-xs text-stone-500 font-semibold">28세 / 남</span>
                </div>
              </div>
              <div className="space-y-2 mb-4 flex-grow text-left">
                <h4 className="text-base font-extrabold text-stone-900 font-sans">대기업 기획자</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#ENTP</span>
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#기획자</span>
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#논리적</span>
                </div>
              </div>
              <div className="border-t border-stone-100 pt-4 mt-auto">
                <p className="text-xs text-stone-600 leading-relaxed font-serif italic text-center break-keep">
                  "논리적이지만 다정한 편입니다."
                </p>
              </div>
            </div>

            {/* Card 2: Female */}
            <div className="w-[260px] flex-shrink-0 snap-center bg-white border border-stone-200/60 rounded-2xl shadow-sm flex flex-col p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-sm font-extrabold font-mono">
                  W
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#00C7B5] block">MEMBER SPECS</span>
                  <span className="text-xs text-stone-500 font-semibold">28세 / 여</span>
                </div>
              </div>
              <div className="space-y-2 mb-4 flex-grow text-left">
                <h4 className="text-base font-extrabold text-stone-900 font-sans">외국계 기업</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#INFJ</span>
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#외국계</span>
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#맛집투어</span>
                </div>
              </div>
              <div className="border-t border-stone-100 pt-4 mt-auto">
                <p className="text-xs text-stone-600 leading-relaxed font-serif italic text-center break-keep">
                  "제주도 숨은 맛집과 카페 투어를 좋아해요."
                </p>
              </div>
            </div>

            {/* Card 3: Male (Age: 30세) */}
            <div className="w-[260px] flex-shrink-0 snap-center bg-white border border-stone-200/60 rounded-2xl shadow-sm flex flex-col p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-extrabold font-mono">
                  M
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#00C7B5] block">MEMBER SPECS</span>
                  <span className="text-xs text-stone-500 font-semibold">30세 / 남</span>
                </div>
              </div>
              <div className="space-y-2 mb-4 flex-grow text-left">
                <h4 className="text-base font-extrabold text-stone-900 font-sans">전문직</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#ESFJ</span>
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#의료계</span>
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#소통</span>
                </div>
              </div>
              <div className="border-t border-stone-100 pt-4 mt-auto">
                <p className="text-xs text-stone-600 leading-relaxed font-serif italic text-center break-keep">
                  "대화의 티키타카가 잘 맞는 분을 찾습니다."
                </p>
              </div>
            </div>

            {/* Card 4: Female */}
            <div className="w-[260px] flex-shrink-0 snap-center bg-white border border-stone-200/60 rounded-2xl shadow-sm flex flex-col p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-sm font-extrabold font-mono">
                  W
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#00C7B5] block">MEMBER SPECS</span>
                  <span className="text-xs text-stone-500 font-semibold">29세 / 여</span>
                </div>
              </div>
              <div className="space-y-2 mb-4 flex-grow text-left">
                <h4 className="text-base font-extrabold text-stone-900 font-sans">디자이너</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#ISFP</span>
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#디자이너</span>
                  <span className="text-[10px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-0.5 rounded-full">#전시회</span>
                </div>
              </div>
              <div className="border-t border-stone-100 pt-4 mt-auto">
                <p className="text-xs text-stone-600 leading-relaxed font-serif italic text-center break-keep">
                  "전시회 관람 and 조용한 산책을 즐겨요."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Persona Section (옅은 크림색 배경 - 타이틀 및 항목 전면 수정) */}
        <section className="px-6 py-20 bg-[#FAF7F2] border-b border-stone-200/40 flex flex-col items-center">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              PERSONA
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 leading-snug break-keep tracking-tight font-sans">
              이런 분들에게 추천드려요
            </h2>
          </div>

          <div className="w-full space-y-4 max-w-sm">
            {[
              "억지 텐션을 끌어올려야 하는 시끄러운 게하 파티에 지친 분",
              "운영진의 어색한 개입 없이, 오직 두 사람만 자연스럽게 알아가고 싶은 분",
              "카메라나 타인의 시선이 집중되는 그룹 모임이 부담스러운 분",
              "다수와의 얕은 만남보다, 1:1로 온전히 대화에 집중하고 싶은 분"
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-white border border-stone-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-[#00C7B5]/10 flex items-center justify-center text-[#00C7B5] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                <p className="text-base font-medium text-stone-700 leading-relaxed break-keep font-sans text-left">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: 시네마틱 여정 (D-Day 타임라인 및 16:9 비율 강제 통일, 폰트 크기 및 색상 조정) */}
        <section className="px-6 py-20 bg-white border-b border-stone-200/40 flex flex-col items-center">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              CINEMATIC JOURNEY
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 leading-snug tracking-tight font-serif break-keep">
              시그널 트립, D-Day 여정
            </h2>
          </div>

          <div className="w-full space-y-16 max-w-sm">
            {/* Scene 1: Aspect Ratio forced to 16:9 (aspect-video) */}
            <div className="flex flex-col gap-6 text-left">
              <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-stone-200/40 bg-stone-50">
                <img
                  src="/images/ChatGPT Image 2026년 6월 8일 오후 05_23_36.png"
                  alt="나의 완벽한 반쪽 매칭"
                  className="w-full aspect-video object-cover rounded-xl"
                />
              </div>
              <div className="space-y-2 px-1">
                <span className="text-lg md:text-xl font-bold tracking-wider text-stone-900 block font-sans">
                  🎬 Scene 1. (D-7) 나의 완벽한 반쪽 매칭
                </span>
                <p className="text-base text-gray-600 leading-relaxed break-keep font-sans">
                  선택하신 여행 날짜 일주일 전, 수많은 데이터 중 당신의 취향과 가장 잘 맞는 단 한 사람을 찾아 매칭 완료 초대장을 발송합니다.
                </p>
              </div>
            </div>

            {/* Scene 2: Aspect Ratio forced to 16:9 (aspect-video) */}
            <div className="flex flex-col gap-6 text-left">
              <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-stone-200/40 bg-stone-50">
                <img
                  src="/images/ChatGPT Image 2026년 7월 3일 오후 05_41_28.png"
                  alt="프라이빗 공간 안내"
                  className="w-full aspect-video object-cover rounded-xl"
                />
              </div>
              <div className="space-y-2 px-1">
                <span className="text-lg md:text-xl font-bold tracking-wider text-stone-900 block font-sans">
                  🎬 Scene 2. (D-3) 프라이빗 공간 안내
                </span>
                <p className="text-base text-gray-600 leading-relaxed break-keep font-sans">
                  약속일 3일 전, 시끄러운 곳을 벗어나 오직 두 사람의 대화에만 집중할 수 있는 제주의 프리미엄 오션뷰 카페 위치가 공개됩니다.
                </p>
              </div>
            </div>

            {/* Scene 3: Aspect Ratio forced to 16:9 (aspect-video) */}
            <div className="flex flex-col gap-6 text-left">
              <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-stone-200/40 bg-stone-50">
                <img
                  src="/images/ChatGPT Image 2026년 7월 3일 오후 05_42_37.png"
                  alt="영화 같은 마주침"
                  className="w-full aspect-video object-cover rounded-xl"
                />
              </div>
              <div className="space-y-2 px-1">
                <span className="text-lg md:text-xl font-bold tracking-wider text-stone-900 block font-sans">
                  🎬 Scene 3. (D-Day) 영화 같은 마주침
                </span>
                <p className="text-base text-gray-600 leading-relaxed break-keep font-sans">
                  약속 장소에 도착해 '도착 버튼'을 누르는 순간 상대방의 프로필이 열립니다. 어색한 식사 자리를 생략한 완벽한 1:1 티타임이 시작됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4.3: 만남 장소 프리뷰 (공간에 대한 두려움 제거) */}
        <section className="px-6 py-20 bg-[#FCFAF7] border-b border-stone-200/40 flex flex-col items-center">
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              VERIFIED PLACE
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 leading-snug tracking-tight font-serif break-keep">
              운영진이 검증한 매칭 공간
            </h2>
            <p className="text-base text-stone-600 leading-relaxed font-sans break-keep font-medium px-4">
              시끄러운 술집이 아니에요. 나와 가장 잘 맞는 분과 대화에 온전히 집중할 수 있는 프라이빗한 공간에서 1:1 티타임이 진행됩니다.
            </p>
          </div>

          <div className="w-full space-y-8 max-w-sm mt-4">
            {/* Space 1: Cafe */}
            <div className="flex flex-col gap-4 bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img
                src="/images/cafe.png"
                alt="오션뷰 카페"
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-2 text-left">
                <h4 className="text-base font-bold text-stone-900 font-serif">바다가 한눈에 담기는 오션뷰 카페</h4>
                <p className="text-sm text-stone-600 leading-relaxed break-keep font-sans">
                  서로의 첫인상과 시그널을 확인하며, 탁 트인 제주 바다와 함께 아늑한 티타임을 시작하는 검증된 프리미엄 공간입니다.
                </p>
              </div>
            </div>

            {/* Space 2: Terrace */}
            <div className="flex flex-col gap-4 bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img
                src="/images/terrace.png"
                alt="프라이빗 테라스"
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-2 text-left">
                <h4 className="text-base font-bold text-stone-900 font-serif">노을빛이 스며드는 테라스</h4>
                <p className="text-sm text-stone-600 leading-relaxed break-keep font-sans">
                  노을과 선선한 제주 바람을 느끼며 차분하게 마주 앉아 온전히 상대방에게 집중할 수 있는 프라이빗 테라스 공간입니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4.4: 4가지 정밀 매칭 & 안전 보장 (매칭 신뢰성 명세 섹션 - 세로 1열 리디자인) */}
        <section className="px-6 py-20 bg-[#FCFAF7] border-b border-stone-200/40 flex flex-col items-center">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block font-mono">
              MATCHING SYSTEM
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug tracking-tight font-serif break-keep px-2">
              나의 완벽한 반쪽을 찾는<br />
              <span className="text-[#00C7B5]">4가지 정밀 매칭 & 안전 보장</span>
            </h2>
            <p className="text-base md:text-lg font-medium text-stone-600 leading-relaxed font-sans break-keep px-4">
              직관이나 단순 신청이 아닌, 정교한 취향 분석과 철저한 안전 검증 시스템을 제공합니다.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            {/* Card 1 */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 flex flex-row items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-sm cursor-pointer w-full">
              <div className="w-12 h-12 rounded-full bg-[#00C7B5]/10 flex items-center justify-center shrink-0">
                <span className="text-2xl">🪪</span>
              </div>
              <div className="flex flex-col space-y-1 text-left">
                <h4 className="text-lg font-bold text-stone-900">철저한 신원 인증 (KYC)</h4>
                <p className="text-base text-stone-600 leading-relaxed font-sans break-keep">
                  직장·학생 신분 증빙을 통과한 검증된 매너 유저만 매칭됩니다.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 flex flex-row items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-sm cursor-pointer w-full">
              <div className="w-12 h-12 rounded-full bg-[#00C7B5]/10 flex items-center justify-center shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex flex-col space-y-1 text-left">
                <h4 className="text-lg font-bold text-stone-900">5대 핵심 취향 매핑</h4>
                <p className="text-base text-stone-600 leading-relaxed font-sans break-keep">
                  대화 온도, 여행 스타일, 미식 취향을 분석해 결이 맞는 반쪽을 찾습니다.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 flex flex-row items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-sm cursor-pointer w-full">
              <div className="w-12 h-12 rounded-full bg-[#00C7B5]/10 flex items-center justify-center shrink-0">
                <span className="text-2xl">🌊</span>
              </div>
              <div className="flex flex-col space-y-1 text-left">
                <h4 className="text-lg font-bold text-stone-900">프라이빗 감성 공간 큐레이션</h4>
                <p className="text-base text-stone-600 leading-relaxed font-sans break-keep">
                  복잡한 동선 없이, 둘만의 대화에 집중할 수 있는 감성 공간을 매핑합니다.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 flex flex-row items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-sm cursor-pointer w-full">
              <div className="w-12 h-12 rounded-full bg-[#00C7B5]/10 flex items-center justify-center shrink-0">
                <span className="text-2xl">☕</span>
              </div>
              <div className="flex flex-col space-y-1 text-left">
                <h4 className="text-lg font-bold text-stone-900">운영진 3분 거리 항시 대기</h4>
                <p className="text-base text-stone-600 leading-relaxed font-sans break-keep">
                  어색함이나 만일의 상황에 대비해 호스트가 3분 거리에 상시 대기하여 안전합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4.5: How It Works Section (진행 순서 전면 수정) */}
        <section className="px-6 py-28 bg-[#FAF7F2] border-b border-stone-200/40">
          <div className="space-y-3 mb-16 text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl font-bold mb-10 text-center break-keep text-stone-900 leading-snug">
              시그널 트립,<br />
              이렇게 진행됩니다
            </h2>
          </div>

          {/* Illust Infographic Steps */}
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="w-48 h-48 rounded-full border-2 border-[#00C7B5] bg-white flex items-center justify-center mx-auto shadow-sm"
              >
                <img
                  src="/images/step1-clipboard.png"
                  className="w-32 h-32 object-contain"
                  alt="Step 1 일러스트"
                />
              </motion.div>
              <div className="text-sm font-bold text-[#00C7B5] tracking-widest mt-8 font-mono">STEP 01</div>
              <h3 className="text-xl font-extrabold text-stone-900 mt-2 break-keep">무료 참가 신청</h3>
              <p className="text-base font-medium text-stone-700 mt-4 leading-relaxed break-keep px-4">
                나의 여행 취향을 체크하고 가벼운 마음으로 신청해 주세요. 나와 핏이 맞는 메이트가 매칭된 후에만 참가비 결제가 진행되니 안심하셔도 좋습니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="w-48 h-48 rounded-full border-2 border-[#00C7B5] bg-white flex items-center justify-center mx-auto shadow-sm"
              >
                <img
                  src="/images/step2-unlock.png"
                  className="w-32 h-32 object-contain"
                  alt="Step 2 일러스트"
                />
              </motion.div>
              <div className="text-sm font-bold text-[#00C7B5] tracking-widest mt-8 font-mono">STEP 02</div>
              <h3 className="text-xl font-extrabold text-stone-900 mt-2 break-keep">웹앱 로그인 및 초대장 확인</h3>
              <p className="text-base font-medium text-stone-700 mt-4 leading-relaxed break-keep px-4">
                매칭이 성사되면 시그널 트립 전용 웹앱 접속 링크가 문자로 발송됩니다. 로그인하여 만남을 시작할 장소를 확인하세요.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="w-48 h-48 rounded-full border-2 border-[#00C7B5] bg-white flex items-center justify-center mx-auto shadow-sm"
              >
                <img
                  src="/images/step3-qr.png"
                  className="w-32 h-32 object-contain"
                  alt="Step 3 일러스트"
                />
              </motion.div>
              <div className="text-sm font-bold text-[#00C7B5] tracking-widest mt-8 font-mono">STEP 03</div>
              <h3 className="text-xl font-extrabold text-stone-900 mt-2 break-keep">약속 장소로 이동 & 프로필 확인</h3>
              <p className="text-base font-medium text-stone-700 mt-4 leading-relaxed break-keep px-4">
                D-Day, 설레는 마음으로 제주도의 약속 장소로 이동해요. 도착 후 버튼을 누르면 상대방의 프로필과 함께 '오늘의 착장 정보'가 공개되어, 인파 속에서도 어색함 없이 단번에 서로를 알아볼 수 있습니다.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="w-48 h-48 rounded-full border-2 border-[#00C7B5] bg-white flex items-center justify-center mx-auto shadow-sm"
              >
                <img
                  src="/images/step4-ticket.png"
                  className="w-32 h-32 object-contain"
                  alt="Step 4 일러스트"
                />
              </motion.div>
              <div className="text-sm font-bold text-[#00C7B5] tracking-widest mt-8 font-mono">STEP 04</div>
              <h3 className="text-xl font-extrabold text-stone-900 mt-2 break-keep">1:1 티타임 진행 후 프로필 교환</h3>
              <p className="text-base font-medium text-stone-700 mt-4 leading-relaxed break-keep px-4">
                서로의 속마음은 티타임 종료 2시간 후 웹앱을 통해 확인해요. 서로 마음이 통했다면 연락처와 실명이 최종 공개됩니다.
              </p>
            </div>
          </div>
        </section>



        {/* Section 6: FAQ & Pricing (Bright Warm theme) */}
        <section className="px-6 py-28 bg-[#FAF8F5]">
          {/* FAQ Accordion UI */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold mb-10 text-center text-stone-900">
              자주 묻는 질문
            </h2>

            <div className="space-y-4">
              {faqData.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-stone-200/50 rounded-xl overflow-hidden bg-[#FAF7F2]/50"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex justify-between items-center p-5 text-left font-sans focus:outline-none cursor-pointer hover:bg-stone-100/50 transition-colors"
                    >
                      <span className="text-base font-bold text-stone-900 break-keep">{faq.q}</span>
                      <span className="text-[#00C7B5] flex-shrink-0 ml-2">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-5 pt-0 text-base text-stone-700 leading-relaxed font-sans border-t border-stone-200/20 break-keep bg-white text-left">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premium Pricing Card Widget (Shadow rich design) */}
          <div className="max-w-sm mx-auto bg-white rounded-3xl border border-stone-200/50 shadow-md p-10 mt-16 mb-24 text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-stone-400 mb-4 block">
              PARTICIPATION FEE
            </span>
            <div className="text-xl font-extrabold text-[#00C7B5] mb-2 mt-4">
              1인 참가비 : 35,000원
            </div>
            <p className="text-sm text-stone-500 font-sans">
              왕복 항공료와 숙박비는 포함되어 있지 않아요
            </p>
            <p className="text-xs text-[#00C7B5] font-bold mt-4 break-keep leading-relaxed">
              * 초기 신청 및 심사는 100% 무료이며, 매칭 성사 시에만 참가비(35,000원) 결제가 진행됩니다.
            </p>
          </div>
        </section>

        {/* Footer (Rendered on white background at the bottom) */}
        <div className="bg-[#FAF8F5]">
          <Footer />
        </div>

        {/* Section 7: Sticky Bottom CTA (Floating Button - Animation Removed, Opacity Hover Added) */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pt-4 pb-8 bg-gradient-to-t from-white via-white/95 to-transparent z-50">
          <button
            onClick={handleCtaClick}
            className="w-3/4 max-w-xs mx-auto block bg-[#00C7B5] text-white py-3.5 rounded-xl font-bold text-base shadow-xl hover:opacity-90 active:scale-[0.99] transition-all duration-200 cursor-pointer text-center"
          >
            시그널 트립 무료로 탑승하기
          </button>
          <p className="text-[10px] text-stone-600 text-center mt-2 px-6 break-keep font-sans font-medium opacity-90 drop-shadow-sm">
            * 초기 신청 및 심사는 100% 무료이며, 매칭 성사 시에만 참가비(35,000원) 결제가 진행됩니다.
          </p>
        </div>

      </div>
    </div>
  );
}
