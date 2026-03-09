export default function SectionHead({ children, sub, action }) {
  return (
    <div className="flex items-end justify-between mb-7 relative">
      <div>
        <h2 className="font-display text-2xl font-black text-[#1A0A00] stripe-underline inline-block">
          {children}
        </h2>
        {sub && <p className="text-[#8C6A52] text-xs font-medium mt-2">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
