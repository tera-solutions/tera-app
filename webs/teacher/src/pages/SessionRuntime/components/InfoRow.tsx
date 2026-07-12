const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 py-1.5 text-sm">
    <span className="text-slate-400 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-700">{value}</span>
  </div>
);

export default InfoRow;
