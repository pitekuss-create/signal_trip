import React from 'react';
import { Calendar, ShieldAlert, Check } from 'lucide-react';

export interface Step4Data {
  schedule: string[];
  singlePledge: boolean;
  privacyPledge: boolean;
}

interface Step4Props {
  data: Step4Data;
  updateData: (fields: Partial<Step4Data>) => void;
  errors: Record<string, string>;
  isSubmitting?: boolean;
  onSubmit?: () => void;
}

export const Step4ScheduleConsent: React.FC<Step4Props> = ({
  data,
  updateData,
  errors,
}) => {
  const scheduleOptions = [
    { id: '6월25일~26일(1박2일)', label: '6월25일~26일(1박2일)' },
    { id: '6월27일~28일(1박2일)', label: '6월27일~28일(1박2일)' },
    { id: '7월2일~3일(1박2일)', label: '7월2일~3일(1박2일)' },
    { id: '7월4일~5일(1박2일)', label: '7월4일~5일(1박2일)' },
    { id: 'waitlist', label: '정해진 일정 외 참가 : 추후 참가 모집 시 문자 알림 받기' }
  ];

  const handleScheduleToggle = (id: string) => {
    const updatedSchedule = data.schedule.includes(id)
      ? data.schedule.filter((item) => item !== id)
      : [...data.schedule, id];
    updateData({ schedule: updatedSchedule });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00C7B5', letterSpacing: '1px' }}>Step 5. Final Declaration</h3>
        <p style={{ fontSize: '14px', color: '#666', fontWeight: 'bold', marginTop: '8px' }}>참가 일정 및 서비스 규정 준수를 위한 서약입니다.</p>
      </div>

      {/* 일정 선택 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Calendar size={18} color="#00C7B5" />
          <span>선호 참가 일정 (중복 선택 가능)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scheduleOptions.map((opt) => {
            const isSelected = data.schedule.includes(opt.id);
            return (
              <div
                key={opt.id}
                onClick={() => handleScheduleToggle(opt.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', borderRadius: '12px',
                  border: isSelected ? '2px solid #00C7B5' : '1px solid #d6d3d1',
                  backgroundColor: isSelected ? '#e6f9f7' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: isSelected ? '#00C7B5' : '#444' }}>{opt.label}</span>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: isSelected ? '2px solid #00C7B5' : '2px solid #d6d3d1',
                  backgroundColor: isSelected ? '#00C7B5' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* 일정 변경 관련 안내 문구 */}
        <div style={{
          marginTop: '16px',
          padding: '14px 18px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#475569',
          fontWeight: 'bold',
          wordBreak: 'keep-all'
        }}>
          📌 [안내] 제출 완료 후 부득이하게 일정을 변경하셔야 할 경우, 관리자 이메일(<a href="mailto:noteband@naver.com" style={{ color: '#00C7B5', textDecoration: 'underline' }}>noteband@naver.com</a>)로 직접 문의해 주시기 바랍니다.
        </div>

        {errors.schedule && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.schedule}</p>}
      </div>

      {/* 미혼 및 법적 책임 서약 (레드 박스) */}
      <div style={{
        border: data.singlePledge ? '2px solid #ef4444' : '1px solid #fca5a5',
        backgroundColor: data.singlePledge ? '#fef2f2' : '#fff',
        borderRadius: '16px', padding: '20px', transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <ShieldAlert size={28} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              미혼 및 사실혼 관계 확인 서약
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}>CRITICAL</span>
            </h4>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', fontWeight: 'bold', margin: 0, wordBreak: 'keep-all' }}>
              본인은 현재 법적인 미혼이며, 기혼 또는 사실혼 관계임이 발각될 경우 프로그램 즉각 퇴소는 물론, 영업방해로 <strong style={{ color: '#dc2626', textDecoration: 'underline' }}>2,000만 원의 손해배상</strong>을 청구함에 법적으로 동의합니다.
            </p>

            {/* 체크박스 클릭 영역을 완전히 분리 */}
            <div
              onClick={() => updateData({ singlePledge: !data.singlePledge })}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginTop: '8px' }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
                border: data.singlePledge ? '2px solid #ef4444' : '2px solid #d6d3d1',
                backgroundColor: data.singlePledge ? '#ef4444' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}>
                {data.singlePledge && <Check size={16} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: data.singlePledge ? '#dc2626' : '#666', lineHeight: '1.4' }}>
                위 내용에 전적으로 동의하며, 허위 서약 시 법적 처벌을 감수합니다. (필수)
              </span>
            </div>
          </div>
        </div>
        {errors.singlePledge && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '12px', marginLeft: '40px' }}>{errors.singlePledge}</p>}
      </div>

      {/* 개인정보 제공 동의 */}
      <div style={{ padding: '16px 0', borderBottom: '2px solid #f0f0f0' }}>
        <div
          onClick={() => updateData({ privacyPledge: !data.privacyPledge })}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
            border: data.privacyPledge ? '2px solid #00C7B5' : '2px solid #d6d3d1',
            backgroundColor: data.privacyPledge ? '#00C7B5' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}>
            {data.privacyPledge && <Check size={16} color="#fff" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: data.privacyPledge ? '#00C7B5' : '#666' }}>
            개인정보 제공 및 매칭 프로세스 활용에 동의합니다. (필수)
          </span>
        </div>
        {errors.privacyPledge && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px', marginLeft: '34px' }}>{errors.privacyPledge}</p>}
      </div>

    </div>
  );
};