import React from 'react';

export interface Step4Data {
  schedule: string[];
}

interface Step4Props {
  data: Step4Data;
  updateData: (fields: Partial<Step4Data>) => void;
  errors?: Record<string, string>;
}

export const Step4ScheduleConsent: React.FC<Step4Props> = ({ data, updateData, errors }) => {
  const dates = [
    '7월 17일 (금)',
    '7월 18일 (토)',
    '7월 19일 (일)',
    '이번 일정은 안 맞지만, 다음 오픈 시 알림 받기'
  ];

  const toggleDate = (option: string) => {
    if (option === '이번 일정은 안 맞지만, 다음 오픈 시 알림 받기') {
      const isSelected = data.schedule.includes(option);
      updateData({ schedule: isSelected ? [] : [option] });
    } else {
      const current = data.schedule.filter((item) => item !== '이번 일정은 안 맞지만, 다음 오픈 시 알림 받기');
      const isSelected = current.includes(option);
      const updated = isSelected
        ? current.filter((item) => item !== option)
        : [...current, option];
      updateData({ schedule: updated });
    }
  };

  return (
    <div className="space-y-6 text-stone-800 font-sans">
      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-[#00C7B5]">Step 3. 시크릿 초대장 신청</h2>
        <p className="text-xs text-stone-500 mt-1">파도 소리가 채우는 밤으로 초대합니다.</p>
        <p className="text-[10px] text-stone-400 mt-0.5">장소는 매번 가장 아름다운 로컬 포구로 시크릿 공지됩니다.</p>
      </div>

      <div className="space-y-3 text-left">
        <label className="text-sm font-bold text-stone-700 block">
          참여 가능한 날짜 <span className="text-[10px] text-stone-400 font-normal">(중복 선택 가능)</span>
        </label>
        <div className="space-y-2">
          {dates.map((option) => {
            const isSelected = data.schedule.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleDate(option)}
                className={`w-full py-4 px-4 border rounded-xl text-left font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-3 ${
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
                <span className={option.includes('알림 받기') ? 'text-xs text-stone-500 font-normal' : ''}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
        {errors?.schedule && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.schedule}</p>
        )}
      </div>
    </div>
  );
};