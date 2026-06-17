import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import Step1BasicInfo from './Step1BasicInfo';
import type { Step1Data } from './Step1BasicInfo';
import { Step2SignalProfile } from './Step2SignalProfile';
import type { Step2Data } from './Step2SignalProfile';
import { Step3PreInterview } from './Registration/Step3PreInterview';
import type { Step3Data as PreInterviewData } from './Registration/Step3PreInterview';
import { Step3JobVerification } from './Step3JobVerification';
import type { Step3Data } from './Step3JobVerification';
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
    name: '', nickname: '', phone: '', address: '', gender: '', age: '', mbti: '',
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    idealType: '', bio: '', photos: [], snsLink: '', photoFiles: [],
  });

  const [step3Data, setStep3Data] = useState<PreInterviewData>({
    q1: '', q2: '', groupPosition: '', q3: '', q4: '', q5: ''
  });

  const [step4Data, setStep4Data] = useState<Step3Data>({
    jobType: '', companyName: '', verificationFile: '', fileName: '', verificationFileObject: undefined,
  });

  const [step5Data, setStep5Data] = useState<Step4Data>({
    schedule: [], singlePledge: false, privacyPledge: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!step1Data.name.trim()) newErrors.name = '본명을 입력해 주세요.';
      if (!step1Data.nickname.trim()) newErrors.nickname = '닉네임을 입력해 주세요.';
      const numbersOnly = step1Data.phone.replace(/[^0-9]/g, '');
      if (!step1Data.phone.trim()) newErrors.phone = '연락처를 입력해 주세요.';
      else if (numbersOnly.length !== 10 && numbersOnly.length !== 11) newErrors.phone = '올바른 연락처(10~11자리 숫자)를 입력해 주세요.';
      if (!step1Data.age.trim()) newErrors.age = '나이를 입력해 주세요.';
      else if (parseInt(step1Data.age) < 19) newErrors.age = '만 19세 이상만 가입 가능합니다.';
      if (!step1Data.gender) newErrors.gender = '성별을 선택해 주세요.';
      if (!step1Data.address.trim()) newErrors.address = '거주지 주소를 입력해 주세요.';
      const mbtiRegex = /^[A-Za-z]{4}$/;
      if (!step1Data.mbti.trim()) newErrors.mbti = 'MBTI를 입력해 주세요.';
      else if (!mbtiRegex.test(step1Data.mbti)) newErrors.mbti = '올바른 4자리 MBTI(예: INFJ)를 입력해 주세요.';
    }

    if (currentStep === 2) {
      if (!step2Data.idealType.trim()) newErrors.idealType = '나의 여행 스타일을 입력해 주세요.';
      if (!step2Data.bio.trim()) newErrors.bio = '자기소개를 입력해 주세요.';
      if (step2Data.photos.length === 0) newErrors.photos = '사진을 업로드해 주세요.';
      if (!step2Data.snsLink.trim()) newErrors.snsLink = 'SNS 링크를 필수로 입력해 주세요.';
    }

    if (currentStep === 3) {
      if (!step3Data.q1) newErrors.q1 = 'Q1 질문에 답해주세요.';
      if (!step3Data.q2) newErrors.q2 = 'Q2 질문에 답해주세요.';
      if (!step3Data.groupPosition) newErrors.groupPosition = '모임 내 포지션을 선택해 주세요.';
      if (!step3Data.q3) newErrors.q3 = 'Q3 질문에 답해주세요.';
      if (!step3Data.q4 || !step3Data.q4.trim()) newErrors.q4 = 'Q4 질문에 답해주세요.';
      if (!step3Data.q5 || !step3Data.q5.trim()) newErrors.q5 = 'Q5 질문에 답해주세요.';
    }

    if (currentStep === 4) {
      if (!step4Data.jobType) newErrors.jobType = '직업을 선택해 주세요.';
      else {
        if (!step4Data.companyName.trim()) newErrors.companyName = '직장명/상호명을 입력해 주세요.';
        if (!step4Data.verificationFile) newErrors.verificationFile = '증빙 서류를 첨부해 주세요.';
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

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (step5Data.schedule.length === 0) newErrors.schedule = '일정을 선택해 주세요.';
    if (!step5Data.singlePledge) newErrors.singlePledge = '미혼 서약에 동의해 주세요.';
    if (!step5Data.privacyPledge) newErrors.privacyPledge = '개인정보 동의서에 동의해 주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("⚠️ 다음 항목을 확인해 주세요!\n\n" + Object.values(newErrors).join('\n'));
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 파일 존재 여부 최종 검증
      if (!step2Data.photoFiles || step2Data.photoFiles.length === 0) {
        throw new Error('업로드된 프로필 사진 파일이 유실되었습니다. 2단계로 돌아가 다시 업로드해 주세요.');
      }
      if (!step4Data.verificationFileObject) {
        throw new Error('업로드된 증빙 서류 파일이 유실되었습니다. 4단계로 돌아가 다시 업로드해 주세요.');
      }

      // 2. 파일 업로드 Helper 함수 정의
      const uploadToStorage = async (file: File, bucket: 'profile_photos' | 'verification_docs'): Promise<string> => {
        const fileExt = file.name.split('.').pop() || '';
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(uniqueName, file);

        if (error) {
          throw new Error(`${bucket} 스토리지 업로드 중 에러가 발생했습니다: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        return publicUrl;
      };

      // 3. 파일 스토리지 비동기 일괄 업로드 진행
      const photoUploadPromises = step2Data.photoFiles.map((file) => uploadToStorage(file, 'profile_photos'));
      const uploadedPhotoUrls = await Promise.all(photoUploadPromises);
      const uploadedVerificationUrl = await uploadToStorage(step4Data.verificationFileObject, 'verification_docs');

      // 4. 데이터베이스 Payload 데이터 형식 변환 및 매핑
      const applicationPayload: Application = {
        name: step1Data.name.trim(),
        nickname: step1Data.nickname.trim(),
        phone: step1Data.phone.trim(),
        age: parseInt(step1Data.age, 10),
        gender: step1Data.gender.toUpperCase() as 'MALE' | 'FEMALE',
        address: step1Data.address.trim(),
        mbti: step1Data.mbti.trim().toUpperCase(),
        
        ideal_type: step2Data.idealType.trim(),
        bio: step2Data.bio.trim(),
        photo_urls: uploadedPhotoUrls,
        sns_link: step2Data.snsLink.trim(),
        
        job_type: step4Data.jobType,
        company_name: step4Data.companyName.trim(),
        verification_file_url: uploadedVerificationUrl,
        
        preferred_schedules: step5Data.schedule,
        single_pledge: step5Data.singlePledge,
        privacy_pledge: step5Data.privacyPledge,
        status: 'pending',

        deal_breaker: `Q1: ${step3Data.q1} / Q4 지뢰: ${step3Data.q4.trim()}`,
        crisis_response: `Q2: ${step3Data.q2} / Q5 소울: ${step3Data.q5.trim()}`,
        group_position: `포지션: ${step3Data.groupPosition} / Q3: ${step3Data.q3}`
      };

      // 5. Supabase Database Insert 실행
      const { error: dbError } = await supabase
        .from('applications')
        .insert([applicationPayload]);

      if (dbError) {
        throw new Error(`데이터베이스 저장 오류: ${dbError.message}`);
      }

      // 최종 성공 단계 진입
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
    setStep1Data({ name: '', nickname: '', phone: '', address: '', gender: '', age: '', mbti: '' });
    setStep2Data({ idealType: '', bio: '', photos: [], snsLink: '', photoFiles: [] });
    setStep3Data({ q1: '', q2: '', groupPosition: '', q3: '', q4: '', q5: '' });
    setStep4Data({ jobType: '', companyName: '', verificationFile: '', fileName: '', verificationFileObject: undefined });
    setStep5Data({ schedule: [], singlePledge: false, privacyPledge: false });
    setErrors({});
    onClose();
  };

  const steps = [
    { label: '기본인증', num: 1 },
    { label: '프로필', num: 2 },
    { label: '인터뷰', num: 3 },
    { label: '신원인증', num: 4 },
    { label: '서약완료', num: 5 },
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
      {/* 🚨 하위 폼(Step1~4)의 디자인을 세로형 & 대형으로 강제 변환하는 마법의 CSS 🚨 */}
      <style>{`
        .form-content-area {
          font-family: 'Gowun Dodum', sans-serif !important;
        }
        
        /* 옆으로 퍼진 그리드를 무조건 세로로 1줄씩 떨어지게 강제 */
        .form-content-area .grid {
          display: flex !important;
          flex-direction: column !important;
          gap: 1.5rem !important;
        }

        /* 입력칸 40% 벌크업 (높이 56px 적용) */
        .form-content-area input[type="text"],
        .form-content-area input[type="tel"],
        .form-content-area input[type="number"],
        .form-content-area select,
        .form-content-area textarea {
          width: 100% !important;
          min-height: 56px !important; 
          padding: 0 16px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          border: 1px solid #d6d3d1 !important;
          background-color: #fcfcfc !important;
          margin-top: 8px !important;
          box-sizing: border-box !important;
          color: #1c1c1e !important;
        }

        /* 아이콘이 인풋 박스 안에 있을 경우 글씨와 겹치지 않게 여백 강제 확보 */
        .form-content-area .relative input,
        .form-content-area .relative select {
          padding-left: 44px !important; 
        }
        .form-content-area .relative svg {
          position: absolute !important;
          left: 14px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          color: #999 !important;
          width: 20px !important;
          height: 20px !important;
        }

        /* 텍스트 에리어(자기소개 등) 높이 확보 */
        .form-content-area textarea {
          padding: 16px !important;
          min-height: 120px !important;
          resize: none !important;
        }

        /* 제목(라벨) 텍스트 가독성 향상 */
        .form-content-area label, .form-content-area p {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #444 !important;
          display: block !important;
          margin-bottom: 6px !important;
        }

        /* 성별 버튼 등 선택 버튼 벌크업 */
        .form-content-area button {
          min-height: 52px !important;
          font-size: 15px !important;
          font-weight: bold !important;
          border-radius: 12px !important;
        }
      `}</style>

      <div
        style={{
          /* 🚨 팝업 가로 크기를 스마트폰 뷰(540px)로 줄여서 세로로 길쭉하게 유도 🚨 */
          position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: '#ffffff',
          borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', backgroundColor: '#00C7B5' }} />

        {!isSuccess && !isSubmitting && (
          <button
            onClick={handleReset}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', zIndex: 50 }}
          >
            <X size={24} />
          </button>
        )}

        {/* 패딩을 넉넉하게 주어 숨통 틔우기 */}
        <div style={{ padding: '40px 32px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!isSuccess ? (
            <>
              {/* 진행률 바 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: '40px' }}>
                <div style={{ position: 'absolute', top: '16px', left: '30px', right: '30px', height: '2px', backgroundColor: '#f0f0f0', zIndex: 0 }}>
                  <div style={{ height: '100%', backgroundColor: '#00C7B5', width: `${((currentStep - 1) / 4) * 100}%`, transition: 'width 0.3s ease' }} />
                </div>
                {steps.map((s) => (
                  <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, width: '60px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 'bold', marginBottom: '8px',
                      backgroundColor: currentStep >= s.num ? '#00C7B5' : '#f5f5f4',
                      color: currentStep >= s.num ? '#fff' : '#999',
                      transition: 'all 0.3s ease'
                    }}>
                      {s.num}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: currentStep >= s.num ? '#00C7B5' : '#999', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* 🚨 이 영역 하위의 폼들이 위의 <style>에 의해 벌크업 됩니다 🚨 */}
              <div className="form-content-area" style={{ flex: 1, marginBottom: '20px' }}>
                {currentStep === 1 && <Step1BasicInfo data={step1Data} updateData={(fields) => setStep1Data((prev) => ({ ...prev, ...fields }))} errors={errors} />}
                {currentStep === 2 && <Step2SignalProfile data={step2Data} updateData={(fields) => setStep2Data((prev) => ({ ...prev, ...fields }))} errors={errors} />}
                {currentStep === 3 && <Step3PreInterview data={step3Data} updateData={(fields) => setStep3Data((prev) => ({ ...prev, ...fields }))} errors={errors} />}
                {currentStep === 4 && <Step3JobVerification data={step4Data} updateData={(fields) => setStep4Data((prev) => ({ ...prev, ...fields }))} errors={errors} />}
                {currentStep === 5 && <Step4ScheduleConsent data={step5Data} updateData={(fields) => setStep5Data((prev) => ({ ...prev, ...fields }))} errors={errors} isSubmitting={isSubmitting} onSubmit={handleSubmit} />}
              </div>

              {/* 하단 이전/다음 버튼 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '24px', borderTop: '2px solid #f5f5f4' }}>
                <button
                  type="button"
                  onClick={handlePrev}
                  style={{
                    visibility: currentStep === 1 ? 'hidden' : 'visible',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '16px 24px', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 'bold', color: '#666',
                    backgroundColor: '#f5f5f4', border: 'none', cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <ArrowLeft size={16} /> 이전
                </button>

                <button
                  type="button"
                  onClick={currentStep < 5 ? handleNext : handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '16px 36px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: 'bold', color: '#fff',
                    backgroundColor: '#00C7B5', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,199,181,0.2)',
                    opacity: isSubmitting ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {currentStep < 5 ? (
                    <>다음으로 <ArrowRight size={16} /></>
                  ) : (
                    isSubmitting ? '제출 중...' : '신청 완료하기'
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