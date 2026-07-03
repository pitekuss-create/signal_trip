import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import { RegistrationModal } from './components/RegistrationModal';
import { AdminDashboard } from './components/AdminDashboard';
import WebAppContainer from './components/WebApp/WebAppContainer';

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 font-sans">
      {/* Main Landing Page Hero Section */}
      <HeroSection onOpenRegistration={() => setIsModalOpen(true)} />

      {/* 🚨 수정: 모달창이 무조건 뜨도록 조건부 렌더링({isModalOpen &&}) 강제화 🚨 */}
      {isModalOpen && (
        <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'signal1234';
    if (password === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setError('');
    } else {
      setError('❌ 패스워드가 올바르지 않습니다.');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-stone-950 items-center justify-center p-4 text-stone-200">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500 to-emerald-500" />
        
        <div className="text-center space-y-2 mb-6">
          <span className="font-cinzel text-[10px] tracking-[0.3em] text-teal-400 uppercase font-semibold">Host Administration</span>
          <h2 className="text-xl font-bold font-sans text-stone-100">어드민 보안 접속</h2>
          <p className="text-xs text-stone-500 font-light">관리자 패스워드를 입력해 주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-stone-950 border border-stone-850 focus:border-teal-500/50 rounded-xl text-sm focus:outline-none transition-all placeholder-stone-700 text-stone-200 text-center"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-rose-400 text-xs text-center font-medium animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 border border-teal-500 hover:border-teal-400 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-teal-500/10"
          >
            접속하기
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <div className="relative min-h-screen bg-stone-950 text-stone-200 font-sans">
                <AdminDashboard />
              </div>
            </AdminProtectedRoute>
          }
        />
        <Route path="/app/*" element={<WebAppContainer />} />
        {/* Fallback to / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;