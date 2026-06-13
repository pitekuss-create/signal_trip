import { useState } from 'react';
import LegalModal from './LegalModal';

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy'>('terms');

  const openModal = (type: 'terms' | 'privacy') => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <footer className="w-full py-10 bg-transparent border-t border-gray-100">
      <div className="max-w-md mx-auto px-6 text-center text-[11px] text-gray-400 leading-loose font-light">
        <p className="break-keep">
          상호명: 조용한 성장 <span className="mx-1 text-gray-200">|</span> 대표자: 진정<br />
          사업자등록번호: 780-11-02658 <span className="mx-1 text-gray-200">|</span> 통신판매업신고번호: 제 2024-서울마포-1333<br />
          이메일: noteband@naver.com
        </p>
        
        <p className="mt-2 text-[10px] text-gray-300">
          © {new Date().getFullYear()} Signal Trip. All rights reserved.
        </p>

        <div className="flex justify-center gap-8 mt-6">
          <button 
            onClick={() => openModal('terms')} 
            className="hover:text-gray-600 transition-colors cursor-pointer"
          >
            이용약관
          </button>
          <button 
            onClick={() => openModal('privacy')} 
            className="font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            개인정보처리방침
          </button>
        </div>
      </div>

      <LegalModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        type={modalType} 
      />
    </footer>
  );
}
