import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface SubmissionSuccessProps {
  onClose: () => void;
  nickname: string;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ onClose, nickname }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-8 bg-white h-full">

      {/* 깔끔하고 세련된 민트 체크 애니메이션 */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-2">
        <div className="absolute inset-0 bg-[#00C7B5]/20 blur-2xl rounded-full animate-pulse" />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-[#00C7B5] relative z-10"
        >
          <CheckCircle2 size={100} className="stroke-[1.5px] bg-white rounded-full" />
        </motion.div>
      </div>

      {/* 완료 메시지 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-4"
      >
        <span className="text-sm tracking-[0.4em] text-[#00C7B5] uppercase font-bold">
          INVITATION REQUESTED
        </span>

        <h3 className="text-3xl font-bold text-stone-900">
          포구 밤크닉 신청이 완료되었습니다 🌙
        </h3>

        <p className="text-sm sm:text-base text-stone-600 font-bold leading-relaxed max-w-md break-keep mx-auto">
          <strong className="text-[#00C7B5] text-lg">{nickname}</strong>님의 소중한 신청서가 잘 도착했습니다.<br />
          결이 맞는 분들과의 다정한 시간을 위해 취향을 꼼꼼히 확인한 후, 초대되신 분들께 일주일 전 개별 연락을 드릴게요. 제주의 밤바다에서 뵙기를 기다리겠습니다.
        </p>
      </motion.div>

      {/* 신청 현황 정보 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="w-full max-w-sm p-6 rounded-2xl bg-stone-50 border-2 border-stone-100 text-left text-sm text-stone-600 font-bold space-y-4 shadow-sm mx-auto"
      >
        <div className="flex justify-between items-center pb-4 border-b-2 border-stone-200">
          <span className="text-stone-900">신청 현황</span>
          <span className="text-xs px-3 py-1 rounded-full bg-[#00C7B5]/10 text-[#00C7B5] border border-[#00C7B5]/20">취향 확인 중</span>
        </div>
        <div className="flex justify-between items-center">
          <span>접수 내용</span>
          <span className="text-stone-900">여행 취향 및 신청서</span>
        </div>
        <div className="flex justify-between items-center">
          <span>진행 단계</span>
          <span className="text-stone-900">초대장 발송 대기</span>
        </div>
      </motion.div>

      {/* 메인으로 돌아가기 버튼 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="w-full max-w-xs pt-6 mx-auto"
      >
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl border-2 border-[#00C7B5] hover:bg-[#00C7B5] text-[#00C7B5] hover:text-white transition-all duration-300 cursor-pointer text-sm font-bold tracking-widest uppercase shadow-sm"
        >
          메인 화면으로 돌아가기
        </button>
      </motion.div>
    </div>
  );
};