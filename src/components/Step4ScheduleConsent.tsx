import React, { useState } from 'react';
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
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); // 2026년 7월 (0-indexed 6)

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const gridItems: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    gridItems.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    gridItems.push(new Date(year, month, d));
  }

  const minDate = new Date(2026, 6, 3); // 2026년 7월 3일

  const isBeforeMinDate = (date: Date) => {
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return compareDate < minDate;
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    if (data.schedule.includes(dateStr)) {
      updateData({ schedule: [] });
    } else {
      updateData({ schedule: [dateStr] });
    }
  };

  const handleFlexibleToggle = () => {
    if (data.schedule.includes('flexible')) {
      updateData({ schedule: [] });
    } else {
      updateData({ schedule: ['flexible'] });
    }
  };

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev >= new Date(2026, 6, 1)) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
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
          <span>선호 참가 일정 (단일 선택)</span>
        </div>

        {/* Calendar UI Container */}
        <div style={{
          border: '1px solid #d6d3d1',
          borderRadius: '16px',
          padding: '20px',
          backgroundColor: '#fcfcfc',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          {/* Navigation Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={year === 2026 && month === 6}
              style={{
                background: 'transparent',
                border: 'none',
                color: (year === 2026 && month === 6) ? '#cbd5e1' : '#00C7B5',
                cursor: (year === 2026 && month === 6) ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '4px 12px',
                outline: 'none'
              }}
            >
              &lt;
            </button>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {year}년 {month + 1}월
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#00C7B5',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '4px 12px',
                outline: 'none'
              }}
            >
              &gt;
            </button>
          </div>

          {/* Weekdays Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <span key={day} style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
            {gridItems.map((dateVal, idx) => {
              if (!dateVal) {
                return <div key={`empty-${idx}`} />;
              }
              const isBeforeMin = isBeforeMinDate(dateVal);
              const dateStr = formatDate(dateVal);
              const isSelected = data.schedule.includes(dateStr);

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isBeforeMin}
                  onClick={() => handleDateClick(dateVal)}
                  style={{
                    background: isSelected ? '#00C7B5' : 'transparent',
                    border: 'none',
                    borderRadius: '50%',
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1/1',
                    maxWidth: '40px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isSelected ? '#ffffff' : (isBeforeMin ? '#cbd5e1' : '#334155'),
                    cursor: isBeforeMin ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {dateVal.getDate()}
                </button>
              );
            })}
          </div>

          {/* Selected Date Preview text */}
          {data.schedule.length > 0 && !data.schedule.includes('flexible') && (
            <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: 'bold', color: '#00C7B5', textAlign: 'center' }}>
              선택한 일정: {data.schedule[0]}
            </div>
          )}
        </div>

        {/* 제주 여행 예정 checkbox */}
        <div
          onClick={handleFlexibleToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderRadius: '12px',
            border: data.schedule.includes('flexible') ? '2px solid #00C7B5' : '1px solid #d6d3d1',
            backgroundColor: data.schedule.includes('flexible') ? '#e6f9f7' : '#ffffff',
            cursor: 'pointer',
            marginTop: '16px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: data.schedule.includes('flexible') ? '2px solid #00C7B5' : '2px solid #d6d3d1',
            backgroundColor: data.schedule.includes('flexible') ? '#00C7B5' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {data.schedule.includes('flexible') && <Check size={16} color="#ffffff" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: data.schedule.includes('flexible') ? '#00C7B5' : '#444', lineHeight: '1.4' }}>
            제주 여행 예정 - 취향이 비슷한 여행 메이트가 나타날 경우 연락 (일정 조율)
          </span>
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