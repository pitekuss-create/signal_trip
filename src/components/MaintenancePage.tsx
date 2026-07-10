import { motion } from 'framer-motion';

export default function MaintenancePage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-stone-950 font-serif text-white">
      {/* Background Image Container with Ken Burns effect (zoom) */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.02, opacity: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/silent table.png')",
        }}
      />

      {/* Dim Overlay with subtle dark-indigo gradient for premium moody atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/75 to-stone-950/90" />
      
      {/* Light glow overlay for focal point in center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,199,181,0.08)_0%,transparent_70%)]" />

      {/* Fine Border Frame for Elegant Aesthetic */}
      <div className="absolute inset-4 border border-white/5 pointer-events-none md:inset-8" />

      {/* Contents Wrapper */}
      <div className="relative z-10 w-full max-w-3xl px-6 py-12 flex flex-col items-center text-center">
        {/* Decorative Top Accent line/dot */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-1.5 h-1.5 rounded-full bg-teal-400 mb-12 shadow-[0_0_8px_rgba(0,199,181,0.6)]"
        />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium leading-normal tracking-wide text-stone-100 mb-10 break-keep"
        >
          제주의 밤은 잠시 깊은 휴식에 들어갑니다.
        </motion.h1>

        {/* Divider line */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 40, opacity: 0.3 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-[1px] bg-stone-400 mb-10"
        />

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-stone-300 text-sm sm:text-base md:text-lg font-light leading-relaxed tracking-wider space-y-4 break-keep max-w-2xl"
        >
          <p>
            뻔한 소음이 아닌, 완벽한 몰입을 선사할 오프라인 씬(Scene)을 기획하기 위해
          </p>
          <p>
            포구트립은 잠시 재단장의 시간을 가집니다.
          </p>
          <p>
            더 압도적인 무드와 정교한 큐레이션으로 다시 초대하겠습니다.
          </p>
        </motion.div>

        {/* Footer Accent */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-20 text-[10px] sm:text-xs md:text-sm tracking-[0.25em] font-light text-stone-400 block"
        >
          - 미드나잇 포구트립 디렉팅 팀 -
        </motion.span>
      </div>
    </div>
  );
}
