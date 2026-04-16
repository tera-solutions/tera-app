import React from "react";
import customTwMerge from "tailwind-merge.config";
import { Button, Drawer, FunnelOutlined } from "tera-dls";

interface FilterProps {
  open: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onFilter?: () => void;
  onReset?: () => void;
  children?: React.ReactNode;
  title?: string;
  containerClassName?: string;
}

function Filter({
  open,
  onClose,
  onCancel,
  onFilter,
  onReset,
  children,
  title = "Lọc",
  containerClassName,
}: FilterProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      containerClassName={customTwMerge(
        "max-h-screen overflow-hidden p-0 rounded-l-[13px] flex flex-col ",
        containerClassName,
      )}
    >
      <div className=" pt-[16px] px-[16px] pb-2.5 shadow-md">
        <div className="flex justify-between items-center">
          <p className="text-xl font-medium">{title}</p>
          <FunnelOutlined className="w-7 h-7 text-blue-500 rounded-[4px] shrink-0" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2.5 flex-1 items-between py-4 px-[16px] overflow-auto">
        <div className="flex-1 overflow-auto">
          {children}
          {onReset && (
            <a
              className="text-sm font-normal text-red-500 cursor-pointer"
              onClick={onReset}
            >
              Hủy bộ lọc
            </a>
          )}
        </div>
        <div className="flex justify-end gap-x-2 pt-[16px] border-t border-gray-300 ">
          <Button type="alternative" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={onFilter}>Lọc</Button>
        </div>
      </div>
    </Drawer>
  );
}

export default Filter;
