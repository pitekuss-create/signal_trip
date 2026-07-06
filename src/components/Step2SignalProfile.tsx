import React from 'react';

export interface Step2Data {
  musicVibes: string[];
  midnightDrink: string;
  conversationStyle: string;
}

interface Step2Props {
  data: Step2Data;
  updateData: (fields: Partial<Step2Data>) => void;
  errors?: Record<string, string>;
}

export const Step2SignalProfile: React.FC<Step2Props> = ({ data, updateData, errors }) => {
  const musicOptions = [
    '칠링되는 잔잔한 R&B/재즈',
    '감성 터지는 인디/어쿠스틱',
    '적당한 그루브의 시티팝/팝송'
  ];

  const drinkOptions = [
    '감성적인 크래프트 캔 와인 (알코올)',
    '차를 가져와도 안심, 프리미엄 논알콜 음료'
  ];

  const talkOptions = [
    '주로 편안하게 들어주는 편이에요.',
    '분위기를 주도하며 이야기를 이끄는 편이에요.',
    '티키타카, 핑퐁 대화를 즐겨요.'
  ];

  const toggleMusic = (option: string) => {
    const isSelected = data.musicVibes.includes(option);
    const updated = isSelected
      ? data.musicVibes.filter((item) => item !== option)
      : [...data.musicVibes, option];
    updateData({ musicVibes: updated });
  };

  return (
    <div className="space-y-6 text-stone-800 font-sans">
      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-[#00C7B5]">Step 2. 미드나잇 큐레이션</h2>
        <p className="text-xs text-stone-500 mt-1">결이 맞는 그룹 큐레이션을 위해 취향을 묻습니다.</p>
        <p className="text-[10px] text-stone-400 mt-0.5">선택하신 취향을 바탕으로 가장 완벽한 2시간을 준비합니다.</p>
      </div>

      {/* 밤바다 음악 바이브 */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-stone-700 block">
          밤바다 음악 바이브 <span className="text-[10px] text-stone-400 font-normal">(중복 선택 가능)</span>
        </label>
        <div className="space-y-2">
          {musicOptions.map((option) => {
            const isSelected = data.musicVibes.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleMusic(option)}
                className={`w-full py-3.5 px-4 border rounded-xl text-left font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected 
                    ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]' 
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#00C7B5]/40 hover:bg-stone-100/50'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-[#00C7B5] border-[#00C7B5] text-white' : 'border-stone-300 bg-white'
                }`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 stroke-[3px] stroke-white fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
        {errors?.musicVibes && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.musicVibes}</p>
        )}
      </div>

      {/* 미드나잇 주류 선택 */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-stone-700 block">
          미드나잇 주류 선택 <span className="text-rose-500 text-xs font-black ml-1">(매우 중요!)</span>
        </label>
        <div className="space-y-2">
          {drinkOptions.map((option) => {
            const isSelected = data.midnightDrink === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => updateData({ midnightDrink: option })}
                className={`w-full py-3.5 px-4 border rounded-xl text-left font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected 
                    ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]' 
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#00C7B5]/40 hover:bg-stone-100/50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'border-[#00C7B5]' : 'border-stone-300 bg-white'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#00C7B5]" />}
                </div>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
        {errors?.midnightDrink && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.midnightDrink}</p>
        )}
      </div>

      {/* 대화 스타일 */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-stone-700 block">대화 스타일</label>
        <div className="space-y-2">
          {talkOptions.map((option) => {
            const isSelected = data.conversationStyle === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => updateData({ conversationStyle: option })}
                className={`w-full py-3.5 px-4 border rounded-xl text-left font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected 
                    ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]' 
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#00C7B5]/40 hover:bg-stone-100/50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'border-[#00C7B5]' : 'border-stone-300 bg-white'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#00C7B5]" />}
                </div>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
        {errors?.conversationStyle && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.conversationStyle}</p>
        )}
      </div>
    </div>
  );
};
