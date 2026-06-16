import { useState, useEffect } from "react";

const QUESTIONS = [
  "Cheapest car available?",
  "What are the financing requirements?",
  "Cheapest sedan available?",
  "Most fuel-efficient car?",
  "Best family car available?",
  "Any discounts or freebies?",
  "What SUVs do you have?",
  "Show me minivan options?",
  "Any light commercial vehicles?",
];

export function TypingPrompt({
  onSubmit,
  disabled,
}: {
  onSubmit: (s: string) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    const current = QUESTIONS[qIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!erasing) {
      if (charIdx < current.length) {
        timer = setTimeout(() => {
          setText(current.slice(0, charIdx + 1));
          setCharIdx((i) => i + 1);
        }, 65);
      } else {
        timer = setTimeout(() => setErasing(true), 2200);
      }
    } else {
      if (charIdx > 0) {
        timer = setTimeout(() => {
          setText(current.slice(0, charIdx - 1));
          setCharIdx((i) => i - 1);
        }, 30);
      } else {
        setErasing(false);
        setQIndex((i) => (i + 1) % QUESTIONS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIdx, erasing, qIndex]);

  return (
    <button
      type="button"
      onClick={() => onSubmit(QUESTIONS[qIndex])}
      disabled={disabled}
      className="group flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
    >
      <span className="text-xs text-white/40 shrink-0">Ask:</span>
      <span className="text-sm text-white/80 group-hover:text-white underline underline-offset-2 decoration-white/20 group-hover:decoration-white/60 transition-all">
        {text}
      </span>
      <span className="inline-block w-[2px] h-4 bg-white/60 animate-pulse shrink-0" />
    </button>
  );
}