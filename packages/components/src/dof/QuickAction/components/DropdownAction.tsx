import { forwardRef } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownRef,
  EllipsisHorizontalOutlined,
} from "tera-dls";

type DropdownActionProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  items: DropdownItem[];
  isHover?: boolean;
};
const DropdownAction = forwardRef<DropdownRef, DropdownActionProps>(
  ({ items, open, setOpen, isHover }, ref) => {
    return (
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        menu={{ items }}
        containerClassName="min-w-[150px]"
        placement="bottom-end"
        trigger="click"
        ref={ref}
      >
        {isHover ? (
          <span className="p-1 absolute right-0 bg-gray-200 rounded-full">
            <EllipsisHorizontalOutlined className="cursor-pointer text-gray-500 w-4 h-4" />
          </span>
        ) : (
          <></>
        )}
      </Dropdown>
    );
  },
);

export default DropdownAction;
