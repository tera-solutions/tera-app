import { usePermission } from "@tera/states/hooks";
import classNames from "classnames";
import React, { useState } from "react";
import {
  AdjustmentsHorizontalOutlined,
  Button,
  ChevronDownSolid,
  ChevronUpSolid,
  Dropdown,
  DropdownItem,
  EllipsisHorizontalOutlined,
  FunnelOutlined,
  PlusCircleOutlined,
  useDetectDevice,
} from "tera-dls";

interface IProps {
  title: string | React.ReactNode;
  onClickButtonAdd?: () => void;
  onClickFilter?: () => void;
  onClickMore?: () => void;
  dropdownConfig?: DropdownItem[];
  dropdownMore?: DropdownItem[];
  buttonCreatingKey?: string;
  buttonFilterKey?: string;
  children?: React.ReactNode;
  isDetail?: boolean;
  buttonAddRender?: (val: any) => React.ReactNode;
}

const HeaderViewList = ({
  title,
  onClickButtonAdd,
  onClickFilter,
  onClickMore,
  children,
  buttonCreatingKey,
  buttonFilterKey,
  dropdownConfig,
  dropdownMore,
  isDetail,
  buttonAddRender,
}: IProps) => {
  const { hasPage } = usePermission();
  const { isMobile } = useDetectDevice();
  const [open, setOpen] = useState<boolean>(false);

  const checkPermissionButton = (key: string): boolean =>
    key ? hasPage(key) : true;

  const layoutRender = isDetail ? "" : "md:flex-col justify-between";

  return (
    <>
      <div
        className={classNames(
          "w-full p-5 mb-6 bg-white shadow-xsm rounded-[5px] flex gap-y-4 lg:flex-row lg:items-center lg:justify-between md:justify-between",
          layoutRender,
        )}
      >
        <h2 className="flex items-center text-base font-medium uppercase">
          {title}
        </h2>
        {isMobile ? (
          !open ? (
            <ChevronDownSolid
              onClick={() => setOpen(true)}
              width={"1rem"}
              height={"1rem"}
            />
          ) : (
            <ChevronUpSolid
              onClick={() => setOpen(false)}
              width={"1rem"}
              height={"1rem"}
            />
          )
        ) : (
          <div className="flex items-center justify-end gap-2.5">
            {children}

            {onClickFilter && checkPermissionButton(buttonFilterKey) && (
              <Button
                type="alternative"
                className="rounded-xsm"
                icon={
                  <FunnelOutlined className="w-5 h-5 text-gray-400 shrink-0" />
                }
                onClick={onClickFilter}
              />
            )}

            {dropdownConfig && dropdownConfig?.length > 0 && (
              <Dropdown menu={{ items: dropdownConfig }} trigger="click">
                <Button
                  type="alternative"
                  className="rounded-xsm"
                  icon={
                    <AdjustmentsHorizontalOutlined className="text-gray-400 shrink-0" />
                  }
                />
              </Dropdown>
            )}

            {(onClickButtonAdd || buttonAddRender) &&
              checkPermissionButton(buttonCreatingKey) &&
              (buttonAddRender ? (
                buttonAddRender({ onClick: onClickButtonAdd })
              ) : (
                <Button
                  onClick={onClickButtonAdd}
                  className="rounded-xsm shrink-0"
                >
                  <div className="flex items-center gap-1 shrink-0">
                    <PlusCircleOutlined className="w-5 h-5" />
                    <span>Thêm mới</span>
                  </div>
                </Button>
              ))}

            {dropdownMore && (
              <Dropdown menu={{ items: dropdownMore }} trigger="click">
                <Button
                  type="alternative"
                  className="rounded-xsm"
                  icon={
                    <EllipsisHorizontalOutlined className="w-5 h-5 text-gray-400" />
                  }
                />
              </Dropdown>
            )}
            {onClickMore && (
              <Button
                type="alternative"
                className="rounded-xsm"
                icon={
                  <EllipsisHorizontalOutlined className="w-5 h-5 text-gray-400" />
                }
                onClick={onClickMore}
              />
            )}
          </div>
        )}
        {isMobile && open && (
          <div className="flex items-center justify-end gap-2.5">
            {children}

            {onClickFilter && checkPermissionButton(buttonFilterKey) && (
              <Button
                type="alternative"
                className="rounded-xsm"
                icon={
                  <FunnelOutlined className="w-5 h-5 text-gray-400 shrink-0" />
                }
                onClick={onClickFilter}
              />
            )}

            {dropdownConfig && dropdownConfig?.length > 0 && (
              <Dropdown menu={{ items: dropdownConfig }} trigger="click">
                <Button
                  type="alternative"
                  className="rounded-xsm"
                  icon={
                    <AdjustmentsHorizontalOutlined className="text-gray-400 shrink-0" />
                  }
                />
              </Dropdown>
            )}

            {(onClickButtonAdd || buttonAddRender) &&
            checkPermissionButton(buttonCreatingKey) &&
            buttonAddRender ? (
              buttonAddRender({ onClick: onClickButtonAdd })
            ) : (
              <Button
                onClick={onClickButtonAdd}
                className="rounded-xsm shrink-0"
              >
                <div className="flex items-center gap-1 shrink-0">
                  <PlusCircleOutlined className="w-5 h-5" />
                  <span>Thêm mới</span>
                </div>
              </Button>
            )}
            {dropdownMore && (
              <Dropdown menu={{ items: dropdownMore }} trigger="click">
                <Button
                  type="alternative"
                  className="rounded-xsm"
                  icon={
                    <EllipsisHorizontalOutlined className="w-5 h-5 text-gray-400" />
                  }
                />
              </Dropdown>
            )}
            {onClickMore && (
              <Button
                type="alternative"
                className="rounded-xsm"
                icon={
                  <EllipsisHorizontalOutlined className="w-5 h-5 text-gray-400" />
                }
                onClick={onClickMore}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default HeaderViewList;
