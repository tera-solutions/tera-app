import { ReactNode } from "react";
import customTwMerge from "tailwind-merge.config";

type CardDetailProductProps = {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
};
const CardDetail = ({ title, children, className }: CardDetailProductProps) => {
  return (
    <div
      className={customTwMerge(
        "px-2.5 py-4 rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] bg-white ",
        className,
      )}
    >
      {title && <h4 className="font-medium text-blue-500 mb-4">{title}</h4>}
      {children}
    </div>
  );
};

export default CardDetail;
