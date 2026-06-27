import React from 'react';
import { Briefcase } from 'lucide-react';

export type JobType = 'office_worker' | 'business_owner' | 'professional' | 'civil_servant' | 'freelancer' | 'student' | 'other' | '';

export interface Step3Data {
  jobType: JobType;
  companyName: string; // 직장명, 상호명, 직종, 기관명, 학교명 등 통합 필드
}

interface Step3Props {
  data: Step3Data;
  updateData: (fields: Partial<Step3Data>) => void;
  errors: Record<string, string>;
}

export const Step3JobVerification: React.FC<Step3Props> = ({ data, updateData, errors }) => {
  const getJobLabels = () => {
    switch (data.jobType) {
      case 'office_worker':
        return {
          nameLabel: '직장명',
          namePlaceholder: '예) 구글 코리아'
        };
      case 'business_owner':
        return {
          nameLabel: '상호명 (회사명)',
          namePlaceholder: '예) 시그널 컴퍼니'
        };
      case 'professional':
        return {
          nameLabel: '직종 / 전문분야',
          namePlaceholder: '예) 의료계 (의사), 법조계 (변호사)'
        };
      case 'civil_servant':
        return {
          nameLabel: '소속 기관명',
          namePlaceholder: '예) 서울시청, 한국전력공사'
        };
      case 'freelancer':
        return {
          nameLabel: '활동 분야 / 직무',
          namePlaceholder: '예) IT 개발 프리랜서, 프리랜서 아나운서'
        };
      case 'student':
        return {
          nameLabel: '학교명 / 학과',
          namePlaceholder: '예) 서울대학교 경영학과'
        };
      case 'other':
        return {
          nameLabel: '현재 하시는 일',
          namePlaceholder: '예) 전업 투자자, 가사'
        };
      default:
        return null;
    }
  };

  const labels = getJobLabels();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-cinzel text-xl font-bold text-gold-premium tracking-wider">Step 4. Verification</h3>
        <p className="text-xs text-stone-400 font-light mt-1">
          프리미엄 커뮤니티의 신뢰를 위해 현재 직업군과 소속을 기재해 주세요. (증빙 서류는 매칭이 성사된 후, 최종 결제 단계에서 안전하게 요청드립니다.)
        </p>
      </div>

      {/* 직업 선택 드롭다운 */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-stone-400 tracking-wider uppercase">직업 분류</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-600">
            <Briefcase size={15} />
          </span>
          <select
            value={data.jobType}
            onChange={(e) => updateData({ jobType: e.target.value as JobType, companyName: '' })}
            className={`w-full pl-10 pr-4 py-3 bg-brand-black border ${
              errors.jobType ? 'border-red-500/70 focus:border-red-500' : 'border-stone-800 focus:border-gold-premium/80'
            } rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none appearance-none cursor-pointer transition-all duration-300`}
          >
            <option value="" disabled>직업을 선택해 주세요</option>
            <option value="office_worker">직장인 (회사원)</option>
            <option value="business_owner">사업자 (대표)</option>
            <option value="professional">전문직 (의사, 변호사 등)</option>
            <option value="civil_servant">공무원 / 공기업</option>
            <option value="freelancer">프리랜서</option>
            <option value="student">학생</option>
            <option value="other">기타</option>
          </select>
          {/* Custom Select Arrow */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-stone-600">
            <span className="border-l border-r border-b border-t-0 border-stone-600 w-2 h-2 transform rotate-45 translate-y-[-2px]" />
          </div>
        </div>
        {errors.jobType && <p className="text-[11px] text-red-400 mt-1 font-light">{errors.jobType}</p>}
      </div>

      {/* 조건부 입력 필드 */}
      {data.jobType && labels && (
        <div className="space-y-5 animate-[fadeIn_0.5s_ease-out]">
          {/* 직장명/상호명/기관명/학교명 인풋 */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-stone-400 tracking-wider uppercase">
              {labels.nameLabel}
            </label>
            <input
              type="text"
              placeholder={labels.namePlaceholder}
              value={data.companyName}
              onChange={(e) => updateData({ companyName: e.target.value })}
              className={`w-full px-4 py-3 bg-brand-black border ${
                errors.companyName ? 'border-red-500/70 focus:border-red-500' : 'border-stone-800 focus:border-gold-premium/80'
              } rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none transition-all duration-300`}
            />
            <p className="text-[11px] text-stone-500 mt-1 font-light">
              * 향후 제출하실 증빙 서류(명함, 사원증 등)와 일치하는 소속을 정확히 기재해 주세요.
            </p>
            {errors.companyName && <p className="text-[11px] text-red-400 mt-1 font-light">{errors.companyName}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
