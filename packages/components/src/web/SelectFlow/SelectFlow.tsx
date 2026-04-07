import classNames from "classnames";
import { useRef, useState } from "react";
import { ChevronDownOutlined } from "tera-dls";
import useClickOutside from "../Flow/useClickOutside";
import { hexToRGBA } from "./utils";
import OptionFlow from "./OptionFlow";

export interface OptionFlowProps {
  label: string;
  flow: string;
  value: string;
  color: string;
}

export interface SelectFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  options: OptionFlowProps[];
  active: OptionFlowProps;
  title: string;
  open?: boolean;
  onCustomSelect?: (selected: any, option: any) => void;
}

function SelectFlow(props: SelectFlowProps) {
  const {
    options,
    active,
    open,
    title,
    style,
    className,
    onCustomSelect,
    ...rest
  } = props;

  const containerClassName = classNames(
    `select-flow relative flex items-center justify-between px-5 rounded text-white cursor-pointer`,
    className,
  );

  const optionClassName =
    "select-flow-option block absolute min-w-[200px] top-[105%] left-0 z-50 bg-white text-gray-700 rounded border border-gray-300 shadow py-2";

  const [visible, setVisible] = useState<boolean>(open || false);

  const elementRef = useRef(null);

  useClickOutside(elementRef, () => {
    if (open === undefined) setVisible(false);
  });

  const handleClick = () => {
    if (open === undefined) setVisible(!visible);
  };

  return (
    <div
      {...rest}
      className={containerClassName}
      style={{
        backgroundColor: `${hexToRGBA(active.color, 0.2)}`,
        color: `${hexToRGBA(active.color, 1)}`,
        ...style,
      }}
      ref={elementRef}
      onClick={handleClick}
    >
      <span className="leading-8">{title}</span>
      <ChevronDownOutlined className="w-4 h-4 mx-1" />

      {options && options?.length > 0 && visible && (
        <ul className={optionClassName}>
          {options?.map((option) => (
            <OptionFlow option={option} onCustomSelect={onCustomSelect} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default SelectFlow;
