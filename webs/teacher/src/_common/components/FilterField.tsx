import { ReactNode } from "react";

interface FilterFieldProps {
  label: string;
  children: ReactNode;
}

/** Labeled row inside a `FilterCard`. */
const FilterField = ({ label, children }: FilterFieldProps) => (
  <div>
    <p className="mb-1.5 text-sm font-semibold text-slate-700">{label}</p>
    {children}
  </div>
);

export default FilterField;
