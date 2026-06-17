import React from 'react';
import { Check, Compass, Users, Utensils, Frown, Sparkles } from 'lucide-react';

export interface Step3Data {
  q1: string;
  q2: string;
  groupPosition: string;
  q3: string;
  q4: string;
  q5: string;
}

interface Step3Props {
  data: Step3Data;
  updateData: (fields: Partial<Step3Data>) => void;
  errors: Record<string, string>;
}

export const Step3PreInterview: React.FC<Step3Props> = ({ data, updateData, errors }) => {
  const q1Options = [
    '[묵직한 영감] 빛과 건축물이 어우러진 고요하고 프라이빗한 미술관이나 전시 공간',
    '[맥박의 상승] 아드레날린이 터지는 오프로드 버기카, 혹은 액티비티',
    '[완벽한 이완] 피톤치드가 가득한 숲속 웰니스 티타임, 혹은 요가 클래스',
    '[로컬의 숨결] 관광객은 모르는 낡은 골목길과 독립 서점을 여유롭게 걷는 산책'
  ];

  const q2Options = [
    '[치밀한 설계자] "동선 낭비는 참을 수 없다." 시간 단위로 짜인 플랜과 예약 내역을 보며 안정감을 느낀다.',
    '[유연한 탐험가] "큰 틀만 있으면 충분하다." 대략적인 동선만 둔 채, 그날의 날씨와 기분에 따라 유연하게 움직인다.',
    '[극한의 즉흥러] "계획은 없다. 끌리는 곳이 곧 목적지다." 낯선 우연이 만들어내는 변수를 오히려 즐긴다.'
  ];

  const groupPositionOptions = [
    '대화를 주도하는 MC',
    '리액션 봇 리스너',
    '조용히 고기 굽는 다정함',
    '엉뚱한 분위기 메이커'
  ];

  const q3Options = [
    '[극강의 큐레이션] 수개월 전부터 예약을 서둘러야 하는 정제된 하이엔드 파인다이닝이나 오마카세',
    '[숨겨진 내공] 간판은 허름하지만, 그 지역 로컬들의 철학과 세월이 고스란히 담긴 노포 찐맛집',
    '[트렌드의 최전선] 지금 SNS에서 가장 감각적이라고 소문난, 음악과 인테리어가 완벽한 와인바/라운지',
    '[실패 없는 안전함] 모험보다는 보장된 맛과 위생, 깔끔한 시스템을 갖춘 검증된 프랜차이즈나 대형 식당'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00C7B5', letterSpacing: '1px' }}>Step 3. Pre-Interview</h3>
        <p style={{ fontSize: '14px', color: '#666', fontWeight: 'bold', marginTop: '8px' }}>참가자의 성향과 취향 매칭을 위한 사전 인터뷰입니다.</p>
      </div>

      {/* Q1 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Compass size={18} color="#00C7B5" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span>Q1. 제주에서의 완벽한 오후 2시, 당신은 지금 어떤 공간에 머물고 있습니까? (단일 선택)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q1Options.map((opt) => {
            const isSelected = data.q1 === opt;
            return (
              <div
                key={opt}
                onClick={() => updateData({ q1: opt })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px',
                  border: isSelected ? '2px solid #00C7B5' : '1px solid #d6d3d1',
                  backgroundColor: isSelected ? '#e6f9f7' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: isSelected ? '#00C7B5' : '#555', lineHeight: '1.4', paddingRight: '8px' }}>{opt}</span>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  border: isSelected ? '2px solid #00C7B5' : '2px solid #d6d3d1',
                  backgroundColor: isSelected ? '#00C7B5' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
        {errors.q1 && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.q1}</p>}
      </div>

      {/* Q2 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Compass size={18} color="#00C7B5" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span>Q2. 미션을 향해 떠나는 첫날 아침, 당신의 여행 스타일에 가장 가까운 모습은? (단일 선택)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q2Options.map((opt) => {
            const isSelected = data.q2 === opt;
            return (
              <div
                key={opt}
                onClick={() => updateData({ q2: opt })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px',
                  border: isSelected ? '2px solid #00C7B5' : '1px solid #d6d3d1',
                  backgroundColor: isSelected ? '#e6f9f7' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: isSelected ? '#00C7B5' : '#555', lineHeight: '1.4', paddingRight: '8px' }}>{opt}</span>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  border: isSelected ? '2px solid #00C7B5' : '2px solid #d6d3d1',
                  backgroundColor: isSelected ? '#00C7B5' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
        {errors.q2 && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.q2}</p>}
      </div>

      {/* groupPosition */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Users size={18} color="#00C7B5" />
          <span>4인 1조 낯선 식사 자리에서 당신의 포지션은? (택 1)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {groupPositionOptions.map((opt) => {
            const isSelected = data.groupPosition === opt;
            return (
              <div
                key={opt}
                onClick={() => updateData({ groupPosition: opt })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px',
                  border: isSelected ? '2px solid #00C7B5' : '1px solid #d6d3d1',
                  backgroundColor: isSelected ? '#e6f9f7' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: isSelected ? '#00C7B5' : '#555' }}>{opt}</span>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  border: isSelected ? '2px solid #00C7B5' : '2px solid #d6d3d1',
                  backgroundColor: isSelected ? '#00C7B5' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
        {errors.groupPosition && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.groupPosition}</p>}
      </div>

      <div style={{ borderTop: '1px dashed #d6d3d1', paddingTop: '20px', marginTop: '10px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#00C7B5', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Utensils size={18} /> THE TASTE (미식의 철학)
        </h4>
      </div>

      {/* Q3 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Utensils size={18} color="#00C7B5" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span>Q3. 낯선 여행지에서의 완벽한 첫 번째 저녁 식사, 당신의 발길이 향하는 곳은? (단일 선택)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q3Options.map((opt) => {
            const isSelected = data.q3 === opt;
            return (
              <div
                key={opt}
                onClick={() => updateData({ q3: opt })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px',
                  border: isSelected ? '2px solid #00C7B5' : '1px solid #d6d3d1',
                  backgroundColor: isSelected ? '#e6f9f7' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: isSelected ? '#00C7B5' : '#555', lineHeight: '1.4', paddingRight: '8px' }}>{opt}</span>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  border: isSelected ? '2px solid #00C7B5' : '2px solid #d6d3d1',
                  backgroundColor: isSelected ? '#00C7B5' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
        {errors.q3 && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.q3}</p>}
      </div>

      {/* Q4 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          <Frown size={18} color="#00C7B5" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>Q4. 함께 48시간을 보낼 크루들을 위해 미리 알려주세요. 식탁에 "절대 올라와서는 안 되는" 지뢰(Dealbreaker)가 있습니까? (텍스트 입력)</span>
        </div>
        <textarea
          rows={2}
          value={data.q4 || ''}
          onChange={(e) => updateData({ q4: e.target.value })}
          placeholder="알레르기, 비건, 고수 등 특정 향신료, 전혀 못 먹는 음식이나 식재료를 자유롭게 적어주세요. (없으면 '없음' 기재)"
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #d6d3d1',
            fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box'
          }}
        />
        {errors.q4 && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.q4}</p>}
      </div>

      {/* Q5 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          <Sparkles size={18} color="#00C7B5" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>Q5. 아무리 일정이 빡빡하고 배가 불러도, "제주에 왔다면 이것 한 끼(또는 술 한 잔)만큼은 무조건 먹고 돌아가야 한다"는 당신만의 소울푸드가 있다면? (텍스트 입력)</span>
        </div>
        <textarea
          rows={2}
          value={data.q5 || ''}
          onChange={(e) => updateData({ q5: e.target.value })}
          placeholder="흑돼지, 고등어회, 특정 카페의 시그니처 커피, 특정한 무드의 칵테일 등 자유롭게 적어주세요."
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #d6d3d1',
            fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box'
          }}
        />
        {errors.q5 && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', marginTop: '8px' }}>{errors.q5}</p>}
      </div>

    </div>
  );
};
