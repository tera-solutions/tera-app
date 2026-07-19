interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

/** Consistent label style for hand-rolled forms — matches tera-dls's FormItem
 * required-marker convention (red asterisk) instead of a plain typed " *". */
const FieldLabel = ({ children, required }: FieldLabelProps) => (
  <label className="mb-1 block text-xs font-medium text-slate-500">
    {children}
    {required && <span className="ml-0.5 text-red-600">*</span>}
  </label>
);

export default FieldLabel;
