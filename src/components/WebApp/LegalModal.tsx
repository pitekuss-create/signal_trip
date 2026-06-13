import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-2xl bg-[#1A1A1A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-left relative z-10 p-6 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {type === 'terms' ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-100 tracking-tight mb-6 pr-8">
                  시그널 트립 이용약관
                </h2>
                <div className="overflow-y-auto max-h-[60vh] md:max-h-[70vh] text-gray-300 text-[12px] md:text-sm leading-loose space-y-6 pr-2 font-sans font-light">
                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">제 1 조 (목적)</h3>
                    <p className="break-keep text-gray-400">
                      본 약관은 "조용한 성장"(이하 "회사"라 합니다)이 제공하는 "시그널 트립"(이하 "서비스"라 합니다)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">제 2 조 (용어의 정의)</h3>
                    <ol className="list-decimal pl-4 space-y-1 break-keep text-gray-400">
                      <li>"서비스"란 회사가 제공하는 오프라인 네트워킹 및 여행 매칭 서비스를 의미합니다.</li>
                      <li>"회원"이란 본 약관에 동의하고 서비스 이용 신청을 완료한 자를 의미합니다.</li>
                    </ol>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">제 3 조 (서비스의 제공 및 변경)</h3>
                    <ol className="list-decimal pl-4 space-y-1 break-keep text-gray-400">
                      <li>회사는 회원에게 엄선된 48시간의 오프라인 여행 및 네트워킹 코스를 제공합니다.</li>
                      <li>회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다.</li>
                    </ol>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">제 4 조 (회원의 의무 및 규정)</h3>
                    <ol className="list-decimal pl-4 space-y-1 break-keep text-gray-400">
                      <li>회원은 서비스 이용 시 다른 회원의 프라이버시를 존중해야 하며, 무단 연락처 교환, 사진 촬영, 스토킹 등 서비스 취지에 어긋나는 행위를 금지합니다.</li>
                      <li>위반 시 회사는 즉각적인 서비스 이용 제한 및 퇴장 조치를 취할 수 있으며, 환불은 불가합니다.</li>
                    </ol>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">제 5 조 (면책조항)</h3>
                    <p className="break-keep text-gray-400">
                      회사는 회원이 서비스 내에서 자발적으로 행한 결정이나 회원 간에 발생한 분쟁에 대해 원칙적으로 책임지지 않습니다.
                    </p>
                  </section>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-gray-100 tracking-tight mb-6 pr-8">
                  개인정보처리방침
                </h2>
                <div className="overflow-y-auto max-h-[60vh] md:max-h-[70vh] text-gray-300 text-[12px] md:text-sm leading-loose space-y-6 pr-2 font-sans font-light">
                  <p className="break-keep text-gray-400">
                    "조용한 성장"(이하 "회사")는 회원의 개인정보를 안전하게 보호하기 위해 최선을 다하며, 관련 법령을 준수합니다.
                  </p>

                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">1. 수집하는 개인정보 항목</h3>
                    <ul className="list-disc pl-4 space-y-1 break-keep text-gray-400">
                      <li>필수항목: 이름, 성별, 나이, 연락처(휴대전화번호), 직업, 카카오톡 아이디</li>
                      <li>선택항목: 취향 키워드, 이상형 정보</li>
                      <li>수집방법: 서비스 참가 신청 폼</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">2. 개인정보의 수집 및 이용 목적</h3>
                    <ul className="list-disc pl-4 space-y-1 break-keep text-gray-400">
                      <li>서비스 제공: 48시간 프라이빗 여행 매칭, 참가자 신원 확인 및 본인 인증</li>
                      <li>고객 관리: 공지사항 전달, 불만 처리 등 의사소통</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">3. 개인정보의 보유 및 이용 기간</h3>
                    <p className="break-keep text-gray-400">
                      회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 break-keep text-gray-400">
                      <li>소비자의 불만 또는 분쟁 처리에 관한 기록: 3년</li>
                      <li>서비스 제공 완료 후 매칭 데이터: 1개월 내 파기</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-200">4. 개인정보 보호책임자</h3>
                    <ul className="list-disc pl-4 space-y-1 break-keep text-gray-400">
                      <li>담당자: 진정 (대표)</li>
                      <li>이메일: noteband@naver.com</li>
                    </ul>
                  </section>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
