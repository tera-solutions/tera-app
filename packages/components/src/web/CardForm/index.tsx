import classNames from "classnames";
import React from "react";
import customTwMerge from "tailwind-merge.config";

interface CardFormProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  type?: "box" | "text";
}

function CardForm({ children, title, className, type = "box" }: CardFormProps) {
  const classContainer = classNames("w-full", className);
  return (
    <div className={classContainer}>
      <h3
        className={customTwMerge(
          "text-gray-800 uppercase",
          type === "box"
            ? "p-2.5 rounded-[3px] border-l-2 border-[#1C64F2] bg-gray-200 text-sm font-bold mb-5"
            : "font-medium text-xxs mb-4",
        )}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export default CardForm;
