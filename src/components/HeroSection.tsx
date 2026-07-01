import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Check,
  Shield,
  Lock,
  FileText
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
      q: "쿠폰(보물)은 어디서 사용하나요?",
      a: "취향이 가장 잘 반영된 최고급 오션뷰 카페나 로컬 맛집의 2인 전용 식사/디저트권이 제공됩니다. 추가 비용 없이 두 분만의 시간을 즐기시면 됩니다."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-stone-950 flex flex-col items-center">
      {/* Mobile Outer Container: Centered on desktop, restricted to max-w-md */}
      <div className="w-full max-w-md min-h-screen bg-white text-gray-900 flex flex-col relative border-x border-gray-100 shadow-2xl overflow-x-hidden animate-fadeIn">

        {/* Section 1: Main Hero 1 (Slider BG - Dark Gradient Overlay & Overline) */}
        <section className="relative h-[80vh] flex flex-col justify-end px-6 pb-20 overflow-hidden bg-stone-950">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bright.png')" }}
          />

          {/* Dark Gradient Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />

          {/* Main Hook Copy with Overline */}
          <div className="relative z-10">
            {/* Trust Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-[#00C7B5]/30 text-white text-[11px] font-bold rounded-full shadow-lg">
              <span className="text-[#00C7B5]">🛡️</span>
              <span>100% 직장/신원 인증 완료된 분만 매칭됩니다</span>
            </div>

            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              JEJU SECRET TRAVEL
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[25px] font-extrabold leading-snug drop-shadow-lg text-white break-keep tracking-tight"
            >
              시끄러운 게하 파티는 싫고,<br />
              혼술바는 부담스러운 사람들을 위한<br />
              <span className="text-[#00C7B5]">제주 비밀 여행.</span>
            </motion.h1>
          </div>
        </section>

        {/* Section 2: Main Hero 2 (Romance Provocation - Italic Serif & Overline) */}
        <section className="relative h-[65vh] flex flex-col justify-center items-center px-8 text-center overflow-hidden bg-stone-950">
          {/* Night Romance Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/hero-romance.png')` }}
          />
          {/* Light overlay on dark background to ensure visibility while keeping contrast */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Romance Copy with Overline */}
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-rose-500 uppercase mb-3 block">
              ROMANTIC ENCOUNTER
            </span>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl font-serif italic text-white tracking-wide leading-relaxed break-keep px-4 drop-shadow-md"
            >
              영화와 같은 운명적인
              <br />
              만남이 시작됩니다
            </motion.h2>
          </div>
        </section>

        {/* Section 3: Persona Section (옅은 크림색 배경) */}
        <section className="px-6 py-20 bg-stone-50 border-b border-gray-100/50 flex flex-col items-center">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              PERSONA
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug break-keep tracking-tight font-sans">
              이런 분들을 위한<br />제주 비밀 여행입니다.
            </h2>
          </div>

          <div className="w-full space-y-4 max-w-sm">
            {[
              "억지 텐션을 끌어올려야 하는 시끄러운 게하 파티에 지친 분",
              "혼자 가는 제주 여행, 밥 한 끼/술 한 잔 같이할 결이 맞는 동행이 고픈 분",
              "내향적(I)이라서 다수와의 만남보다 1:1, 혹은 소규모의 깊은 대화가 편한 분",
              "영화 속 주인공처럼 낯선 장소에서 시작되는 로맨틱한 우연을 꿈꾸는 분"
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-white border border-stone-200/60 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-[#00C7B5]/10 flex items-center justify-center text-[#00C7B5] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                <p className="text-sm font-medium text-gray-700 leading-relaxed break-keep font-sans">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Cinematic Journey Section (우아한 레이아웃) */}
        <section className="px-6 py-20 bg-white border-b border-gray-100 flex flex-col items-center">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              CINEMATIC JOURNEY
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug tracking-tight font-serif break-keep">
              시그널 트립,<br />이렇게 영화가 시작됩니다
            </h2>
          </div>

          <div className="w-full space-y-16 max-w-sm">
            {/* Scene 1 */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              >
                <img
                  src="/images/bg-architecture.png"
                  alt="나의 여행 취향 기록하기 "
                  className="w-full h-48 sm:h-56 object-cover"
                />
              </motion.div>
              <div className="space-y-2 px-1 text-left">
                <span className="text-xs font-bold tracking-wider text-rose-500 block uppercase font-mono">
                  🎬 Scene 1
                </span>
                <h3 className="text-lg font-bold text-gray-900 break-keep font-serif">
                  나의 여행 취향 기록하기
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed break-keep font-sans">
                  복잡한 스펙 대신, 당신이 제주에서 느끼고 싶은 분위기, 좋아하는 음악, 선호하는 대화의 온도를 들려주세요. 당신의 결에 완벽히 맞는 단 한 명의 여행 메이트를 찾기 위한 첫걸음입니다.
                </p>
              </div>
            </div>

            {/* Scene 2 */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              >
                <img
                  src="/images/scene2_invitation.png"
                  alt="운명적인 시크릿 초대장 도착 (D-3)"
                  className="w-full h-48 sm:h-56 object-cover"
                />
              </motion.div>
              <div className="space-y-2 px-1 text-left">
                <span className="text-xs font-bold tracking-wider text-rose-500 block uppercase font-mono">
                  💌 Scene 2
                </span>
                <h3 className="text-lg font-bold text-gray-900 break-keep font-serif">
                  운명적인 시크릿 초대장 도착 (D-3)
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed break-keep font-sans">
                  여행 3일 전, 두 사람만을 위해 준비된 완벽한 장소와 시크릿 시그널(예: 왼손에 반으로 접은 팜플렛)이 담긴 초대장이 도착합니다.
                </p>
              </div>
            </div>

            {/* Scene 3 */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              >
                <img
                  src="/images/serendipity.png"
                  alt="우연을 가장한, 완벽한 타이밍의 만남 (D-Day)"
                  className="w-full h-48 sm:h-56 object-cover"
                />
              </motion.div>
              <div className="space-y-2 px-1 text-left">
                <span className="text-xs font-bold tracking-wider text-rose-500 block uppercase font-mono">
                  ⏳ Scene 3
                </span>
                <h3 className="text-lg font-bold text-gray-900 break-keep font-serif">
                  우연을 가장한, 완벽한 타이밍의 만남 (D-Day)
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed break-keep font-sans">
                  "오후 5시 정각, 서쪽 창문의 노을빛이 그림에 닿는 순간." 시그널 트립이 설계한 미션 장소에서 똑같은 시그널을 들고 있는 상대방을 발견하세요. 넓은 공간을 헤맬 필요 없이, 가장 아름다운 찰나의 순간에 영화 같은 만남이 시작됩니다.
                </p>
              </div>
            </div>

            {/* Scene 4 */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              >
                <img
                  src="/images/bg-dining.png"
                  alt="취향이 담긴 공간에서 이어지는 대화"
                  className="w-full h-48 sm:h-56 object-cover"
                />
              </motion.div>
              <div className="space-y-2 px-1 text-left">
                <span className="text-xs font-bold tracking-wider text-rose-500 block uppercase font-mono">
                  🥂 Scene 4
                </span>
                <h3 className="text-lg font-bold text-gray-900 break-keep font-serif">
                  취향이 담긴 공간에서 이어지는 대화
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed break-keep font-sans">
                  서로를 알아본 순간, 두 사람만을 위해 준비된 제주의 숨은 미식 공간(F&B) 보물이 공개됩니다. 뻔한 맛집이 아닌, 두 사람의 취향을 저격할 프라이빗한 공간에서 깊은 대화를 이어가세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4.5: How It Works Section (세로형 원형 라인 일러스트 스타일로 복구) */}
        <section className="px-6 py-28 bg-gray-50 border-b border-gray-100">
          <div className="space-y-3 mb-16 text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl font-bold mb-10 text-center break-keep text-gray-900 leading-snug">
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
                className="w-48 h-48 rounded-full border-2 border-[#00C7B5] bg-white flex items-center justify-center mx-auto shadow-md"
              >
                <img
                  src="/images/step1-clipboard.png"
                  className="w-32 h-32 object-contain"
                  alt="Step 1 일러스트"
                />
              </motion.div>
              <div className="text-sm font-bold text-[#00C7B5] tracking-widest mt-8">STEP 01</div>
              <h3 className="text-xl font-extrabold text-gray-900 mt-2 break-keep">무료 참가 신청</h3>
              <p className="text-base font-medium text-gray-800 mt-4 leading-relaxed break-keep px-4">
                나의 여행 취향을 체크하고 가벼운 마음으로 신청해 주세요. 결제는 나와 핏이 맞는 메이트가 매칭된 후에만 진행되니 안심하셔도 좋습니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="w-48 h-48 rounded-full border-2 border-[#00C7B5] bg-white flex items-center justify-center mx-auto shadow-md"
              >
                <img
                  src="/images/step2-unlock.png"
                  className="w-32 h-32 object-contain"
                  alt="Step 2 일러스트"
                />
              </motion.div>
              <div className="text-sm font-bold text-[#00C7B5] tracking-widest mt-8">STEP 02</div>
              <h3 className="text-xl font-extrabold text-gray-900 mt-2 break-keep">웹앱 로그인 및 초대장 확인</h3>
              <p className="text-base font-medium text-gray-800 mt-4 leading-relaxed break-keep px-4">
                매칭이 성사되면 시그널 트립 전용 웹앱 접속 링크가 문자로 발송됩니다. 로그인하여 나의 여행 메이트 힌트와 시크릿 미션 장소를 확인하세요.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="w-48 h-48 rounded-full border-2 border-[#00C7B5] bg-white flex items-center justify-center mx-auto shadow-md"
              >
                <img
                  src="/images/step3-qr.png"
                  className="w-32 h-32 object-contain"
                  alt="Step 3 일러스트"
                />
              </motion.div>
              <div className="text-sm font-bold text-[#00C7B5] tracking-widest mt-8">STEP 03</div>
              <h3 className="text-xl font-extrabold text-gray-900 mt-2 break-keep">약속 장소로 이동 & 미션 시작</h3>
              <p className="text-base font-medium text-gray-800 mt-4 leading-relaxed break-keep px-4">
                D-Day, 설레는 마음으로 제주도의 약속 장소로 이동합니다. 초대장에 적힌 시그널을 단서로 나만의 여행 메이트를 찾아보세요.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="w-48 h-48 rounded-full border-2 border-[#00C7B5] bg-white flex items-center justify-center mx-auto shadow-md"
              >
                <img
                  src="/images/step4-ticket.png"
                  className="w-32 h-32 object-contain"
                  alt="Step 4 일러스트"
                />
              </motion.div>
              <div className="text-sm font-bold text-[#00C7B5] tracking-widest mt-8">STEP 04</div>
              <h3 className="text-xl font-extrabold text-gray-900 mt-2 break-keep">프로필 교환 및 프라이빗 다이닝</h3>
              <p className="text-base font-medium text-gray-800 mt-4 leading-relaxed break-keep px-4">
                서로를 알아보고 QR코드를 스캔하면, 숨겨져 있던 진짜 프로필이 열립니다. 이제 준비된 F&B 공간에서 맛있는 음식과 함께 편안한 대화를 나누세요.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4.7: Virtual Persona (Matching Preview) Section */}
        <section className="px-6 py-28 bg-stone-50 border-b border-gray-100 flex flex-col items-center">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              MATCHING PREVIEW
            </span>
            <h2 className="text-2xl font-serif font-extrabold text-gray-900 leading-snug break-keep tracking-tight">
              당신이 만나게 될지도 모르는 누군가
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed break-keep px-4 font-sans font-light">
              엄격한 취향 심사를 통과한, 매력적이고 결이 맞는 분들이 시그널 트립을 기다리고 있습니다.
            </p>
          </div>

          {/* Swipe Indicator (Visual Cue) */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#00C7B5] mb-6 tracking-wider bg-[#00C7B5]/5 px-3.5 py-1.5 rounded-full border border-[#00C7B5]/10 w-fit mx-auto shadow-sm">
            <span>옆으로 넘겨보세요</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="inline-block"
            >
              →
            </motion.span>
          </div>

          {/* Cards container: Horizontal scroll layout on all viewports since the page is enclosed in max-w-md */}
          <div className="w-full flex overflow-x-auto gap-4 snap-x snap-mandatory pb-6 flex-nowrap scrollbar-none px-4">
            {/* Card 1 */}
            <div className="w-[280px] flex-shrink-0 snap-center bg-white border border-stone-100 rounded-2xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative w-full aspect-[4/5] object-cover overflow-hidden">
                <img
                  src="/images/profile-man.png"
                  alt="건축 디자이너"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#00C7B5] block mb-1">MEMBER PROFILE</span>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 font-sans">건축 디자이너 <span className="text-xs font-normal text-gray-500">(30세 / 남)</span></h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[11px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-1 rounded-full">#차분함</span>
                    <span className="text-[11px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-1 rounded-full">#계획형</span>
                    <span className="text-[11px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-1 rounded-full">#미술관_산책</span>
                  </div>
                </div>
                <div className="border-t border-stone-100 pt-4 mt-auto">
                  <p className="text-xs text-gray-600 leading-relaxed break-keep font-serif italic text-center">
                    "시끄러운 술자리보다는, 조용한 공간에서 건축과 공간에 대한 깊은 대화를 나누는 걸 좋아합니다."
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-[280px] flex-shrink-0 snap-center bg-white border border-stone-100 rounded-2xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative w-full aspect-[4/5] object-cover overflow-hidden">
                <img
                  src="/images/profile-girl.png"
                  alt="스타트업 마케터"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#00C7B5] block mb-1">MEMBER PROFILE</span>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 font-sans">스타트업 마케터 <span className="text-xs font-normal text-gray-500">(28세 / 여)</span></h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[11px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-1 rounded-full">#다정함</span>
                    <span className="text-[11px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-1 rounded-full">#경청</span>
                    <span className="text-[11px] font-bold text-[#00C7B5] bg-[#00C7B5]/10 px-2.5 py-1 rounded-full">#내추럴와인</span>
                  </div>
                </div>
                <div className="border-t border-stone-100 pt-4 mt-auto">
                  <p className="text-xs text-gray-600 leading-relaxed break-keep font-serif italic text-center">
                    "잘 알려진 관광지보다는 로컬들만 아는 숨겨진 골목길의 와인바를 찾아내는 것에 설렘을 느껴요."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Trust & Safety Section */}
        <section className="px-6 py-28 bg-zinc-900 text-white flex flex-col items-center">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              TRUST & SAFETY
            </span>
            <h2 className="text-xl font-extrabold text-stone-100 leading-snug tracking-tight break-keep font-sans px-2">
              아무나 탑승할 수 없는,<br />가장 안전하고 프라이빗한 매칭
            </h2>
          </div>

          <div className="w-full space-y-5 max-w-sm">
            {[
              {
                icon: Shield,
                title: "깐깐한 취향 심사",
                desc: "단순 신청이 아닌, 심층 인터뷰를 통해 무개념/비매너 유저를 1차로 필터링합니다."
              },
              {
                icon: Lock,
                title: "신원 검증 프로세스",
                desc: "매칭이 성사된 합격자에 한해 직장/학생 신분 인증(KYC)을 거친 후 최종 결제가 진행됩니다."
              },
              {
                icon: FileText,
                title: "3대 클린 서약",
                desc: "노쇼, 무단 이탈, 비매너를 엄격히 금지하는 서약서에 동의한 분들만 모여 안전을 보장합니다."
              }
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-zinc-800/40 border border-zinc-700/40 rounded-2xl p-6 flex flex-col items-center text-center shadow-md hover:border-zinc-600/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700/30 flex items-center justify-center text-[#00C7B5] mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-stone-150 mb-2 font-sans">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans font-light break-keep px-2">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Pricing & FAQ (White Background - Font scaled 30%) */}
        <section className="px-6 py-28 bg-white">
          {/* FAQ Accordion UI */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">
              자주 묻는 질문
            </h2>

            <div className="space-y-4">
              {faqData.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex justify-between items-center p-5 text-left font-sans focus:outline-none cursor-pointer hover:bg-gray-100/50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-gray-900 break-keep">{faq.q}</span>
                      <span className="text-[#00C7B5] flex-shrink-0 ml-2">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-5 pt-0 text-base text-gray-700 leading-relaxed font-sans border-t border-gray-100 break-keep bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premium Pricing Card Widget (Shadow rich design) */}
          <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-10 mt-16 mb-24 text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 mb-4 block">
              PARTICIPATION FEE
            </span>
            <div className="text-xl font-extrabold text-[#00C7B5] mb-2 mt-4">
              1인 참가비 : 35,000원
            </div>
            <p className="text-sm text-gray-500 font-sans">
              왕복 항공료와 숙박비는 포함되어 있지 않아요
            </p>
            <p className="text-xs text-[#00C7B5] font-bold mt-4 break-keep leading-relaxed">
              * 초기 신청 및 심사는 100% 무료이며, 매칭 성사 시에만 참가비(35,000원) 결제가 진행됩니다.
            </p>
          </div>
        </section>

        {/* Footer (Rendered on white background at the bottom) */}
        <div className="bg-white">
          <Footer />
        </div>

        {/* Section 6: Sticky Bottom CTA (Floating Button) */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pt-4 pb-8 bg-gradient-to-t from-black/80 to-transparent z-50">
          <button
            onClick={handleCtaClick}
            className="w-3/4 max-w-xs mx-auto block bg-[#00C7B5] text-white py-3.5 rounded-xl font-bold text-base shadow-xl hover:brightness-105 active:scale-[0.99] transition-all duration-200 cursor-pointer text-center"
          >
            시그널 트립 무료로 탑승하기
          </button>
          <p className="text-[10px] text-stone-300 text-center mt-2 px-6 break-keep font-sans opacity-90 drop-shadow-md">
            * 초기 신청 및 심사는 100% 무료이며, 매칭 성사 시에만 참가비(35,000원) 결제가 진행됩니다.
          </p>
        </div>

      </div>
    </div>
  );
}
