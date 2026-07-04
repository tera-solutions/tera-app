import React from "react";
import { usePermission } from "@tera/commons/hooks/usePermission";
import customTwMerge from "tailwind-merge.config";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownProps,
  EllipsisHorizontalOutlined,
  EyeOutlined,
  Tooltip,
} from "tera-dls";

interface ActionDropdown extends DropdownProps {
  dropdownItems: DropdownItem[];
  buttonDetailKey?: string;
  classNameButton?: string;
  onClickDetail?: () => void;
  callBack?: () => void;
}

function ActionDropdown({
  dropdownItems,
  buttonDetailKey,
  classNameButton,
  callBack,
  onClickDetail,
  ...rest
}: ActionDropdown) {
  const { hasPage } = usePermission();

  const checkPermissionButton = (key: string): boolean =>
    key ? hasPage(key) : true;

  return (
    <div className="flex items-center justify-center gap-x-2.5">
      {onClickDetail && checkPermissionButton(buttonDetailKey) && (
        <Tooltip title="Chi tiết">
          <div>
            <EyeOutlined
              className="h-6 w-6 text-blue-600 cursor-pointer"
              onClick={onClickDetail}
            />
          </div>
        </Tooltip>
      )}
      {dropdownItems && dropdownItems?.length > 0 && (
        <Dropdown
          menu={{
            items: dropdownItems,
            itemClassName: "w-[150px] break-word text-left cursor-pointer",
          }}
          {...rest}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              callBack && callBack();
            }}
            htmlType="button"
            type="alternative"
            className={customTwMerge(
              "rounded-xsm py-[3px] px-[3px] bg-white cursor-pointer",
              classNameButton,
            )}
            icon={<EllipsisHorizontalOutlined className="text-gray-500" />}
          />
        </Dropdown>
      )}
    </div>
  );
}

export default ActionDropdown;
