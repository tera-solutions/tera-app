import { ReactNode } from "react";

type DescriptionProps = {
  title: string;
  value: ReactNode;
};
const Description = ({ title, value }: DescriptionProps) => {
  return (
    value && (
      <p className="flex items-baseline gap-[5px]">
        <span className="text-blue-800 w-[110px] inline-block shrink-0">
          {title}
        </span>
        <span>:</span>
        {value}
      </p>
    )
  );
};

export default Description;
