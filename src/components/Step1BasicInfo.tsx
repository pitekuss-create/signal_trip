export interface Step1Data {
  nickname: string;
  gender: 'male' | 'female' | '';
  ageGroup: string;
  phone: string;
}

interface Step1Props {
  data: Step1Data;
  updateData: (fields: Partial<Step1Data>) => void;
  errors?: Record<string, string>;
}

export default function Step1BasicInfo({ data, updateData, errors }: Step1Props) {
  const ageGroups = ['20대 중반', '20대 후반', '30대 초반', '30대 후반', '40대 초반'];

  return (
    <div className="space-y-6 text-stone-800 font-sans">
      <div className="text-center mb-4">
        <h2 className="text-xl font-extrabold text-[#00C7B5]">Step 1. 밤크닉 입장권</h2>
      </div>

      {/* 💌 미드나잇 초대장 안내 배너 */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#00C7B5]/20 rounded-2xl p-5 md:p-7 space-y-4 md:space-y-5 shadow-md relative overflow-hidden text-left mb-6">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C7B5]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1">
          <span className="text-[10px] md:text-xs uppercase font-extrabold tracking-widest text-[#00C7B5] block">Invitation</span>
          <h3 className="text-lg md:text-2xl font-bold text-white leading-tight font-sans">
            제주 미드나잇 포구트립 초대장 신청
          </h3>
        </div>

        <p className="text-[15px] md:text-lg leading-relaxed text-stone-200 font-light break-keep">
          제주의 밤바다에서 파도 소리를 들으며 즐기는 포구 트립은, 프라이빗한 낭만을 위해 <span className="font-bold text-[#00C7B5]">'프라이빗 초대장'</span>제로 운영됩니다. 🌙
        </p>

        <div className="pt-3 md:pt-4 border-t border-stone-850 space-y-3 md:space-y-4">
          <div className="flex items-start gap-2">
            <span className="text-base md:text-lg leading-none flex-shrink-0 mt-0.5">🍷</span>
            <div>
              <span className="text-[15px] md:text-lg font-bold text-stone-100 block mb-0.5 md:mb-1">준비된 선물</span>
              <span className="text-[14px] md:text-[16px] text-stone-300 font-light leading-relaxed break-keep">
                나만을 위한 와인 햄퍼(캔 와인, 논알콜 음료, 로컬 핑거푸드, 야광 팔찌 등) & 사일런트 뮤직 헤드셋, 캠핑 세팅 일체
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-base md:text-lg leading-none flex-shrink-0 mt-0.5">💳</span>
            <div className="space-y-1">
              <div className="text-[15px] md:text-lg font-bold text-stone-200 break-keep">
                참가 비용: <span className="font-extrabold text-[#00C7B5]">1기 스페셜 오픈 전액 무료 초청</span>
              </div>
              <p className="text-[13px] md:text-[14px] text-stone-400 font-light leading-relaxed break-keep">
                단, 퀄리티 높은 네트워킹과 노쇼(No-show) 방지를 위해 '예약 보증금 2만 원'을 받고 있으며, 현장 참석 시 100% 환급(페이백) 해드립니다.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 md:pt-4 border-t border-stone-850 space-y-1.5 md:space-y-2.5 text-[13px] md:text-[15px] text-stone-400 font-light leading-relaxed break-keep">
          <div className="flex items-start gap-1">
            <span className="text-[#00C7B5] flex-shrink-0 mt-0.5">•</span>
            <p>남겨주신 취향 검토 후, 초대되신 분들께만 개별 연락과 결제 안내를 드립니다.</p>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[#00C7B5] flex-shrink-0 mt-0.5">•</span>
            <p>포구 밤크닉을 함께 하실 분들을 기다려요 💌</p>
          </div>
        </div>
      </div>

      {/* 닉네임 */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-stone-700 block">닉네임</label>
        <input
          type="text"
          value={data.nickname || ''}
          onChange={(e) => updateData({ nickname: e.target.value })}
          placeholder="밤크닉에서 사용할 닉네임을 입력해 주세요"
          className={`w-full bg-stone-50 border ${errors?.nickname ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-stone-200 focus:border-[#00C7B5] focus:ring-[#00C7B5]'
            } rounded-xl py-3.5 px-4 text-stone-900 focus:outline-none transition-colors text-sm font-medium`}
        />
        {errors?.nickname && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.nickname}</p>
        )}
      </div>

      {/* 성별 */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-stone-700 block">성별</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateData({ gender: 'male' })}
            className={`py-3.5 border rounded-xl transition-all font-bold cursor-pointer text-center text-sm ${data.gender === 'male'
              ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]'
              : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#00C7B5]/50'
              }`}
          >
            남성
          </button>
          <button
            type="button"
            onClick={() => updateData({ gender: 'female' })}
            className={`py-3.5 border rounded-xl transition-all font-bold cursor-pointer text-center text-sm ${data.gender === 'female'
              ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]'
              : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#00C7B5]/50'
              }`}
          >
            여성
          </button>
        </div>
        {errors?.gender && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.gender}</p>
        )}
      </div>

      {/* 연령대 */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-stone-700 block">연령대</label>
        <div className="flex flex-wrap gap-2">
          {ageGroups.map((group) => {
            const isSelected = data.ageGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => updateData({ ageGroup: group })}
                className={`py-2.5 px-4 border rounded-xl transition-all font-bold cursor-pointer text-xs ${isSelected
                  ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#00C7B5]/50'
                  }`}
              >
                {group}
              </button>
            );
          })}
        </div>
        {errors?.ageGroup && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.ageGroup}</p>
        )}
      </div>

      {/* 연락처 */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-stone-700 block">연락처</label>
        <input
          type="text"
          value={data.phone || ''}
          onChange={(e) => {
            const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
            updateData({ phone: numbersOnly });
          }}
          placeholder="숫자만 입력해 주세요 (예: 01012345678)"
          className={`w-full bg-stone-50 border ${errors?.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-stone-200 focus:border-[#00C7B5] focus:ring-[#00C7B5]'
            } rounded-xl py-3.5 px-4 text-stone-900 focus:outline-none transition-colors text-sm font-medium`}
        />
        {errors?.phone && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
}
