import React from 'react';
import { 
  Users, 
  Radio, 
  Shuffle, 
  Heart, 
  ArrowLeft, 
  ShieldCheck,
  LogOut,
  MapPin
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'crm' | 'phase' | 'mixer' | 'votes' | 'couples';
  setActiveTab: (tab: 'crm' | 'phase' | 'mixer' | 'votes' | 'couples') => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'crm', label: '참가자 심사 (CRM)', icon: Users, desc: '신청서 승인/거절' },
    { id: 'phase', label: '실시간 페이즈 제어', icon: Radio, desc: '글로벌 Phase 전환' },
    { id: 'mixer', label: '자동 팀 배정기', icon: Shuffle, desc: '4인 조 및 데이트 믹싱' },
    { id: 'votes', label: '투표 & 매칭 현황', icon: Heart, desc: '실시간 투표 및 결과 확정' },
    { id: 'couples', label: '1:1 매칭 & 미션 (V2)', icon: MapPin, desc: '커플별 힌트 및 미션 정보 설정' },
  ] as const;

  return (
    <div className="w-full md:w-80 bg-stone-950 border-b md:border-b-0 md:border-r border-stone-900 flex flex-col h-auto md:h-screen md:min-h-screen shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-4 md:p-6 border-b border-stone-900/80">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs tracking-[0.3em] text-teal-400 uppercase font-semibold">Host Administration</span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">LIVE</span>
        </div>
        <h1 className="font-cinzel text-2xl font-extrabold tracking-wider text-stone-100 mt-2">
          SIGNAL TRIP
        </h1>
        <p className="text-xs text-stone-500 mt-1.5 font-mono">Control Center v1.2</p>
      </div>

      {/* Menu List */}
      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center md:items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-l-xl md:rounded-r-none transition-all duration-300 group text-left cursor-pointer ${
                isActive
                  ? 'bg-teal-500/10 text-teal-400 border-r-4 border-teal-500'
                  : 'border-r-4 border-transparent hover:bg-stone-900/60 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon 
                size={20} 
                className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-teal-400' : 'text-stone-500 group-hover:text-stone-400'
                }`} 
              />
              <div className="flex flex-col">
                <p className="text-sm font-bold tracking-wide font-sans">{item.label}</p>
                <p className="hidden md:block text-xs text-stone-500 mt-1 group-hover:text-stone-400 font-light">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Settings */}
      <div className="p-4 md:p-6 border-t border-stone-900 bg-stone-950/40 space-y-2 md:space-y-3">
        <div className="flex items-center gap-2.5 p-2.5 md:p-3.5 bg-stone-900/40 border border-stone-900 rounded-xl backdrop-blur-md">
          <ShieldCheck size={16} className="text-teal-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-stone-300 truncate">관리자 보안 모드</p>
            <p className="text-[10px] md:text-[11px] text-stone-600 font-mono mt-0.5">DB Connection Secure</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2.5 w-full py-2 md:py-3 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/30 hover:border-rose-900/50 rounded-full text-xs md:text-sm text-rose-400 hover:text-rose-300 transition-all duration-300 font-bold cursor-pointer shadow-sm"
        >
          <LogOut size={14} />
          로그아웃
        </button>

        <a
          href="/"
          className="flex items-center justify-center gap-2.5 w-full py-2 md:py-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 rounded-full text-xs md:text-sm text-stone-400 hover:text-stone-200 transition-all duration-300 font-medium cursor-pointer shadow-sm"
        >
          <ArrowLeft size={14} />
          랜딩 페이지로 가기
        </a>
      </div>
    </div>
  );
};
