import { ReactNode } from "react";
import classNames from "classnames";

interface IconBoxProps {
  icon: ReactNode;
  sizeClassName?: string;
  roundedClassName?: string;
  colorClassName?: string;
  iconSizeClassName?: string;
  className?: string;
}

/** Shared decorative icon-in-a-colored-box wrapper. */
const IconBox = ({
  icon,
  sizeClassName = "h-10 w-10",
  roundedClassName = "rounded-xl",
  colorClassName = "bg-sky-50 text-brand",
  iconSizeClassName = "[&_svg]:h-5 [&_svg]:w-5",
  className,
}: IconBoxProps) => (
  <span
    className={classNames(
      "flex shrink-0 items-center justify-center",
      sizeClassName,
      roundedClassName,
      colorClassName,
      iconSizeClassName,
      className,
    )}
  >
    {icon}
  </span>
);

export default IconBox;
