import { scoreLabel, scorePillBg } from "../lib/helpers";

export default function ScorePill({ score }) {
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${scorePillBg(score)}`}>
      {scoreLabel(score)}
    </span>
  );
}
