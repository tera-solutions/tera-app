import { Button } from "tera-dls";

interface SessionFooterNavProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
  nextLabel: string;
  nextLoading?: boolean;
  nextDisabled?: boolean;
  hint?: string;
}

const SessionFooterNav = ({
  step,
  onPrev,
  onNext,
  nextLabel,
  nextLoading,
  nextDisabled,
  hint,
}: SessionFooterNavProps) => (
  <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
    <Button
      outlined
      disabled={step <= 1}
      onClick={onPrev}
      className="text-slate-600 border-slate-200"
    >
      ← Bước trước
    </Button>
    {hint && <p className="hidden text-xs text-slate-400 sm:block">{hint}</p>}
    <Button
      onClick={onNext}
      loading={nextLoading}
      disabled={nextDisabled}
      className="bg-brand hover:bg-brand/80"
    >
      {nextLabel}
    </Button>
  </div>
);

export default SessionFooterNav;
