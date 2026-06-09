import React from 'react';
import { Check, Heart, ShieldAlert, Users } from 'lucide-react';

export interface Step3Data {
  dealBreaker: string[];
  crisisResponse: string[];
  groupPosition: string;
}

interface Step3Props {
  data: Step3Data;
  updateData: (fields: Partial<Step3Data>) => void;
  errors: Record<string, string>;
}

export const Step3PreInterview: React.FC<Step3Props> = ({ data, updateData, errors }) => {
  const dealBreakerOptions = ['심한 흡연', '과도한 음주', '연락 두절', '예의 없는 태도', '없음'];
  const crisisResponseOptions = ['장거리 연애 가능', '연상 선호', '연하 선호', '나이 상관없음'];
  const groupPositionOptions = [
    '대화를 주도하는 MC',
    '리액션 봇 리스너',
    '조용히 고기 굽는 다정함',
    '엉뚱한 분위기 메이커'
  ];

  const handleDealBreakerToggle = (option: string) => {
    let updated: string[];
    if (option === '없음') {
      updated = data.dealBreaker.includes('없음') ? [] : ['없음'];
    } else {
      if (data.dealBreaker.includes(option)) {
        updated = data.dealBreaker.filter(item => item !== option);
      } else {
        updated = [...data.dealBreaker.filter(item => item !== '없음'), option];
      }
    }
    updateData({ dealBreaker: updated });
  };

  const handleCrisisResponseToggle = (option: string) => {
    let updated: string[];
    if (option === '나이 상관없음') {
      if (data.crisisResponse.includes('나이 상관없음')) {
        updated = data.crisisResponse.filter(item => item !== '나이 상관없음');
      } else {
        updated = [...data.crisisResponse.filter(item => item !== '연상 선호' && item !== '연하 선호'), '나이 상관없음'];
      }
    } else if (option === '연상 선호' || option === '연하 선호') {
      if (data.crisisResponse.includes(option)) {
        updated = data.crisisResponse.filter(item => item !== option);
      } else {
        updated = [...data.crisisResponse.filter(item => item !== '나이 상관없음'), option];
      }
    } else {
      updated = data.crisisResponse.includes(option)
        ? data.crisisResponse.filter(item => item !== option)
        : [...data.crisisResponse, option];
    }
    updateData({ crisisResponse: updated });
  };

  const handleGroupPositionSelect = (option: string) => {
    updateData({ groupPosition: option });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left' }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00C7B5', letterSpacing: '1px' }}>Step 3. Pre-Interview</h3>
        <p style={{ fontSize: '14px', color: '#666', fontWeight: 'bold', marginTop: '8px' }}>참가자의 성향과 매칭 조건을 파악하기 위한 사전 인터뷰입니다.</p>
      </div>

      {/* 1. 절대 불가 조건 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <ShieldAlert size={18} color="#00C7B5" />
          <span>아무리 매력적이어도 절대 타협할 수 없는 조건은? (중복 가능)</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {dealBreakerOptions.map((opt) => {
            const isSelected = data.dealBreaker.includes(opt);
            return (
              <div
                key={opt}
                onClick={() => handleDealBreakerToggle(opt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 18px', borderRadius: '24px',
                  border: isSelected ? '2px solid #00C7B5' : '1px solid #d6d3d1',
                  backgroundColor: isSelected ? '#e6f9f7' : '#fff',
                  color: isSelected ? '#00C7B5' : '#555',
                  fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                  fontSize: '14px'
                }}
              >
                {isSelected && <Check size={14} strokeWidth={3} />}
                {opt}
              </div>
            );
          })}
        </div>
        {errors.dealBreaker && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.dealBreaker}</p>}
      </div>

      {/* 2. 현실적 매칭 조건 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Heart size={18} color="#00C7B5" />
          <span>원활한 매칭을 위해 본인의 연애 선호도를 모두 체크해 주세요. (중복 가능)</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {crisisResponseOptions.map((opt) => {
            const isSelected = data.crisisResponse.includes(opt);
            return (
              <div
                key={opt}
                onClick={() => handleCrisisResponseToggle(opt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 18px', borderRadius: '24px',
                  border: isSelected ? '2px solid #00C7B5' : '1px solid #d6d3d1',
                  backgroundColor: isSelected ? '#e6f9f7' : '#fff',
                  color: isSelected ? '#00C7B5' : '#555',
                  fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                  fontSize: '14px'
                }}
              >
                {isSelected && <Check size={14} strokeWidth={3} />}
                {opt}
              </div>
            );
          })}
        </div>
        {errors.crisisResponse && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.crisisResponse}</p>}
      </div>

      {/* 3. 모임 내 포지션 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Users size={18} color="#00C7B5" />
          <span>4인 1조 낯선 식사 자리에서 당신의 포지션은? (택 1)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {groupPositionOptions.map((opt) => {
            const isSelected = data.groupPosition === opt;
            return (
              <div
                key={opt}
                onClick={() => handleGroupPositionSelect(opt)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', borderRadius: '12px',
                  border: isSelected ? '2px solid #00C7B5' : '1px solid #d6d3d1',
                  backgroundColor: isSelected ? '#e6f9f7' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: isSelected ? '#00C7B5' : '#444' }}>{opt}</span>
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
        {errors.groupPosition && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.groupPosition}</p>}
      </div>
    </div>
  );
};
