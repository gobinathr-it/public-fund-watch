import { motion } from "framer-motion";

const TricolorBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Flowing tricolor ribbons */}
    <motion.div
      className="absolute -top-1/2 -left-1/4 h-[200%] w-[150%] opacity-[0.07]"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--saffron)) 0%, hsl(var(--saffron)) 20%, transparent 35%, transparent 45%, hsl(var(--emerald)) 60%, hsl(var(--emerald)) 80%, transparent 100%)",
      }}
      animate={{ rotate: [0, 3, -2, 0], x: [0, 30, -20, 0], y: [0, -15, 10, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Secondary wave */}
    <motion.div
      className="absolute -bottom-1/3 -right-1/4 h-[160%] w-[140%] opacity-[0.05]"
      style={{
        background:
          "linear-gradient(-45deg, hsl(var(--saffron)) 0%, transparent 25%, hsl(217 91% 60%) 40%, transparent 55%, hsl(var(--emerald)) 70%, transparent 100%)",
      }}
      animate={{ rotate: [0, -2, 3, 0], x: [0, -25, 15, 0], y: [0, 20, -10, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Ashoka Chakra subtle circle */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-info/[0.04]"
      style={{ width: 320, height: 320 }}
      animate={{ rotate: 360, scale: [1, 1.05, 1] }}
      transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
    >
      {/* Spokes */}
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom bg-info/[0.03]"
          style={{ transform: `translateX(-50%) rotate(${i * 15}deg)` }}
        />
      ))}
    </motion.div>

    {/* Floating orbs */}
    <motion.div
      className="absolute top-[15%] right-[20%] h-40 w-40 rounded-full bg-saffron/[0.06] blur-3xl"
      animate={{ y: [0, -20, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[20%] left-[15%] h-32 w-32 rounded-full bg-emerald/[0.06] blur-3xl"
      animate={{ y: [0, 15, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div
      className="absolute top-[40%] left-[60%] h-24 w-24 rounded-full bg-info/[0.04] blur-2xl"
      animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
    />
  </div>
);

export default TricolorBackground;
