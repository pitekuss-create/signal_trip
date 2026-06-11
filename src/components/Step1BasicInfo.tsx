import { User, Eye, Phone, Hash, MapPin } from 'lucide-react';

const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length <= 3) {
    return cleaned;
  }
  if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  if (cleaned.length <= 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
};

export interface Step1Data {
  name: string;
  nickname: string;
  phone: string;
  age: string;
  gender: string;
  address: string;
  mbti: string;
}

interface Step1Props {
  data: Step1Data;
  updateData: (fields: Partial<Step1Data>) => void;
  errors?: Record<string, string>;
}

export default function Step1BasicInfo({ data, updateData }: Step1Props) {
  // 폼이 두 번 렌더링되지 않도록 반드시 이 컴포넌트 하나만 반환할 것.
  return (
    <div className="space-y-6 animate-fade-in text-stone-900 font-sans">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-[#00C7B5] mb-2 font-['Jua']">STEP 1. BASIC VERIFICATION</h2>
        <p className="text-sm text-stone-500">심사를 위한 기본 신원 확인 단계입니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-stone-700 font-bold pl-1">본명</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder="홍길동"
              className="w-full bg-white border border-stone-200 rounded-md py-3 pl-10 pr-4 text-stone-900 focus:outline-none focus:border-[#00C7B5] focus:ring-1 focus:ring-[#00C7B5] transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-stone-700 font-bold pl-1">닉네임</label>
          <div className="relative">
            <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={data.nickname || ''}
              onChange={(e) => updateData({ nickname: e.target.value })}
              placeholder="시그널러"
              className="w-full bg-white border border-stone-200 rounded-md py-3 pl-10 pr-4 text-stone-900 focus:outline-none focus:border-[#00C7B5] focus:ring-1 focus:ring-[#00C7B5] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-stone-700 font-bold pl-1">연락처</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                updateData({ phone: formatted });
              }}
              placeholder="010-0000-0000"
              maxLength={13}
              className="w-full bg-white border border-stone-200 rounded-md py-3 pl-10 pr-4 text-stone-900 focus:outline-none focus:border-[#00C7B5] focus:ring-1 focus:ring-[#00C7B5] transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-stone-700 font-bold pl-1">나이</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => updateData({ age: e.target.value })}
              placeholder="28"
              className="w-full bg-white border border-stone-200 rounded-md py-3 pl-10 pr-4 text-stone-900 focus:outline-none focus:border-[#00C7B5] focus:ring-1 focus:ring-[#00C7B5] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-stone-700 font-bold pl-1">성별</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateData({ gender: 'male' })}
            className={`py-3 border rounded-md transition-all font-bold ${data.gender === 'male' ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]' : 'bg-white border-stone-200 text-stone-500 hover:border-[#00C7B5]/50'}`}
          >
            MALE (남성)
          </button>
          <button
            type="button"
            onClick={() => updateData({ gender: 'female' })}
            className={`py-3 border rounded-md transition-all font-bold ${data.gender === 'female' ? 'bg-[#00C7B5]/10 border-[#00C7B5] text-[#00C7B5]' : 'bg-white border-stone-200 text-stone-500 hover:border-[#00C7B5]/50'}`}
          >
            FEMALE (여성)
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-stone-700 font-bold pl-1">거주지 주소</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={data.address || ''}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="서울특별시 강남구 압구정동"
            className="w-full bg-white border border-stone-200 rounded-md py-3 pl-10 pr-4 text-stone-900 focus:outline-none focus:border-[#00C7B5] focus:ring-1 focus:ring-[#00C7B5] transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <label className="text-sm text-stone-700 font-bold pl-1">MBTI</label>
          <a href="https://www.16personalities.com/ko/무료-성격-유형-검사" target="_blank" rel="noopener noreferrer" className="text-xs text-[#00C7B5] hover:underline">검사하러 가기</a>
        </div>
        <input
          type="text"
          value={data.mbti || ''}
          onChange={(e) => updateData({ mbti: e.target.value.toUpperCase() })}
          placeholder="INFJ"
          maxLength={4}
          className="w-full bg-white border border-stone-200 rounded-md py-3 px-4 text-stone-900 uppercase focus:outline-none focus:border-[#00C7B5] focus:ring-1 focus:ring-[#00C7B5] transition-colors font-bold tracking-widest"
        />
      </div>
    </div>
  );
}
