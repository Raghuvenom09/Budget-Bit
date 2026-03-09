import { scoreColor } from "../lib/helpers";

export default function WorthItBadge({ score, size = "md" }) {
  const dim    = size === "lg" ? 84 : size === "sm" ? 46 : 62;
  const r      = (dim / 2) - 5;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const sw     = size === "lg" ? 5 : 3.5;
  const color  = scoreColor(score);
  const fs     = size === "lg" ? "text-xl" : size === "sm" ? "text-[10px]" : "text-sm";

  return (
    <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="absolute inset-0 -rotate-90">
        <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={sw} />
        <circle
          cx={dim/2} cy={dim/2} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="ring-anim"
          style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center font-display font-black ${fs}`} style={{ color }}>
        <span className="leading-none">{score}</span>
        {size !== "sm" && <span className="text-[8px] font-sans font-semibold opacity-50 leading-none mt-0.5">/ 100</span>}
      </div>
    </div>
  );
}
