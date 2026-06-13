import { useState } from 'react';
import Footer from './WebApp/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HeroSectionProps {
  onOpenRegistration: () => void;
}

export default function HeroSection({ onOpenRegistration }: HeroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animStep, setAnimStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqData = [
    {
      q: "엄격한 신원 검증의 기준이 무엇인가요?",
      a: "직장 인증(명함/사원증 등)과 엄격한 자격검증을 필수로 주최측이 꼼꼼하게 교차 검증하고 있어요. 서류가 누락되거나 조건에 맞지 않으면 아쉽지만 참여가 어려워요."
    },
    {
      q: "내향적인 성격이라 낯선 모임이 부담스러울까 봐 걱정돼요.",
      a: "시그널 트립은 바로 그런 분들을 위해 설계되었어요. 외향적인 소수에게 대화가 휩쓸리지 않도록, 전용 웹앱이 48시간의 대화와 미션을 공평하게 리드해 줍니다. 그저 안내에 따라 편안하게 진짜 내 모습을 보여주기만 하면 돼요."
    },
    {
      q: "1:1 데이트 파트너는 어떻게 정해지나요?",
      a: "1일 차 저녁, 개별 인터뷰와 웹앱을 통해 '시그널 투표'를 진행해요. 이를 바탕으로 가장 결이 맞고 호감도가 높은 상대방과 2일 차 프라이빗 1:1 데이트를 즐기게 될 거예요."
    }
  ];


  const handleOpenEnvelope = () => {
    setIsOpen(true);
    setTimeout(() => setAnimStep(1), 500);
    setTimeout(() => setAnimStep(2), 1500);
    setTimeout(() => setAnimStep(3), 2500);
    setTimeout(() => setAnimStep(4), 3500);
  };

  const handleStart = () => {
    setShowDetails(true);
    window.scrollTo(0, 0);
  };

  if (!showDetails) {
    return (
      <div className="relative min-h-screen bg-white text-stone-900 w-full flex flex-col items-center justify-center overflow-x-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
          * { font-family: 'Gowun Dodum', sans-serif; }
          
          @keyframes dropIn {
            0% { transform: translateY(-100vh) rotate(-15deg); opacity: 0; }
            60% { transform: translateY(30px) rotate(5deg); opacity: 1; }
            80% { transform: translateY(-15px) rotate(-2deg); }
            100% { transform: translateY(0) rotate(0deg); opacity: 1; }
          }
        `}</style>

        <div className="flex flex-col items-center justify-center w-full px-6">
          {!isOpen ? (
            <div
              onClick={handleOpenEnvelope}
              className="cursor-pointer group flex flex-col items-center"
              style={{ animation: 'dropIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}
            >
              <div className="relative hover:-translate-y-3 transition-transform duration-300">
                <img
                  src="/envelope.png"
                  alt="초대장"
                  style={{ width: '100%', maxWidth: '340px', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
                />
                <p className="mt-8 text-center text-[#00C7B5] font-bold tracking-[0.2em] text-lg animate-pulse">
                  초대장 열기
                </p>
              </div>
            </div>
          ) : (
            /* 🚨 폰트 크기 절반으로 축소 완료 🚨 */
            <div className="flex flex-col items-center justify-center text-center w-full max-w-3xl" style={{ gap: '2rem' }}>
              <p
                style={{ opacity: animStep >= 1 ? 1 : 0, transform: animStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease', fontSize: '1.2rem', lineHeight: '1.6' }}
                className="text-stone-800 tracking-widest break-keep"
              >
                "이제부터 당신은 낯선 곳으로 떠납니다"
              </p>
              <p
                style={{ opacity: animStep >= 2 ? 1 : 0, transform: animStep >= 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease', fontSize: '1.6rem', color: '#00C7B5', fontWeight: 'bold' }}
                className="tracking-widest break-keep"
              >
                "48시간의 긴 소개팅"
              </p>
              <p
                style={{ opacity: animStep >= 3 ? 1 : 0, transform: animStep >= 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease', fontSize: '1.2rem', lineHeight: '1.6' }}
                className="text-stone-800 tracking-widest break-keep"
              >
                "여행지에서 사랑을 시작할까요?"
              </p>

              {/* 버튼 간격도 폰트에 맞춰서 적절히 축소 */}
              <div
                style={{ opacity: animStep >= 4 ? 1 : 0, transition: 'opacity 1s ease', marginTop: '4rem' }}
              >
                <button
                  onClick={handleStart}
                  className="px-10 py-4 bg-[#00C7B5] text-white font-bold tracking-[0.2em] rounded-full shadow-[0_10px_20px_rgba(0,199,181,0.3)] hover:bg-[#00b3a3] transition-colors cursor-pointer relative z-50 pointer-events-auto"
                  style={{ fontSize: '1.1rem' }}
                >
                  여행 시작하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-stone-900 flex flex-col fade-in-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
        * { font-family: 'Gowun Dodum', sans-serif; }
        .fade-in-page { animation: pageFade 0.8s ease forwards; }
        @keyframes pageFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Section 1: Brand Manifesto (Full-width, Cinematic Background Image) */}
      <div
        className="w-full relative bg-cover bg-[position:center_70%] py-32 md:py-40 px-6 text-center"
        style={{ backgroundImage: `url('/hero-bg.png')` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-white tracking-wide font-medium leading-snug break-keep">
            "1초의 스와이프로 결정되는 가벼운 인연에 지치셨나요?"
          </h2>
          <p className="mt-8 text-gray-300 text-sm md:text-base leading-loose max-w-2xl mx-auto break-keep font-light">
            시그널 트립은 알고리즘이 아닌, 사람과 사람의 고유한 '결'에 집중합니다.<br />
            화려한 스펙이나 사진 한 장으로 평가받는 소개팅에서 벗어나,<br />
            제주의 낯선 풍경 속에서 당신의 진짜 취향과 가치관을 알아볼 누군가를 만나보세요.
          </p>
        </div>
      </div>

      <div className="relative w-full flex-1 flex flex-col items-center py-20 px-4">
        <div className="w-full max-w-6xl flex flex-col items-center">
          {/* Section 2: The Silhouette of 48 Hours */}
          <div className="w-full py-12 px-4 border-b border-stone-100 mb-24">
            <div className="text-center mb-16 space-y-4">
              <p className="text-sm tracking-[0.4em] text-[#00C7B5] uppercase font-bold">The Journey</p>
              <h2 className="text-3xl tracking-[0.1em] text-stone-900 font-bold">48시간의 실루엣</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              {/* Card 1 */}
              <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white text-left flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src="/day1-sunset.png"
                    alt="Day 1. Sunset"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-stone-800 mb-2 tracking-wide">Day 1. Sunset</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">어색함이 설렘으로 바뀌는 낯선 해안도로에서의 첫 만남</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white text-left flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src="/day1-night.png"
                    alt="Day 1. Night"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-stone-800 mb-2 tracking-wide">Day 1. Night</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">서로의 음악 취향이 부딪히는 프라이빗 바이닐(Vinyl) 라운지</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white text-left flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src="/day2-morning.png"
                    alt="Day 2. Morning"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-stone-800 mb-2 tracking-wide">Day 2. Morning</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">선택된 자들만 알 수 있는 시크릿 로컬 맛집에서의 1:1 다이닝</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white text-left flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src="/day2-night.png"
                    alt="Day 2. Night"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-stone-800 mb-2 tracking-wide">Day 2. Night</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">위스키 한 잔과 디제잉 음악, 그리고 마지막 밍글링 속 오가는 확실한 시그널</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: App-based System Value (결제 가치 입증) */}
          <div className="w-full max-w-3xl mx-auto py-24 text-center px-6 border-b border-stone-100 mb-20">
            <span className="text-[10px] tracking-[0.6em] text-[#00C7B5] uppercase font-bold block mb-4">THE SYSTEM</span>
            <h2 className="text-2xl md:text-3xl text-stone-800 tracking-wide font-medium leading-snug break-keep">
              "어색한 침묵도, 억지 텐션도 필요 없습니다."
            </h2>
            <p className="mt-8 text-stone-500 text-sm md:text-base leading-loose max-w-2xl mx-auto break-keep font-light whitespace-pre-line">
              {`시그널 트립에는 분위기를 띄우는 유치한 진행자가 없습니다. 
대신, 당신의 스마트폰 속 '전용 웹앱'이 48시간의 감정선을 완벽하게 리드합니다. 
누구도 소외되지 않는 턴제 대화 카드, 취향을 공유하는 시크릿 미션을 따라가다 보면
어느새 가장 '나다운' 모습으로 결이 맞는 사람들과 깊어지게 될 것입니다.`}
            </p>
          </div>

        </div>
      </div>

      {/* Section 4: Who We Invite (Full-width, White Magazine Quote style) */}
      <div 
        className="w-full relative bg-cover bg-center py-24 md:py-32 px-6 text-center"
        style={{ backgroundImage: `url('/hero-bg-2.png')` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <span className="text-sm tracking-[0.4em] text-emerald-400 uppercase font-bold block mb-2 font-sans">WHO WE INVITE</span>
          <h2 className="text-3xl md:text-4xl text-white tracking-wide font-bold mb-12">이런 분들을 애타게 찾고 있어요.</h2>

          <div className="max-w-xl mx-auto text-left space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-emerald-400 font-bold text-sm mt-1">✓</span>
              <p className="text-white/90 text-sm md:text-base leading-relaxed break-keep font-light">단순한 스펙이나 외모보다, 사람과 사람 사이의 고유한 '결'을 알아볼 수 있는 분</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-emerald-400 font-bold text-sm mt-1">✓</span>
              <p className="text-white/90 text-sm md:text-base leading-relaxed break-keep font-light">어색한 침묵 속에서도 여유를 즐기며, 타인의 취향과 가치관을 깊이 있게 존중하는 분</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-emerald-400 font-bold text-sm mt-1">✓</span>
              <p className="text-white/90 text-sm md:text-base leading-relaxed break-keep font-light">인위적인 조건 매칭이 아닌, 낯선 여행지가 만들어내는 낭만적인 우연을 믿으시는 분</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20 max-w-lg mx-auto">
            <p className="text-white text-sm md:text-base font-medium tracking-wide break-keep leading-relaxed">
              "이 모든 기준을 통과한, 결이 맞는 8명만의 프라이빗한 여정이 시작돼요."
            </p>
          </div>
        </div>
      </div>

      {/* Section 5: Zero Tolerance Policy (Privacy & Safety Promise) */}
      <div className="w-full py-16 md:py-20 px-6 bg-white flex justify-center">
        <div className="w-full max-w-3xl bg-gray-50 rounded-3xl p-10 md:p-12 text-center shadow-sm">
          <img src="/feature-privacy.png" alt="Privacy Protection" className="w-32 h-32 md:w-40 md:h-40 object-contain mx-auto mb-8" />
          <p className="text-emerald-500 text-sm tracking-widest font-medium">100% PRIVACY & SAFETY</p>
          <h3 className="text-gray-800 text-2xl md:text-3xl font-semibold mt-3">완벽한 몰입을 위한 프라이버시 보호</h3>
          <p className="text-gray-500 leading-relaxed mt-5 text-sm md:text-base break-keep font-light whitespace-pre-line">
            {`타인의 동의 없는 사진 촬영, 무리한 연락처 요구, 불쾌감을 주는 언행은 삼가주세요.
일상의 짐과 타인의 시선은 모두 내려놓고, 오직 나와 상대방의 대화에만 집중할 수 있는 가장 안전한 시공간을 약속할게요.`}
          </p>
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center py-20 px-4">
        <div className="w-full max-w-6xl flex flex-col items-center">

          <div className="text-center mb-16 space-y-4">
            <p className="text-sm tracking-[0.4em] text-[#00C7B5] uppercase font-bold">Why Signal Trip</p>
            <h2 className="text-3xl md:text-4xl tracking-[0.1em] text-stone-900 font-bold">PREMIUM FEATURES</h2>
          </div>

          {/* 🚨 어필 포인트 가로 정렬 & 박스 크기 30% 축소 절대 강제화 (CSS Flexbox 인라인) 🚨 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: '2rem',
              width: '100%',
              marginBottom: '6rem'
            }}
          >
            {/* 어필 포인트 1 */}
            <div style={{ flex: '1 1 280px', maxWidth: '300px' }} className="bg-white p-8 border-2 border-stone-100 text-center flex flex-col items-center rounded-[40px] shadow-sm hover:shadow-xl transition-all">
              <img src="/feature-match.png" alt="Data Matching" className="w-40 h-40 object-contain mx-auto mb-8" />
              <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">DATA-DRIVEN MATCHING</h3>
              <p className="text-stone-600 leading-relaxed break-keep text-sm">작성하신 프로필과 이상형 데이터를 주최 측이 직접 분석하여, 가장 결이 맞는 8명만을 엄선해 48시간의 여행을 시작합니다.</p>
            </div>

            {/* 어필 포인트 2 */}
            <div style={{ flex: '1 1 280px', maxWidth: '300px' }} className="bg-white p-8 border-2 border-stone-100 text-center flex flex-col items-center rounded-[40px] shadow-sm hover:shadow-xl transition-all">
              <img src="/feature-guide.png" alt="Local Guide" className="w-40 h-40 object-contain mx-auto mb-8" />
              <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">LOCAL EXPERT GUIDE</h3>
              <p className="text-stone-600 leading-relaxed break-keep text-sm">제주 로컬 전문가가 엄선한 시크릿 카페, 1:1 데이트를 위한 하이엔드 맛집, 그리고 영감을 채워줄 프라이빗 전시 투어 등 완벽한 여행 코스를 제공합니다.</p>
            </div>

            {/* 어필 포인트 3 */}
            <div style={{ flex: '1 1 280px', maxWidth: '300px' }} className="bg-white p-8 border-2 border-stone-100 text-center flex flex-col items-center rounded-[40px] shadow-sm hover:shadow-xl transition-all">
              <img src="/feature-verify.png" alt="Verified Identity" className="w-40 h-40 object-contain mx-auto mb-8" />
              <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">100% VERIFIED IDENTITY</h3>
              <p className="text-stone-600 leading-relaxed break-keep text-sm">직장 및 사업자 인증을 통과한 확실한 신원, 그리고 엄격한 법적 싱글(미혼) 서약 제도가 당신의 48시간을 가장 안전하게 보호합니다.</p>
            </div>
          </div>

          {/* Section 6: FAQ Accordion */}
          <div className="w-full max-w-3xl mx-auto py-16 px-4 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl text-gray-800 font-semibold">자주 묻는 질문</h2>
              <p className="text-gray-500 mt-2 text-sm md:text-base">더 궁금한 점이 있으신가요?</p>
            </div>

            <div className="space-y-4">
              {faqData.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index} 
                    className={`border-b pb-4 transition-colors duration-300 ${
                      isOpen ? 'border-emerald-200' : 'border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex justify-between items-center py-4 text-left font-medium text-emerald-600 hover:text-emerald-500 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="text-base md:text-lg break-keep pr-4">{faq.q}</span>
                      <span className="text-emerald-500 flex-shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </span>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: isOpen ? "300px" : "0px",
                        opacity: isOpen ? 1 : 0,
                        transition: "all 0.3s ease-in-out"
                      }}
                    >
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed pl-2 pr-6 pb-4 break-keep font-light whitespace-pre-line">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🚨 참가비 박스 50% 축소 절대 강제화 🚨 */}
          <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', marginBottom: '5rem' }} className="border-2 border-stone-100 p-10 text-center bg-stone-50 rounded-[40px]">
            <p className="text-sm tracking-[0.3em] text-stone-500 mb-6 uppercase font-bold">Participation Fee</p>
            <h2 className="tracking-[0.1em] text-[#00C7B5] mb-12 font-bold" style={{ fontSize: '21px' }}>1인 참가비: 250,000원</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', textAlign: 'left' }}>
              <div style={{ flex: '1 1 250px' }}>
                <p className="text-stone-900 mb-4 pb-3 border-b-2 border-stone-200 tracking-[0.1em] font-bold text-base">포함 내역</p>
                <ul className="space-y-3 text-stone-600 text-sm">
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 프라이빗 여행 투어</li>
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 프리미엄 케이터링 2회</li>
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 디제잉 파티 라운지 대관</li>
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 미션 디저트 리워드</li>
                </ul>
              </div>
              <div style={{ flex: '1 1 250px' }}>
                <p className="text-stone-900 mb-4 pb-3 border-b-2 border-stone-200 tracking-[0.1em] font-bold text-base">불포함 내역</p>
                <ul className="space-y-3 text-stone-600 text-sm">
                  <li className="flex items-start"><span className="text-stone-400 mr-2 mt-0.5">✖</span> 제주 왕복 항공권</li>
                  <li className="flex items-start"><span className="text-stone-400 mr-2 mt-0.5">✖</span> <div>개별 숙소 <span className="text-xs text-[#00C7B5] block mt-1">(심사 통과 시 추천 숙소 제공)</span></div></li>
                  <li className="flex items-start"><span className="text-stone-400 mr-2 mt-0.5">✖</span> 1:1 데이트 시 개인 식사 비용</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 🚨 참가 신청 버튼 (알림창 제거 버전) 🚨 */}
          <div className="w-full flex flex-col items-center justify-center pb-10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenRegistration(); // 알림창 빼고 모달만 바로 열리게 수정
              }}
              className="px-24 py-6 bg-[#00C7B5] text-white font-bold hover:bg-[#00b3a3] transition-all tracking-[0.2em] text-2xl mb-6 rounded-full shadow-[0_15px_30px_rgba(0,199,181,0.3)] whitespace-nowrap"
              style={{ position: 'relative', zIndex: 999999, cursor: 'pointer', pointerEvents: 'auto', whiteSpace: 'nowrap' }}
            >
              참가 신청하기
            </button>
            <p className="text-sm text-stone-400">
              ※ 결제는 엄격한 서류 심사를 통과하신 분들에 한해 추후 개별 안내됩니다.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
