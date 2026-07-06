import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import Step1BasicInfo from './Step1BasicInfo';
import type { Step1Data } from './Step1BasicInfo';
import { Step2SignalProfile } from './Step2SignalProfile';
import type { Step2Data } from './Step2SignalProfile';
import { Step4ScheduleConsent } from './Step4ScheduleConsent';
import type { Step4Data } from './Step4ScheduleConsent';
import { SubmissionSuccess } from './SubmissionSuccess';
import { supabase } from '../supabaseClient';
import type { Application } from '../supabaseClient';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [step1Data, setStep1Data] = useState<Step1Data>({
    nickname: '',
    gender: '',
    ageGroup: '',
    phone: '',
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    musicVibes: [],
    midnightDrink: '',
    conversationStyle: '',
  });

  const [step3Data, setStep3Data] = useState<Step4Data>({
    schedule: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!step1Data.nickname.trim()) {
        newErrors.nickname = '닉네임을 입력해 주세요.';
      }
      if (!step1Data.gender) {
        newErrors.gender = '성별을 선택해 주세요.';
      }
      if (!step1Data.ageGroup) {
        newErrors.ageGroup = '연령대를 선택해 주세요.';
      }
      const numbersOnly = step1Data.phone.replace(/[^0-9]/g, '');
      if (!step1Data.phone.trim()) {
        newErrors.phone = '연락처를 입력해 주세요.';
      } else if (numbersOnly.length < 10 || numbersOnly.length > 11) {
        newErrors.phone = '올바른 연락처(10~11자리 숫자)를 입력해 주세요.';
      }
    }

    if (currentStep === 2) {
      if (step2Data.musicVibes.length === 0) {
        newErrors.musicVibes = '밤바다 음악 바이브를 최소 1개 이상 선택해 주세요.';
      }
      if (!step2Data.midnightDrink) {
        newErrors.midnightDrink = '미드나잇 주류 옵션을 선택해 주세요.';
      }
      if (!step2Data.conversationStyle) {
        newErrors.conversationStyle = '대화 스타일을 선택해 주세요.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("⚠️ 다음 항목을 확인해 주세요!\n\n" + Object.values(newErrors).join('\n'));
      return;
    }

    setErrors({});
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (step3Data.schedule.length === 0) {
      newErrors.schedule = '참여 가능한 날짜를 선택해 주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("⚠️ 다음 항목을 확인해 주세요!\n\n" + Object.values(newErrors).join('\n'));
      return;
    }

    setIsSubmitting(true);

    try {
      const signalCode = Math.floor(1000 + Math.random() * 9000).toString();
      const parsedAge = step1Data.ageGroup === '20대 중반' ? 25
        : step1Data.ageGroup === '20대 후반' ? 28
        : step1Data.ageGroup === '30대 초반' ? 32
        : step1Data.ageGroup === '30대 후반' ? 37
        : 42;

      // Supabase 테이블 에러 방지를 위해 제거된 필수 컬럼들을 placeholder 값으로 매핑
      const applicationPayload: Application = {
        name: step1Data.nickname.trim(), // 본명 미입력에 대응
        nickname: step1Data.nickname.trim(),
        phone: step1Data.phone.trim(),
        age: parsedAge,
        gender: step1Data.gender.toUpperCase() as 'MALE' | 'FEMALE',
        address: '제주', // default 제주
        mbti: 'NONE', // default NONE
        
        ideal_type: `음악: ${step2Data.musicVibes.join(', ')}`,
        bio: `대화: ${step2Data.conversationStyle}`,
        photo_urls: ['https://via.placeholder.com/150'], // 더미 이미지 채워넣기
        sns_link: 'https://via.placeholder.com/150', // 더미 채워넣기
        
        job_type: '미입력',
        company_name: '미입력',
        verification_file_url: 'https://via.placeholder.com/150', // 더미 인증 채워넣기
        
        preferred_schedules: step3Data.schedule,
        is_date_flexible: false,
        single_pledge: true, // 필수 동의 자동 true
        privacy_pledge: true, // 필수 동의 자동 true
        status: 'pending',

        deal_breaker: `음악: ${step2Data.musicVibes.join(', ')}`,
        crisis_response: `음료: ${step2Data.midnightDrink}`,
        group_position: `대화: ${step2Data.conversationStyle}`,
        signal_code: signalCode
      };

      const { error: dbError } = await supabase
        .from('applications')
        .insert([applicationPayload]);

      if (dbError) {
        throw new Error(`데이터베이스 저장 오류: ${dbError.message}`);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('제출 중 에러 발생:', err);
      alert(`⚠️ 참가 신청서 제출에 실패하였습니다.\n\n상세 정보: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsSuccess(false);
    setStep1Data({ nickname: '', gender: '', ageGroup: '', phone: '' });
    setStep2Data({ musicVibes: [], midnightDrink: '', conversationStyle: '' });
    setStep3Data({ schedule: [] });
    setErrors({});
    onClose();
  };

  const steps = [
    { label: '밤크닉 입장권', num: 1 },
    { label: '미드나잇 큐레이션', num: 2 },
    { label: '초대장 신청', num: 3 },
  ];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 9999999, padding: '20px'
      }}
      onClick={isSubmitting ? undefined : handleReset}
    >
      <style>{`
        .form-content-area {
          font-family: 'Outfit', 'Noto Serif KR', sans-serif !important;
        }
        
        .form-content-area input[type="text"],
        .form-content-area input[type="tel"] {
          width: 100% !important;
          min-height: 52px !important; 
          padding: 0 16px !important;
          font-size: 14px !important;
          border-radius: 12px !important;
          border: 1px solid #e5e7eb !important;
          background-color: #f9fafb !important;
          box-sizing: border-box !important;
          color: #1f2937 !important;
        }

        .form-content-area label {
          font-size: 13px !important;
          font-weight: 700 !important;
          color: #374151 !important;
          display: block !important;
          margin-bottom: 4px !important;
        }
      `}</style>

      <div
        className="w-full max-w-[460px] bg-white rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: '100%', height: '6px', backgroundColor: '#00C7B5' }} />

        {!isSuccess && !isSubmitting && (
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 transition-colors z-50 cursor-pointer"
          >
            <X size={24} />
          </button>
        )}

        <div className="p-8 sm:p-10 overflow-y-auto flex-1 flex flex-col">
          {!isSuccess ? (
            <>
              {/* 진행률 바 */}
              <div className="flex items-center justify-between relative mb-8 px-4">
                <div className="absolute top-[16px] left-[36px] right-[36px] height-[2px] bg-stone-100 -z-10">
                  <div className="h-[2px] bg-[#00C7B5] transition-all duration-300" style={{ width: `${((currentStep - 1) / 2) * 100}%` }} />
                </div>
                {steps.map((s) => (
                  <div key={s.num} className="flex flex-col items-center z-10 w-16">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all duration-300 ${
                      currentStep >= s.num ? 'bg-[#00C7B5] text-white' : 'bg-stone-50 border border-stone-200 text-stone-400'
                    }`}>
                      {s.num}
                    </div>
                    <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap transition-colors duration-300 ${
                      currentStep >= s.num ? 'text-[#00C7B5]' : 'text-stone-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* 입력 폼 영역 */}
              <div className="form-content-area flex-1 mb-6">
                {currentStep === 1 && (
                  <Step1BasicInfo
                    data={step1Data}
                    updateData={(fields) => setStep1Data((prev) => ({ ...prev, ...fields }))}
                    errors={errors}
                  />
                )}
                {currentStep === 2 && (
                  <Step2SignalProfile
                    data={step2Data}
                    updateData={(fields) => setStep2Data((prev) => ({ ...prev, ...fields }))}
                    errors={errors}
                  />
                )}
                {currentStep === 3 && (
                  <Step4ScheduleConsent
                    data={step3Data}
                    updateData={(fields) => setStep3Data((prev) => ({ ...prev, ...fields }))}
                    errors={errors}
                  />
                )}
              </div>

              {/* 하단 이전/다음 버튼 */}
              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-stone-500 bg-stone-50 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
                  style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                >
                  <ArrowLeft size={16} /> 이전
                </button>

                <button
                  type="button"
                  onClick={currentStep < 3 ? handleNext : handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#00C7B5] hover:bg-[#00b2a2] transition-all cursor-pointer shadow-lg shadow-teal-500/10 active:scale-[0.98]"
                >
                  {currentStep < 3 ? (
                    <>다음으로 <ArrowRight size={16} /></>
                  ) : (
                    isSubmitting ? '제출 중...' : '초대장 신청 완료하기'
                  )}
                </button>
              </div>
            </>
          ) : (
            <SubmissionSuccess onClose={handleReset} nickname={step1Data.nickname} />
          )}
        </div>
      </div>
    </div>
  );
};