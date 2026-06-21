import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp
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

        {/* Section 1: Main Hero 1 (Driving BG - Dark Gradient Overlay & Overline) */}
        <section className="relative h-[80vh] flex flex-col justify-end px-6 pb-20 overflow-hidden bg-stone-950">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/driving.png')` }}
          />

          {/* Dark Gradient Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />

          {/* Main Hook Copy with Overline */}
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              JEJU SECRET TRAVEL
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[25px] sm:text-3xl font-extrabold leading-snug drop-shadow-lg text-white break-keep tracking-tight"
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

        {/* Section 3: Value Proposition (White Background - Plain Envelope) */}
        <section className="px-6 py-20 bg-white flex flex-col items-center border-b border-gray-100">
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              SECRET MISSION
            </span>
            <h2 className="text-2xl font-bold mt-12 text-gray-900 leading-snug break-keep font-noto">
              시그널 트립에서 취향이 잘 맞는 여행메이트와 함께 보물을 찾아요
            </h2>
            <p className="text-lg mt-4 text-gray-700 max-w-[340px] mx-auto leading-relaxed break-keep">
              신청서를 분석 후 취향이 가장 잘 맞는 여행메이트를 운명적으로 만나게 됩니다.
            </p>
          </div>

          {/* Envelope Image - Drop shadow 2D depth effect */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full relative px-2"
          >
            <img
              src="/images/invite-envelope.jpg"
              className="w-full max-w-sm mx-auto object-contain mt-10 drop-shadow-2xl"
              alt="초대 편지 봉투"
            />
          </motion.div>
        </section>

        {/* Section 4: Process (제주맥주 스타일 일러스트 인포그래픽 - Light Gray Background - Scaled 30% / 40%) */}
        <section className="px-6 py-20 bg-gray-50 border-b border-gray-100">
          <div className="space-y-3 mb-16 text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-[#00C7B5] uppercase mb-3 block">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl font-bold mb-10 text-center break-keep text-gray-900 leading-snug">
              제주 여행을 준비중인가요?<br />
              시그널 트립은 이렇게 여행이 시작돼요
            </h2>
          </div>

          {/* Illust Infographic Steps */}
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
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
              <h3 className="text-xl font-extrabold text-gray-900 mt-2 break-keep">내 취향 심사 넣기</h3>
              <p className="text-base font-medium text-gray-800 mt-4 leading-relaxed break-keep px-4">
                "신중하게 내 취향을 입력하고 신청하세요. 무개념 유저를 차단하기 위해 꼼꼼한 심사 후 합격자에게만 결제 링크가 전송됩니다."
              </p>
              <div className="mt-4 bg-gray-100 rounded-xl p-4 mx-4 text-sm text-gray-600 leading-relaxed break-keep">
                ✨ 전시, 체험, 선호하는 음식 등 나의 여행 취향을 상세히 입력해 주세요. 이 데이터를 바탕으로 나와 가장 잘 맞는 운명적인 여행 메이트를 찾게 됩니다.
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
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
              <h3 className="text-xl font-extrabold text-gray-900 mt-2 break-keep">D-1, 비밀 미션지 도착</h3>
              <p className="text-base font-medium text-gray-800 mt-4 leading-relaxed break-keep px-4">
                "여행 전날 밤, 99% 취향이 일치하는 여행 메이트와의 만남 장소와 '시크릿 시그널(예: 왼손에 든 팜플렛)'이 도착합니다. 사진과 나이는 아직 비밀입니다."
              </p>
              <div className="mt-4 bg-gray-100 rounded-xl p-4 mx-4 text-sm text-gray-600 leading-relaxed break-keep">
                ✨ 잠긴 자물쇠 아이콘이 열리면서 '내일 오후 2시, 본태박물관'이라는 카카오톡 알림톡 팝업이 도착합니다.
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
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
              <h3 className="text-xl font-extrabold text-gray-900 mt-2 break-keep">D-Day, 영화와 같은 만남과 보물찾기</h3>
              <p className="text-base font-medium text-gray-800 mt-4 leading-relaxed break-keep px-4">
                "약속 장소에서 시그널을 통해 서로를 영화처럼 발견하세요. 만나자마자 서로의 QR코드를 스캔하여 보물찾기 미션을 완료합니다."
              </p>
              <div className="mt-4 bg-gray-100 rounded-xl p-4 mx-4 text-sm text-gray-600 leading-relaxed break-keep">
                ✨ 여행 메이트들은 만나 서로의 스마트폰 화면(QR코드)을 스캔하며 어색함을 깨고 경쾌한 아이스브레이킹을 시작합니다.
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
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
              <h3 className="text-xl font-extrabold text-gray-900 mt-2 break-keep">프로필 해제 & 보물찾기</h3>
              <p className="text-base font-medium text-gray-800 mt-4 leading-relaxed break-keep px-4">
                "스캔 즉시 상대방의 진짜 프로필과 시그널 트립이 쏘는 '보물(검증된 F&B 2인 이용권)'이 지급됩니다. 이제 준비된 공간에서 두 사람만의 여행을 시작하세요."
              </p>
              <div className="mt-4 bg-gray-100 rounded-xl p-4 mx-4 text-sm text-gray-600 leading-relaxed break-keep">
                ✨ 스캔 완료 알림과 함께 상대방의 프로필 카드가 열리고, 근처 로컬 맛집의 '2인 식사권' 쿠폰이 반짝이며 나타납니다.
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Pricing & FAQ (White Background - Font scaled 30%) */}
        <section className="px-6 py-20 bg-white">
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

          {/* Image Text Banner */}
          <div className="w-full h-56 rounded-3xl relative overflow-hidden mb-6 shadow-md">
            <img src="/images/serendipity.png" className="absolute inset-0 w-full h-full object-cover object-center" alt="우연한 만남" />
            <div className="bg-gradient-to-t from-black/70 via-black/20 to-transparent absolute inset-0" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-lg font-serif leading-snug drop-shadow-md break-keep">
                여행지에서 우연히 만나는<br />
                낯선곳에서 우연히 계속 지나치는
              </p>
              <p className="text-[#00C7B5] text-xl font-bold mt-2 tracking-wide drop-shadow-md">
                시그널 트립
              </p>
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
            시그널 트립 탑승하기
          </button>
        </div>

      </div>
    </div>
  );
}
