import customTwMerge from "tailwind-merge.config";
import {
  Button,
  ChevronDownOutlined,
  Dropdown,
  DropdownProps,
  PlusOutlined,
} from "tera-dls";

interface IButtonDropdown extends DropdownProps {
  title?: string;
  showIcon?: boolean;
  buttonClassName?: string;
  buttonProps?: any;
  iconClassName?: string;
}

function ButtonDropdown({
  title = "Thêm mới",
  showIcon = true,
  buttonClassName = "",
  buttonProps = {},
  iconClassName = "",
  ...props
}: IButtonDropdown) {
  return (
    <Dropdown
      containerClassName="w-[50px] !top-1"
      placement="bottom-end"
      trigger="click"
      {...props}
    >
      <Button
        htmlType="button"
        className={customTwMerge(
          "px-[12px] py-[5px] rounded-[4px] flex gap-2.5 bg-blue-500 text-[13px]",
          buttonClassName,
        )}
        {...buttonProps}
      >
        <div className="flex items-center gap-[5px] shrink-0">
          {showIcon && <PlusOutlined className="w-[16px] text-white" />}
          <span className="leading-[13px]">{title}</span>
        </div>
        <ChevronDownOutlined
          className={customTwMerge("w-[16px] text-white", iconClassName)}
        />
      </Button>
    </Dropdown>
  );
}

export default ButtonDropdown;
