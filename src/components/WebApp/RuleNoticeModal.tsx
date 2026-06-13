import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Shield, CameraOff, ArrowRight } from 'lucide-react';

export default function RuleNoticeModal() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-sm bg-[#1A1A1A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-left"
          >
            <div className="px-6 pt-8 pb-5 text-center border-b border-gray-800/50">
              <h2 className="text-xl font-semibold text-gray-100 tracking-tight leading-snug">
                완벽한 48시간을 위해,<br />세 가지만 약속해요.
              </h2>
              <p className="mt-2 text-xs text-gray-400 font-light font-sans">
                모두가 안전하고 즐거운 여행을 즐길 수 있도록 아래 규칙을 먼저 확인해 주세요.
              </p>
            </div>

            <div className="px-6 py-6 space-y-5 max-h-[50vh] overflow-y-auto">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 text-emerald-400"><Shield size={20} /></div>
                <div>
                  <h3 className="text-sm font-medium text-gray-200 mb-1">1. 이름과 연락처는 묻지 않아요.</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">여행이 끝날 때까지 우리는 오직 '닉네임'으로만 소통해요</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 text-emerald-400"><CheckCircle2 size={20} /></div>
                <div>
                  <h3 className="text-sm font-medium text-gray-200 mb-1">2. 다가감은 자유롭되, 거절은 쿨하게 수용해요.</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">대화나 동행을 제안할 수 있지만, 상대가 원치 않는다면 핑계 없이 수용해요.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 text-emerald-400"><CameraOff size={20} /></div>
                <div>
                  <h3 className="text-sm font-medium text-gray-200 mb-1">3. 이곳의 모든 순간은 우리만의 비밀이에요.</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">시그널 트립에는 주최 측의 카메라도 존재하지 않아요. 참가자 역시 타인의 동의 없는 사진 촬영을 엄격히 금지해요</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#141414]">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
              >
                확인하고 입장하기
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
