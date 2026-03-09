import { Star } from "lucide-react";

export default function StarRating({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={12} className={i <= Math.round(value) ? "text-[#FF9F1C] fill-[#FF9F1C]" : "text-[#F9C9A0] fill-[#F9C9A0]"} />
      ))}
    </div>
  );
}
