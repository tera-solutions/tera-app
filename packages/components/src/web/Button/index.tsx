import { ReactNode, forwardRef } from "react";
import customTwMerge from "tailwind-merge.config";
import { Button } from "tera-dls";
import { ButtonProps } from "tera-dls/lib/components/Button";

interface IButtonCommon extends ButtonProps {
  icon?: ReactNode;
}

const ButtonCommon = forwardRef<HTMLButtonElement, IButtonCommon>(
  (
    { children, type = "primary", className, onClick, icon, ...restProps },
    ref,
  ) => {
    const customClasses = customTwMerge(
      "button_hover h-[30px] px-3",
      className,
    );
    return (
      <Button
        ref={ref}
        type={type}
        onClick={onClick}
        {...restProps}
        className={customClasses}
      >
        {icon}
        {children}
      </Button>
    );
  },
);

export default ButtonCommon;
