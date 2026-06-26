import React from 'react';
import { Check, Compass, Utensils, Frown, Sparkles } from 'lucide-react';

export interface Step3Data {
  q1: string;
  q2: string;
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
    '[고요한 영감] 빛과 건축물이 어우러진 프라이빗한 갤러리나 전시 공간',
    '[역동적 해방감] 탁 트인 해안 도로를 달리는 드라이브, 혹은 액티비티',
    '[완벽한 이완] 피톤치드 가득한 숲속, 차분한 음악이 흐르는 프라이빗 티룸',
    '[로컬의 숨결] 관광객은 모르는 낡은 골목길의 빈티지 숍과 독립 서점 산책'
  ];

  const q2Options = [
    '[밀도 높은 딥토크] 서로의 일과 꿈, 가치관에 대해 깊이 알아가는 진지한 대화',
    '[감성적인 교류] 좋아하는 영화, 취향을 저격하는 음악 리스트를 교환하는 대화',
    '[유쾌한 티키타카] 무거운 주제보다는, 시시콜콜하고 유쾌하게 웃을 수 있는 시간',
    '[편안한 침묵] 때로는 아무 말 없이 풍경을 바라봐도 전혀 어색하지 않은 여유'
  ];

  const q3Options = [
    '[섬세한 큐레이션] 셰프의 철학과 와인 페어링이 준비된 하이엔드 파인다이닝',
    '[숨겨진 내공] 간판은 허름해도 로컬들의 오랜 세월이 묻어나는 제주 찐맛집',
    '[트렌드의 최전선] 감각적인 인테리어와 세련된 음악이 흐르는 와인바/라운지',
    '[실패 없는 안전함] 모험보다는 보장된 맛과 깔끔한 시스템을 갖춘 검증된 식당'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00C7B5', letterSpacing: '1px' }}>Step 3. Taste & Vibe</h3>
        <p style={{ fontSize: '14px', color: '#666', fontWeight: 'bold', marginTop: '8px' }}>당신의 낭만적인 제주를 설계하기 위해, 몇 가지 질문을 던집니다.</p>
      </div>

      {/* Q1 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Compass size={18} color="#00C7B5" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span>Q1. 제주에서의 완벽한 오후 2시, 당신이 머물고 싶은 공간은? (단일 선택)</span>
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
          <span>Q2. 처음 만난 여행 메이트와 나누고 싶은 대화의 온도는? (단일 선택)</span>
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

      <div style={{ borderTop: '1px dashed #d6d3d1', paddingTop: '20px', marginTop: '10px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#00C7B5', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Utensils size={18} /> THE TASTE (미식의 철학)
        </h4>
      </div>

      {/* Q3 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#444', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          <Utensils size={18} color="#00C7B5" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span>Q3. 우연한 만남 후 이어지는 저녁 식사, 당신의 발길이 향하는 곳은? (단일 선택)</span>
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
          <span>Q4. 완벽한 다이닝을 위한 섬세한 배려. 식탁에 오르지 않았으면 하는 식재료가 있나요? (텍스트 입력)</span>
        </div>
        <textarea
          rows={2}
          value={data.q4 || ''}
          onChange={(e) => updateData({ q4: e.target.value })}
          placeholder="알레르기, 비건, 고수 등 못 드시는 음식이 있다면 자유롭게 적어주세요. (없으면 '없음' 기재)"
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
          <span>Q5. 제주에서 잊지 못할 밤, 이것 한 끼(또는 술 한 잔)만큼은 꼭 경험하고 싶다면? (텍스트 입력)</span>
        </div>
        <textarea
          rows={2}
          value={data.q5 || ''}
          onChange={(e) => updateData({ q5: e.target.value })}
          placeholder="예) 깊은 맛의 흑돼지와 한라산, 바다를 보며 마시는 시그니처 칵테일 등"
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