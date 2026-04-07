import React from "react";

const CardTimelineOrder = ({ title, children }) => {
  return (
    <div className="bg-green-50 p-2 flex justify-between items-center rounded-[5px]">
      <p className="text-blue-600">{title}</p>
      {children}
    </div>
  );
};

export default CardTimelineOrder;
