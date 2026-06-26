import React, { useRef } from 'react';
import { Briefcase, Upload, CheckCircle2 } from 'lucide-react';

export type JobType = 'office_worker' | 'business_owner' | 'professional' | 'civil_servant' | 'freelancer' | 'student' | 'other' | '';

export interface Step3Data {
  jobType: JobType;
  companyName: string; // 직장명, 상호명, 직종, 기관명, 학교명 등 통합 필드
  verificationFile: string; // Base64 or filename placeholder
  fileName: string;
  verificationFileObject?: File;
}

interface Step3Props {
  data: Step3Data;
  updateData: (fields: Partial<Step3Data>) => void;
  errors: Record<string, string>;
}

export const Step3JobVerification: React.FC<Step3Props> = ({ data, updateData, errors }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getJobLabels = () => {
    switch (data.jobType) {
      case 'office_worker':
        return {
          nameLabel: '직장명',
          namePlaceholder: '예) 구글 코리아',
          fileLabel: '명함 또는 사원증 첨부',
          fileDesc: '직장 증명이 가능한 사원증 또는 회사 명함을 첨부해 주세요.'
        };
      case 'business_owner':
        return {
          nameLabel: '상호명 (회사명)',
          namePlaceholder: '예) 시그널 컴퍼니',
          fileLabel: '사업자등록증명원 첨부',
          fileDesc: '국세청 홈택스에서 발급된 사업자등록증명원을 첨부해 주세요.'
        };
      case 'professional':
        return {
          nameLabel: '직종 / 전문분야',
          namePlaceholder: '예) 의료계 (의사), 법조계 (변호사)',
          fileLabel: '자격증 또는 면허증 첨부',
          fileDesc: '해당 전문직 자격증이나 면허증의 사진을 첨부해 주세요.'
        };
      case 'civil_servant':
        return {
          nameLabel: '소속 기관명',
          namePlaceholder: '예) 서울시청, 한국전력공사',
          fileLabel: '공무원증 또는 사원증 첨부',
          fileDesc: '공무원증 또는 기관 발행 사원증을 첨부해 주세요.'
        };
      case 'freelancer':
        return {
          nameLabel: '활동 분야 / 직무',
          namePlaceholder: '예) IT 개발 프리랜서, 프리랜서 아나운서',
          fileLabel: '포트폴리오 또는 경력 증빙 첨부',
          fileDesc: '활동 내역을 증빙할 수 있는 포트폴리오(PDF) 또는 최근 계약 서류 등을 첨부해 주세요.'
        };
      case 'student':
        return {
          nameLabel: '학교명 / 학과',
          namePlaceholder: '예) 서울대학교 경영학과',
          fileLabel: '학생증 또는 재학증명서 첨부',
          fileDesc: '본인 재학 상태를 인증할 수 있는 모바일 학생증 혹은 재학증명서를 첨부해 주세요.'
        };
      case 'other':
        return {
          nameLabel: '현재 하시는 일',
          namePlaceholder: '예) 전업 투자자, 가사',
          fileLabel: '신원 또는 소득/경력 증빙 첨부',
          fileDesc: '본인의 상태를 설명하거나 인증할 수 있는 자료를 첨부해 주세요.'
        };
      default:
        return null;
    }
  };

  const labels = getJobLabels();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({
          verificationFile: reader.result as string,
          fileName: file.name,
          verificationFileObject: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-cinzel text-xl font-bold text-gold-premium tracking-wider">Step 4. Verification</h3>
        <p className="text-xs text-stone-400 font-light mt-1">가장 안전하고 프라이빗한 만남을 위해, 마지막으로 신원 인증을 진행합니다.</p>
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
            onChange={(e) => updateData({ jobType: e.target.value as JobType, companyName: '', verificationFile: '', fileName: '' })}
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
            {errors.companyName && <p className="text-[11px] text-red-400 mt-1 font-light">{errors.companyName}</p>}
          </div>

          {/* 증빙서류 업로드 UI */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-stone-400 tracking-wider uppercase">
              {labels.fileLabel}
            </label>

            <div
              onClick={triggerFileInput}
              className={`border-2 border-dashed ${
                errors.verificationFile ? 'border-red-500/50 hover:border-red-500' : 'border-stone-800 hover:border-gold-premium/40'
              } rounded-xl p-8 flex flex-col items-center justify-center bg-brand-black/50 cursor-pointer transition-all duration-300 group`}
            >
              {data.fileName ? (
                <div className="flex flex-col items-center space-y-2">
                  <CheckCircle2 size={36} className="text-gold-premium animate-[pulse_2s_infinite]" />
                  <span className="text-xs text-stone-200 font-medium">{data.fileName}</span>
                  <span className="text-[10px] text-stone-500">인증 서류가 안전하게 암호화되어 첨부되었습니다.</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Upload size={32} className="text-stone-600 group-hover:text-gold-premium transition-colors" />
                  <span className="text-xs text-stone-400 font-medium">인증 서류 업로드 (안전 보장)</span>
                  <span className="text-[10px] text-stone-500 text-center px-4 max-w-sm">
                    {labels.fileDesc} <br />(제출하신 서류는 심사 후 즉시 영구 파기됩니다.)
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />
            {errors.verificationFile && <p className="text-[11px] text-red-400 mt-1 font-light">{errors.verificationFile}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
