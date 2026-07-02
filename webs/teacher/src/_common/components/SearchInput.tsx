import { ComponentProps } from "react";
import { Input, MagnifyingGlassOutlined } from "tera-dls";
import customTwMerge from "tailwind-merge.config";

interface SearchInputProps extends Omit<ComponentProps<typeof Input>, "prefix"> {
  wrapperClassName?: string;
}

/**
 * `Input` with a search icon. Renders the icon ourselves (absolutely
 * positioned, `pointer-events-none`) instead of relying on `Input`'s
 * built-in `prefix` slot, whose padding doesn't reliably reach the inner
 * `<input>` and left the icon overlapping typed text.
 */
const SearchInput = ({
  className,
  wrapperClassName,
  ...props
}: SearchInputProps) => (
  <div className={customTwMerge("relative", wrapperClassName)}>
    <MagnifyingGlassOutlined className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <Input {...props} className={customTwMerge("pl-10", className)} />
  </div>
);

export default SearchInput;
