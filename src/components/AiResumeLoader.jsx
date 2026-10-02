import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Briefcase,
  CheckCircle2,
  FileText,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";

// Ordered stages shown while the AI writes the resume. `duration` is how long a
// stage stays on screen before advancing — roughly tuned to a ~40s generation.
const STAGES = [
  { label: "Reading your details", icon: User, duration: 4000 },
  { label: "Writing your professional summary", icon: FileText, duration: 6000 },
  { label: "Structuring your work experience", icon: Briefcase, duration: 8000 },
  { label: "Adding education and projects", icon: GraduationCap, duration: 6000 },
  { label: "Optimising skills for ATS", icon: Sparkles, duration: 5000 },
  { label: "Assembling your resume", icon: CheckCircle2, duration: 4000 },
];

// Grows quickly at first then creeps toward 95% so the bar never sits still but
// never claims to be finished while the request is still in flight.
const progressFor = (seconds) =>
  Math.min(95, Math.round((1 - Math.exp(-seconds / 22)) * 100));

const AiResumeLoader = ({ visible }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStageIndex(0);
      setElapsed(0);
      return;
    }

    const timers = [];
    let cumulative = 0;
    STAGES.forEach((stage, index) => {
      cumulative += stage.duration;
      timers.push(setTimeout(() => setStageIndex(index), cumulative));
    });

    const ticker = setInterval(() => setElapsed((e) => e + 1), 1000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(ticker);
    };
  }, [visible]);

  const progress = progressFor(elapsed);
  const CurrentIcon = STAGES[Math.min(stageIndex, STAGES.length - 1)].icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ai-resume-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="no-print absolute inset-0 z-20 flex items-start justify-center overflow-hidden rounded-2xl bg-white/85 backdrop-blur-sm"
        >
          {/* Soft green glow behind the card */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-green-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative flex w-full max-w-md flex-col items-center gap-6 px-6 pt-10 pb-8 text-center">
            {/* Orbiting rings around the current stage icon */}
            <div className="relative flex size-24 items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-green-200" />
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-2 rounded-full border-2 border-transparent border-b-emerald-400"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              />
              <span className="absolute inset-4 rounded-full bg-green-50" />
              <CurrentIcon className="relative size-8 text-green-600" />

              {/* Pulsing halo */}
              <motion.span
                className="absolute inset-0 rounded-full bg-green-400/20"
                animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0, 0.45] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Rotating stage label */}
            <div className="h-16 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stageIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
                    <Brain className="size-4 text-green-600" />
                    {STAGES[Math.min(stageIndex, STAGES.length - 1)].label}
                    <span className="inline-flex">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="size-1.5 rounded-full bg-green-500"
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: dot * 0.2,
                          }}
                        />
                      ))}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    This usually takes about a minute. Keep this tab open.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-600"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{progress}% complete</span>
                <span>{elapsed}s elapsed</span>
              </div>
            </div>

            {/* Stage checklist */}
            <ul className="w-full space-y-2 text-left">
              {STAGES.map((stage, index) => {
                const done = index < stageIndex;
                const active = index === stageIndex;
                return (
                  <li
                    key={stage.label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-300 ${
                      active ? "bg-green-50 text-green-800" : "text-gray-400"
                    }`}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border">
                      {done ? (
                        <CheckCircle2 className="size-4 text-green-600" />
                      ) : active ? (
                        <motion.span
                          className="size-2.5 rounded-full bg-green-500"
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                      ) : (
                        <stage.icon className="size-3.5" />
                      )}
                    </span>
                    <span className={done ? "line-through" : ""}>{stage.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiResumeLoader;
