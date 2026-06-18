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
      q: "팀 크루는 어떻게 만들어지나요??",
      a: "제출해주신 '취향 데이터 신청서'를 바탕으로 엄밀한 분석을 거쳐 매칭됩니다. 여행의 질감, 미식의 철학 등 결이 가장 잘 맞는 분들을 하나의 크루로 묶어드립니다. 따라서 탑승 신청서를 최대한 상세하고 진정성 있게 작성해주실수록, 48시간 동안 완벽한 시너지를 낼 수 있는 크루를 만나실 확률이 높아집니다."
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
                  src="/images/envelope.png"
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
                "이제부터 당신은 제주의 낯선 여행지로 탐험을 떠납니다"
              </p>
              <p
                style={{ opacity: animStep >= 2 ? 1 : 0, transform: animStep >= 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease', fontSize: '1.6rem', color: '#00C7B5', fontWeight: 'bold' }}
                className="tracking-widest break-keep"
              >
                "48시간의 시크릿 소셜 미션"
              </p>
              <p
                style={{ opacity: animStep >= 3 ? 1 : 0, transform: animStep >= 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease', fontSize: '1.2rem', lineHeight: '1.6' }}
                className="text-stone-800 tracking-widest break-keep"
              >
                "취향 데이터로 묶인 크루와 함께"
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

      {/* Section 1: Hero Section (최상단 메인 배너) */}
      <div
        className="w-full relative bg-cover bg-[position:center_70%] py-32 md:py-40 px-6 text-center"
        style={{ backgroundImage: `url('/images/hero-bg.png')` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-white tracking-wide font-medium leading-snug break-keep">
            뻔한 여행은 이제 그만. 처음 만난 8명이 함께 뛰는 1박 2일 리얼 미션 여행.
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            공항에 모인 낯선 사람들. 스마트폰으로 전송되는 지령. 예능 프로그램의 주인공처럼 제주도를 누비며 미션을 해결하고, 밤에는 프라이빗 라운지에서 함께 칵테일을 부딪히는 48시간의 리얼 버라이어티가 시작됩니다.
          </p>
        </div>
      </div>

      <div className="relative w-full flex-1 flex flex-col items-center py-20 px-4">
        <div className="w-full max-w-6xl flex flex-col items-center">

          {/* Section 2: THE CORE RULES (시그널 트립 핵심 원칙) */}
          <div className="w-full py-12 px-4 border-b border-stone-100 mb-20 flex justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="text-center mb-12 space-y-4">
                <p className="text-sm tracking-[0.4em] text-[#00C7B5] uppercase font-bold">THE CORE RULES</p>
                <h2 className="text-3xl tracking-[0.1em] text-stone-900 font-bold">시그널 트립 핵심 원칙</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
                <div className="flex justify-center">
                  <img
                    src="/images/rule-system.png"
                    alt="Rule System"
                    className="w-full max-w-md h-auto object-contain rounded-3xl shadow-md"
                  />
                </div>
                <div className="space-y-8 text-left">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#00C7B5]/10 text-[#00C7B5] text-xs rounded-full font-bold">RULE 1</span>
                      블라인드 프로필
                    </h3>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">
                      나이, 직업, 진짜 이름은 묻지 마세요. 1박 2일 동안 서로를 '닉네임'으로만 부릅니다.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#00C7B5]/10 text-[#00C7B5] text-xs rounded-full font-bold">RULE 2</span>
                      스마트폰 지령 시스템
                    </h3>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">
                      가이드라인은 오직 스마트폰에 떨어지는 미션뿐입니다. 힌트를 풀고 다음 목적지로 이동하세요.
                    </p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="bg-teal-50 text-teal-500 text-xs font-bold px-2 py-1 rounded mr-3">
                        RULE 3
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        하이엔드 큐레이션
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      미션에만 집중하세요. 렌트카, 맛집 검색, 동선 고민도 필요 없습니다. 완벽하게 세팅된 공간이 여러분을 기다립니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: THE JOURNEY (48시간 타임라인 - 4개의 카드 UI) */}
          <div className="w-full py-12 px-4 border-b border-stone-100 mb-24">
            <div className="text-center mb-16 space-y-4">
              <p className="text-sm tracking-[0.4em] text-[#00C7B5] uppercase font-bold">THE JOURNEY</p>
              <h2 className="text-3xl tracking-[0.1em] text-stone-900 font-bold">48시간 타임라인</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              {/* Card 1 */}
              <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white text-left flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src="/images/journey-keyring.png"
                    alt="Day 1. 14:00 [미션 01. 공항 접선과 시크릿 키링]"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-stone-800 mb-2 tracking-wide">Day 1. 14:00 [미션 01. 공항 접선과 시크릿 키링]</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">사전 배송된 암호 키링을 통해 제주 공항에서 나의 크루를 찾으세요.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white text-left flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src="/images/journey-dj.png"
                    alt="Day 1. 18:00 [프라이빗 다이닝 & DJ 파티]"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-stone-800 mb-2 tracking-wide">Day 1. 18:00 [프라이빗 다이닝 & DJ 파티]</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">첫 번째 미션을 풀어낸 크루에게만 허락되는 숨겨진 라운지에서의 네트워킹.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white text-left flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src="/images/journey-mission.png"
                    alt="Day 2. 10:00 [미션 02. 취향 저격 액티비티]"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-stone-800 mb-2 tracking-wide">Day 2. 10:00 [미션 02. 취향 저격 액티비티]</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">크루의 성향에 완벽하게 맞춰진 제주 로컬 액티비티 지령이 떨어집니다.</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white text-left flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src="/images/journey-ending.png"
                    alt="Day 2. 14:00 [엔딩 크레딧]"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-stone-800 mb-2 tracking-wide">Day 2. 14:00 [엔딩 크레딧]</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed break-keep font-normal">모든 미션 종료. 동고동락한 8명 전원의 진짜 프로필과 연락처가 봉인 해제됩니다.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Section 4: Who We Invite (Full-width, White Magazine Quote style) */}
      <div
        className="w-full relative bg-cover bg-center py-24 md:py-32 px-6 text-center"
        style={{ backgroundImage: `url('/images/hero-bg-2.png')` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <span className="text-sm tracking-[0.4em] text-emerald-400 uppercase font-bold block mb-2 font-sans">WHO WE INVITE</span>
          <h2 className="text-3xl md:text-4xl text-white tracking-wide font-bold mb-12">이런 분들을 애타게 찾고 있어요.</h2>

          <div className="max-w-xl mx-auto text-left space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-emerald-400 font-bold text-sm mt-1">✓</span>
              <p className="text-white/90 text-sm md:text-base leading-relaxed break-keep font-light">마주 앉아 호구조사하는 어색한 술자리보다, 미션을 함께 풀며 자연스럽게 친해지는 '자만추'를 원하시는 분</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-emerald-400 font-bold text-sm mt-1">✓</span>
              <p className="text-white/90 text-sm md:text-base leading-relaxed break-keep font-light">여행 계획을 짜는 스트레스 없이, 몸만 와서 예능 프로그램 같은 1박 2일을 즐기고 싶으신 분</p>
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
          <img src="/images/feature-privacy.png" alt="Privacy Protection" className="w-32 h-32 md:w-40 md:h-40 object-contain mx-auto mb-8" />
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
              <img src="/images/feature-match.png" alt="Data Matching" className="w-40 h-40 object-contain mx-auto mb-8" />
              <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">[취향 기반 크루 매칭]</h3>
              <p className="text-stone-600 leading-relaxed break-keep text-sm">여행 스타일과 성향 데이터를 분석하여, 가장 결이 맞는 4명씩 2개의 크루를 구성합니다.</p>
            </div>

            {/* 어필 포인트 2 */}
            <div style={{ flex: '1 1 280px', maxWidth: '300px' }} className="bg-white p-8 border-2 border-stone-100 text-center flex flex-col items-center rounded-[40px] shadow-sm hover:shadow-xl transition-all">
              <img src="/images/feature-guide.png" alt="Local Guide" className="w-40 h-40 object-contain mx-auto mb-8" />
              <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">[시크릿 택시 펀딩 (No 운전)]</h3>
              <p className="text-stone-600 leading-relaxed break-keep text-sm">희생해서 운전대를 잡을 필요 없습니다. 팀별로 두둑한 카카오 택시 지원금이 지급됩니다.</p>
            </div>

            {/* 어필 포인트 3 */}
            <div style={{ flex: '1 1 280px', maxWidth: '300px' }} className="bg-white p-8 border-2 border-stone-100 text-center flex flex-col items-center rounded-[40px] shadow-sm hover:shadow-xl transition-all">
              <img src="/images/feature-verify.png" alt="Verified Identity" className="w-40 h-40 object-contain mx-auto mb-8" />
              <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">100% VERIFIED IDENTITY</h3>
              <p className="text-stone-600 leading-relaxed break-keep text-sm">재직 및 사업자 인증을 통과한 확실한 신원의 크루들만 엄선하여, 가장 안전하고 몰입감 넘치는 시간을 약속합니다.</p>
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
                    className={`border-b pb-4 transition-colors duration-300 ${isOpen ? 'border-emerald-200' : 'border-gray-100 hover:border-emerald-200'
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
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 팀별 택시 이동 펀딩금</li>
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 하이엔드 디너 & 런치 (2식)</li>
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 베이스캠프 대관 및 DJ 파티</li>
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 시크릿 미션 키링</li>
                  <li className="flex items-center"><span className="text-[#00C7B5] mr-2 font-bold">✔</span> 2일 차 취향별 체험 티켓</li>
                </ul>
              </div>
              <div style={{ flex: '1 1 250px' }}>
                <p className="text-stone-900 mb-4 pb-3 border-b-2 border-stone-200 tracking-[0.1em] font-bold text-base">불포함 내역</p>
                <ul className="space-y-3 text-stone-600 text-sm">
                  <li className="flex items-start"><span className="text-stone-400 mr-2 mt-0.5">✖</span> 제주 왕복 항공권</li>
                  <li className="flex items-start"><span className="text-stone-400 mr-2 mt-0.5">✖</span> <div>개별 숙소 <span className="text-xs text-[#00C7B5] block mt-1">(동선에 맞는 최적의 숙소 리스트를 제공합니다)</span></div></li>
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
              시크릿 크루 탑승하기
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
