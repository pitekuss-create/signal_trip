import { useState } from 'react';

interface HeroSectionProps {
  onOpenRegistration: () => void;
}

export default function HeroSection({ onOpenRegistration }: HeroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animStep, setAnimStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

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
    <div className="relative min-h-screen bg-white text-stone-900 w-full flex flex-col items-center py-20 px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
        * { font-family: 'Gowun Dodum', sans-serif; }
        .fade-in-page { animation: pageFade 0.8s ease forwards; }
        @keyframes pageFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="w-full max-w-6xl flex flex-col items-center fade-in-page">
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
            <img src="/illust_1.png" alt="Matching" style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '1.5rem' }} />
            <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">DATA-DRIVEN MATCHING</h3>
            <p className="text-stone-600 leading-relaxed break-keep text-sm">작성하신 프로필과 이상형 데이터를 주최 측이 직접 분석하여, 가장 결이 맞는 8명만을 엄선해 48시간의 여행을 시작합니다.</p>
          </div>

          {/* 어필 포인트 2 */}
          <div style={{ flex: '1 1 280px', maxWidth: '300px' }} className="bg-white p-8 border-2 border-stone-100 text-center flex flex-col items-center rounded-[40px] shadow-sm hover:shadow-xl transition-all">
            <img src="/illust_2.png" alt="Local Guide" style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '1.5rem' }} />
            <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">LOCAL EXPERT GUIDE</h3>
            <p className="text-stone-600 leading-relaxed break-keep text-sm">제주 로컬 전문가가 엄선한 시크릿 카페, 1:1 데이트를 위한 하이엔드 맛집, 그리고 영감을 채워줄 프라이빗 전시 투어 등 완벽한 여행 코스를 제공합니다.</p>
          </div>

          {/* 어필 포인트 3 */}
          <div style={{ flex: '1 1 280px', maxWidth: '300px' }} className="bg-white p-8 border-2 border-stone-100 text-center flex flex-col items-center rounded-[40px] shadow-sm hover:shadow-xl transition-all">
            <img src="/illust_3.png" alt="Verified" style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '1.5rem' }} />
            <h3 className="text-lg tracking-[0.1em] mb-4 text-[#00C7B5] font-bold">100% VERIFIED IDENTITY</h3>
            <p className="text-stone-600 leading-relaxed break-keep text-sm">직장 및 사업자 인증을 통과한 확실한 신원, 그리고 엄격한 법적 싱글(미혼) 서약 제도가 당신의 48시간을 가장 안전하게 보호합니다.</p>
          </div>
        </div>

        {/* 🚨 참가비 박스 50% 축소 절대 강제화 🚨 */}
        <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', marginBottom: '5rem' }} className="border-2 border-stone-100 p-10 text-center bg-stone-50 rounded-[40px]">
          <p className="text-sm tracking-[0.3em] text-stone-500 mb-6 uppercase font-bold">Participation Fee</p>
          <h2 className="text-3xl tracking-[0.1em] text-[#00C7B5] mb-12 font-bold">1인 참가비: 250,000원</h2>
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
            className="px-24 py-6 bg-[#00C7B5] text-white font-bold hover:bg-[#00b3a3] transition-all tracking-[0.2em] text-2xl mb-6 rounded-full shadow-[0_15px_30px_rgba(0,199,181,0.3)]"
            style={{ position: 'relative', zIndex: 999999, cursor: 'pointer', pointerEvents: 'auto' }}
          >
            참가 신청하기
          </button>
          <p className="text-sm text-stone-400">
            ※ 결제는 엄격한 서류 심사를 통과하신 분들에 한해 추후 개별 안내됩니다.
          </p>
        </div>

      </div>
    </div>
  );
}
