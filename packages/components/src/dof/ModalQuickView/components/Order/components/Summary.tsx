import React, { ReactNode } from "react";
import { Description } from "tera-dls";

type SummaryOrderProps = {
  label: ReactNode;
  children: ReactNode;
};
const SummaryOrder = ({ label, children }: SummaryOrderProps) => {
  return (
    <Description
      label={label}
      className="grid-cols-4 bg-gray-100 px-2.5 py-2 mb-0"
      labelClassName="col-span-1 text-gray-800 font-medium"
      childrenClassName="text-gray-700 col-span-3"
    >
      {children}
    </Description>
  );
};

export default SummaryOrder;
