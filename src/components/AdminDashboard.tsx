import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminSidebar } from './Admin/AdminSidebar';
import { CRMTab } from './Admin/CRMTab';
import { PhaseControlTab } from './Admin/PhaseControlTab';
import { TeamMixerTab } from './Admin/TeamMixerTab';
import { VoteViewerTab } from './Admin/VoteViewerTab';
import { CouplesTab } from './Admin/CouplesTab';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crm' | 'phase' | 'mixer' | 'votes' | 'couples'>('crm');
  const [toast, setToast] = useState({ message: '', visible: false });

  // Toast helper
  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/admin';
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ message: '', visible: false });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen w-full overflow-x-hidden relative">
        {/* Background glow decorator */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Active Tab Panel */}
        <div className="max-w-7xl mx-auto relative z-10 space-y-8 animate-[fadeIn_0.4s_ease-out]">
          {/* Header Description */}
          <div className="border-b border-stone-900/80 pb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
              <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase font-bold">Control Panel</span>
            </div>
            <h2 className="text-2xl font-black font-sans tracking-tight text-stone-100 uppercase">
              {activeTab === 'crm' && '참가 지원자 심사 관리 (CRM)'}
              {activeTab === 'phase' && '실시간 글로벌 페이즈 제어기 (Live Controller)'}
              {activeTab === 'mixer' && '자동 팀 믹서 및 데이트 매칭 (Auto Mixer)'}
              {activeTab === 'votes' && '참가자 투표 및 최종 매칭 집계 (Vote Viewer)'}
              {activeTab === 'couples' && '1:1 매칭 커플 및 시크릿 미션 관리 (V2)'}
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-light tracking-wide">
              {activeTab === 'crm' && '모든 지원서의 정보를 검토하고 참가 승인 여부를 제어합니다.'}
              {activeTab === 'phase' && '행사 현장 타임라인에 맞춰 모든 참가자들의 폰 화면 상태를 강제 전환합니다.'}
              {activeTab === 'mixer' && '승인된 8명의 참가자들을 5:5 성비에 맞춰 조별(A/B) 및 1:1로 랜덤 믹싱합니다.'}
              {activeTab === 'votes' && '1차 투표 결과 점수 합산 및 최종 선택의 상호 지목 매칭 정보를 실시간 모니터링합니다.'}
              {activeTab === 'couples' && '매칭된 1:1 커플들의 비밀 만남 장소, 시간, 상대방 식별 힌트, 도착 후 지령 및 비동기 단계를 수동 설정합니다.'}
            </p>
          </div>

          <div>
            {activeTab === 'crm' && <CRMTab showToast={showToast} />}
            {activeTab === 'phase' && <PhaseControlTab showToast={showToast} />}
            {activeTab === 'mixer' && <TeamMixerTab showToast={showToast} />}
            {activeTab === 'votes' && <VoteViewerTab showToast={showToast} />}
            {activeTab === 'couples' && <CouplesTab showToast={showToast} />}
          </div>
        </div>
      </main>

      {/* Toast popup */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-stone-900/95 border border-teal-500/30 text-stone-200 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold tracking-wide flex items-center gap-3 text-left font-sans"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
