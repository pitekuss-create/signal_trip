import React, { useEffect, useState } from 'react';
import { supabase, type Application } from '../../supabaseClient';
import { 
  Check, 
  X, 
  Eye, 
  Search, 
  ExternalLink,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';

interface CRMTabProps {
  showToast: (msg: string) => void;
}

export const CRMTab: React.FC<CRMTabProps> = ({ showToast }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'archived'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data as unknown as Application[]) || []);
    } catch (err: unknown) {
      console.error(err);
      showToast('❌ 지원자 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update status (Approve / Reject / Pending / Archived)
  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending' | 'archived') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      let msg = '✅ 지원서가 승인되었습니다.';
      if (newStatus === 'rejected') {
        msg = '⚠️ 지원서가 거절되었습니다.';
      } else if (newStatus === 'pending') {
        msg = '⏳ 지원서가 대기 상태로 변경되었습니다.';
      } else if (newStatus === 'archived') {
        msg = '📁 지원서가 이전 기수로 보관되었습니다.';
      }
      showToast(msg);
      setSelectedApp(null); // 모달 닫기
      fetchApplications();  // 리스트 리페치
    } catch (err: unknown) {
      console.error(err);
      showToast('❌ 상태 변경 중 오류가 발생했습니다.');
    }
  };


  // Filter & Search logic
  const filteredApps = applications.filter(app => {
    const matchesFilter = filter === 'all' 
      ? app.status !== 'archived'
      : app.status === filter;

    const matchesDate = selectedDate === 'all'
      ? true
      : (app.preferred_schedules && app.preferred_schedules.includes(selectedDate));

    const matchesSearch = 
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.nickname.toLowerCase().includes(search.toLowerCase()) ||
      app.mbti.toLowerCase().includes(search.toLowerCase()) ||
      app.company_name.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesDate && matchesSearch;
  });

  // Count helper
  const getCounts = (status: 'all' | 'pending' | 'approved' | 'rejected' | 'archived') => {
    if (status === 'all') return applications.filter(app => app.status !== 'archived').length;
    return applications.filter(app => app.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[
          { label: '전체 신청서', count: getCounts('all'), color: 'text-stone-300 bg-stone-900 border-stone-800' },
          { label: '대기 중', count: getCounts('pending'), color: 'text-amber-400 bg-stone-900 border-stone-800' },
          { label: '승인 완료', count: getCounts('approved'), color: 'text-teal-400 bg-stone-900 border-stone-800' },
          { label: '거절됨', count: getCounts('rejected'), color: 'text-rose-400 bg-stone-900 border-stone-800' },
          { label: '이전 기수', count: getCounts('archived'), color: 'text-purple-400 bg-stone-900 border-stone-800' },
        ].map((c, idx) => (
          <div key={idx} className={`p-6 border rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-stone-700 transition-all duration-300 ${c.color}`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs text-stone-500 font-bold tracking-widest uppercase">{c.label}</span>
            <p className="text-4xl font-mono font-extrabold mt-3 tracking-tight">{c.count}명</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Status Filters */}
        <div className="flex bg-stone-950 p-1 border border-stone-900 rounded-full shrink-0 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                filter === s
                  ? 'bg-teal-500/10 text-teal-400 font-extrabold'
                  : 'text-stone-550 hover:text-stone-300'
              }`}
            >
              {s === 'all' && '전체'}
              {s === 'pending' && '대기'}
              {s === 'approved' && '승인'}
              {s === 'rejected' && '거절'}
              {s === 'archived' && '이전 기수'}
              <span className="ml-1 text-xs font-mono opacity-60">({getCounts(s)})</span>
            </button>
          ))}
        </div>

        {/* Date Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Date Filter */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 bg-stone-950 border border-stone-900 focus:border-teal-500/50 rounded-full text-sm focus:outline-none transition-all text-stone-300 shadow-inner cursor-pointer"
          >
            <option value="all">모든 참여 날짜</option>
            <option value="6월 22일 ~ 24일 (2박 3일)">6월 22일 ~ 24일 (2박 3일)</option>
            <option value="6월 26일 ~ 28일 (2박 3일)">6월 26일 ~ 28일 (2박 3일)</option>
            <option value="7월 6일 ~ 8일 (2박 3일)">7월 6일 ~ 8일 (2박 3일)</option>
            <option value="7월 10일 ~ 12일 (2박 3일)">7월 10일 ~ 12일 (2박 3일)</option>
            <option value="waitlist">정해진 일정 외 참가</option>
          </select>

          {/* Search */}
          <div className="relative w-full md:w-64 lg:w-80">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-550">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="이름, 닉네임, 회사, MBTI 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-5 py-3 bg-stone-950 border border-stone-900 focus:border-teal-500/50 rounded-full text-sm focus:outline-none transition-all placeholder-stone-600 text-stone-200 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Main CRM Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-stone-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mx-auto mb-3"></div>
            지원자 데이터를 불러오는 중...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-20 text-center text-xs text-stone-500 font-light">
            검색 결과에 부합하는 지원서가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm md:text-base bg-stone-900">
              <thead>
                <tr className="bg-stone-800/60">
                  <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">신청일시</th>
                  <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">이름 (닉네임)</th>
                  <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">성별 / 나이</th>
                  <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">직업 및 소속</th>
                  <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">MBTI</th>
                  <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800">상태</th>
                  <th className="py-5 px-6 text-base text-stone-300 font-bold tracking-wide border-b border-stone-800 text-center">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-850">
                {filteredApps.map((app) => (
                  <tr 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-stone-800/80 transition-colors cursor-pointer"
                  >
                    <td className="py-5 px-6 text-stone-500 font-mono text-xs whitespace-nowrap">
                      {app.created_at ? new Date(app.created_at).toLocaleString('ko-KR', { hour12: false }) : '-'}
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-bold text-stone-100 text-base flex items-center gap-2">
                        {app.name}
                        {app.status === 'archived' && app.is_matched && (
                          <span 
                            style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)' }}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-sm shrink-0 whitespace-nowrap animate-pulse"
                          >
                            💘 매칭 성공 (파트너: {app.matched_partner || '알 수 없음'})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-teal-300 mt-1 font-semibold">@{app.nickname}</div>
                    </td>
                    <td className="py-5 px-6 text-stone-400">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        app.gender === 'MALE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                      }`}>
                        {app.gender === 'MALE' ? '남성' : '여성'}
                      </span>
                      <span className="ml-2 text-stone-200 font-mono text-sm font-semibold">{app.age}세</span>
                    </td>
                    <td className="py-5 px-6 text-stone-300">
                      <div className="font-bold text-stone-200 text-sm">{app.company_name}</div>
                      <div className="text-xs text-stone-400 mt-1 font-light">
                        {app.job_type === 'professional' && '🏢 전문직'}
                        {app.job_type === 'business_owner' && '☕ 자영업/사업가'}
                        {app.job_type === 'office_worker' && '💻 일반 직장인'}
                        {app.job_type === 'freelancer' && '🎨 프리랜서'}
                        {app.job_type === 'civil_servant' && '🏫 공무원/공기업'}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-teal-300 tracking-widest font-extrabold font-mono text-base">{app.mbti}</td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        app.status === 'approved' 
                          ? 'bg-teal-500/5 text-teal-400 border-teal-500/20' 
                          : app.status === 'rejected'
                          ? 'bg-rose-500/5 text-rose-400 border-rose-500/20'
                          : app.status === 'archived'
                          ? 'bg-purple-500/5 text-purple-400 border-purple-500/20'
                          : 'bg-amber-500/5 text-amber-400 border-amber-500/20'
                      }`}>
                        {app.status === 'approved' && <UserCheck size={12} />}
                        {app.status === 'rejected' && <UserX size={12} />}
                        {app.status === 'archived' && <Clock size={12} />}
                        {app.status === 'pending' && <Clock size={12} />}
                        {app.status === 'approved' && '승인'}
                        {app.status === 'rejected' && '거절'}
                        {app.status === 'archived' && '이전 기수'}
                        {app.status === 'pending' && '대기'}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}
                          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-stone-850 border border-stone-800 hover:border-teal-500/30 hover:bg-stone-800 rounded-full text-xs text-stone-300 hover:text-teal-400 transition-all duration-200 cursor-pointer shadow-sm font-semibold"
                        >
                          <Eye size={14} />
                          상세
                        </button>
                        
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(app.id!, 'approved');
                              }}
                              className="p-2.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 rounded-full text-teal-400 cursor-pointer transition-all duration-200"
                              title="승인"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(app.id!, 'rejected');
                              }}
                              className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-full text-rose-400 cursor-pointer transition-all duration-200"
                              title="거절"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal (KYC Media Viewer) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            onClick={() => setSelectedApp(null)}
            className="absolute inset-0 cursor-pointer" 
          />
          
          <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[95vh] animate-[fadeIn_0.3s_ease-out]">
            {/* Accent border */}
            <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500 w-full" />

            {/* Header */}
            <div className="p-6 border-b border-stone-850 flex justify-between items-start shrink-0 bg-stone-950/20">
              <div>
                <span className="text-xs text-teal-400 font-mono tracking-widest uppercase font-bold">Participant KYC Verification Media Viewer</span>
                <h4 className="text-lg font-bold text-stone-100 mt-1.5">
                  {selectedApp.name} ({selectedApp.nickname}) 님의 신원 서류 심사
                </h4>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-stone-500 hover:text-stone-300 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 space-y-6 overflow-y-auto text-sm md:text-base text-left">
              
              {/* KYC Media Viewer (Side-by-Side Photos & ID Documents) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-950/60 p-6 border border-stone-800 rounded-2xl shadow-inner">
                {/* Profile Photo Viewer */}
                <div className="space-y-2 text-left">
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">참가자 프로필 사진</span>
                  <div className="h-72 rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 flex items-center justify-center relative shadow-inner">
                    {selectedApp.photo_urls && selectedApp.photo_urls.length > 0 ? (
                      <img 
                        src={selectedApp.photo_urls[0]} 
                        alt="Profile Preview" 
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${selectedApp.nickname}`;
                        }}
                      />
                    ) : (
                      <span className="text-stone-500 text-sm font-light">등록된 사진 없음</span>
                    )}
                  </div>
                  {/* Thumbnail gallery if multiple photos */}
                  {selectedApp.photo_urls && selectedApp.photo_urls.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pt-1">
                      {selectedApp.photo_urls.slice(1).map((url, idx) => (
                        <img 
                          key={idx} 
                          src={url} 
                          alt={`Profile thumb ${idx + 2}`} 
                          className="w-12 h-12 object-cover rounded-xl border border-stone-800 shrink-0" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Verification Document Viewer */}
                <div className="space-y-2 text-left">
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">신원 직무 증빙 서류</span>
                  <div className="h-72 rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 flex items-center justify-center p-2 shadow-inner">
                    {selectedApp.verification_file_url ? (
                      <a 
                        href={selectedApp.verification_file_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full h-full flex items-center justify-center relative group"
                        title="클릭하여 원본 보기"
                      >
                        <img 
                          src={selectedApp.verification_file_url} 
                          alt="Verification Document" 
                          className="object-contain w-full h-full rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://api.dicebear.com/7.x/identicon/svg?seed=document';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                          <span className="text-white text-sm font-semibold flex items-center gap-1.5">
                            원본 파일 열기 <ExternalLink size={14} />
                          </span>
                        </div>
                      </a>
                    ) : (
                      <span className="text-rose-500 text-sm font-bold">증빙 서류 미제출</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 text-center font-light mt-1">서류 클릭 시 브라우저 새 창에서 원본 파일 열람이 가능합니다.</p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">인적 사항</span>
                  <div className="mt-2 p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-3 shadow-sm">
                    <p><span className="text-stone-400 font-semibold">성별/나이:</span> <span className="text-stone-200 font-bold">{selectedApp.gender === 'MALE' ? '남성' : '여성'} / {selectedApp.age}세</span></p>
                    <p><span className="text-stone-400 font-semibold">거주지:</span> <span className="text-stone-200">{selectedApp.address || '-'}</span></p>
                    <p><span className="text-stone-400 font-semibold">연락처:</span> <span className="text-stone-200 font-mono font-bold">{selectedApp.phone}</span></p>
                    <p><span className="text-stone-400 font-semibold">SNS 계정:</span> <span className="text-teal-400 font-mono font-bold">{selectedApp.sns_link || '없음'}</span></p>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">직장 및 서류</span>
                  <div className="mt-2 p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-3 shadow-sm">
                    <p><span className="text-stone-400 font-semibold">직무 유형:</span> <span className="text-stone-200 font-bold">{selectedApp.job_type}</span></p>
                    <p><span className="text-stone-400 font-semibold">회사/소속명:</span> <span className="text-stone-200 font-bold">{selectedApp.company_name}</span></p>
                    <p><span className="text-stone-400 font-semibold">MBTI:</span> <span className="text-amber-400 font-bold font-mono tracking-wider text-base">{selectedApp.mbti}</span></p>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div>
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">자기소개</span>
                  <p className="mt-1.5 text-stone-200 bg-stone-950/80 p-5 border border-stone-800 rounded-2xl leading-relaxed font-normal font-sans whitespace-pre-wrap shadow-inner text-sm md:text-base">
                    {selectedApp.bio || '등록된 자기소개가 없습니다.'}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">이상형</span>
                  <p className="mt-1.5 text-stone-200 bg-stone-950/80 p-5 border border-stone-800 rounded-2xl leading-relaxed font-normal font-sans whitespace-pre-wrap shadow-inner text-sm md:text-base">
                    {selectedApp.ideal_type || '등록된 이상형 정보가 없습니다.'}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">사전 인터뷰 (성향 및 매칭 조건)</span>
                  <div className="mt-2 p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-3 shadow-inner text-sm md:text-base">
                    <p><span className="text-stone-400 font-semibold">🚫 절대 불가 조건:</span> <span className="text-rose-400 font-bold">{selectedApp.deal_breaker || '선택 안 됨'}</span></p>
                    <p><span className="text-stone-400 font-semibold">❤️ 연애 선호도:</span> <span className="text-teal-400 font-bold">{selectedApp.crisis_response || '선택 안 됨'}</span></p>
                    <p><span className="text-stone-400 font-semibold">🙋 모임 내 포지션:</span> <span className="text-amber-400 font-bold">{selectedApp.group_position || '선택 안 됨'}</span></p>
                  </div>
                </div>
              </div>

              {/* Schedules & Pledges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">선호 일정</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedApp.preferred_schedules && selectedApp.preferred_schedules.length > 0 ? (
                      selectedApp.preferred_schedules.map((sched, idx) => (
                        <span key={idx} className="px-3 py-1 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 font-mono font-semibold">
                          {sched}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-500 text-xs">선택 없음</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block text-xs tracking-wider uppercase font-bold">서약서 상태</span>
                  <div className="mt-2 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      selectedApp.single_pledge ? 'bg-teal-500/5 text-teal-400 border-teal-500/20' : 'bg-stone-950 text-stone-500 border-stone-850'
                    }`}>
                      미혼 서약 {selectedApp.single_pledge ? '동의' : '미동의'}
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      selectedApp.privacy_pledge ? 'bg-teal-500/5 text-teal-400 border-teal-500/20' : 'bg-stone-950 text-stone-500 border-stone-850'
                    }`}>
                      개인정보 {selectedApp.privacy_pledge ? '동의' : '미동의'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Action Buttons */}
            <div className="p-6 border-t border-stone-900 bg-stone-950/40 flex justify-between items-center shrink-0">
              <div className="flex gap-3.5">
                <button
                  onClick={() => updateStatus(selectedApp.id!, 'approved')}
                  disabled={selectedApp.status === 'approved'}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
                    selectedApp.status === 'approved'
                      ? 'bg-stone-800 text-stone-500 border border-stone-750 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 hover:border-emerald-400 text-white shadow-emerald-500/10'
                  }`}
                >
                  <UserCheck size={16} />
                  {selectedApp.status === 'approved' ? '승인 완료' : '지원 승인 (Approve)'}
                </button>
                <button
                  onClick={() => updateStatus(selectedApp.id!, 'rejected')}
                  disabled={selectedApp.status === 'rejected'}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
                    selectedApp.status === 'rejected'
                      ? 'bg-stone-800 text-stone-500 border border-stone-750 cursor-not-allowed shadow-none'
                      : 'bg-rose-600 hover:bg-rose-500 border border-rose-500 hover:border-rose-400 text-white shadow-rose-500/10'
                  }`}
                >
                  <UserX size={16} />
                  {selectedApp.status === 'rejected' ? '거절 완료' : '지원 거절 (Reject)'}
                </button>
                
                {selectedApp.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus(selectedApp.id!, 'pending')}
                    className="px-5 py-3 bg-stone-850 hover:bg-stone-800 border border-stone-800 rounded-full text-xs font-bold text-stone-400 hover:text-stone-200 transition-all cursor-pointer"
                  >
                    대기로 돌리기
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-6 py-3 bg-stone-800 border border-stone-700 hover:border-stone-600 rounded-full text-sm font-bold text-stone-300 hover:text-stone-100 transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
