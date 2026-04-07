import React from "react";
import { ArrowRightOutlined } from "tera-dls";
import { hexToRGBA } from "./utils";
import { OptionFlowProps } from "./SelectFlow";

interface OptionFlowComponentProps {
  onCustomSelect?: (selected, option) => void;
  option: OptionFlowProps;
}

function OptionFlow({ onCustomSelect, option }: OptionFlowComponentProps) {
  const itemClassName =
    "flex justify-between items-center select-flow-item px-3 py-2 border-l-2 border-transparent hover:bg-gray-100 hover:border-blue-600";
  return (
    <li
      className={itemClassName}
      onClick={() => onCustomSelect && onCustomSelect(option.value, option)}
    >
      <span className="break-word shrink-0">{option?.flow}</span>
      <div className="flex gap-x-2 items-center">
        <ArrowRightOutlined className="w-4 h-4" />
        <span
          className="px-3 py-1 rounded"
          style={{
            backgroundColor: `${hexToRGBA(option.color, 0.1)}`,
            color: `${hexToRGBA(option.color, 1)}`,
          }}
        >
          {option?.label}
        </span>
      </div>
    </li>
  );
}

export default OptionFlow;
