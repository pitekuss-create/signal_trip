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
      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-[#00C7B5]">Step 1. 밤크닉 입장권</h2>
        <p className="text-xs text-stone-500 mt-1">포구트립에서 불릴 이름을 알려주세요.</p>
      </div>

      {/* 닉네임 */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-stone-700 block">닉네임</label>
        <input
          type="text"
          value={data.nickname || ''}
          onChange={(e) => updateData({ nickname: e.target.value })}
          placeholder="밤크닉에서 사용할 닉네임을 입력해 주세요"
          className={`w-full bg-stone-50 border ${
            errors?.nickname ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-stone-200 focus:border-[#00C7B5] focus:ring-[#00C7B5]'
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
            className={`py-3.5 border rounded-xl transition-all font-bold cursor-pointer text-center text-sm ${
              data.gender === 'male' 
                ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]' 
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#00C7B5]/50'
            }`}
          >
            남성
          </button>
          <button
            type="button"
            onClick={() => updateData({ gender: 'female' })}
            className={`py-3.5 border rounded-xl transition-all font-bold cursor-pointer text-center text-sm ${
              data.gender === 'female' 
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
                className={`py-2.5 px-4 border rounded-xl transition-all font-bold cursor-pointer text-xs ${
                  isSelected 
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
          className={`w-full bg-stone-50 border ${
            errors?.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-stone-200 focus:border-[#00C7B5] focus:ring-[#00C7B5]'
          } rounded-xl py-3.5 px-4 text-stone-900 focus:outline-none transition-colors text-sm font-medium`}
        />
        {errors?.phone && (
          <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
}
