import HanaFlower from "_common/components/HanaFlower";

/** Logo Hana: bông hoa 6 cánh + chữ */
const HanaLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <HanaFlower className="h-8 w-8 shrink-0" />
    <span className="text-2xl font-extrabold tracking-tight text-hana-blue">
      Hana
    </span>
  </div>
);

export default HanaLogo;
