import classNames from "classnames";
import React from "react";

interface CardFormProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  isBorder?: boolean;
  [rest: string]: any;
}

function CardFormV2({
  children,
  title,
  className,
  isBorder = true,
  ...props
}: CardFormProps) {
  const classContainer = classNames(
    "w-full [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-[16px] [&:not(:first-child)]:pt-[16px] border-dashed",
    className,
    {
      "!border-0": !isBorder,
    },
  );
  return (
    <div className={classContainer} {...props}>
      <h3 className="text-blue-500 font-medium mb-2.5">{title}</h3>
      {children}
    </div>
  );
}

export default CardFormV2;
