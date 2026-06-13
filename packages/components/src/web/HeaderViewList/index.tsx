import { usePermission } from "@tera/commons/hooks/usePermission";
import classNames from "classnames";
import { ReactElement } from "react";
import {
  AdjustmentsHorizontalOutlined,
  Button,
  ChevronDownOutlined,
  Dropdown,
  DropdownItem,
  EllipsisHorizontalOutlined,
  FunnelOutlined,
  PlusOutlined,
} from "tera-dls";

interface IProps {
  bottomContent?: React.ReactNode;
  children: any;
  title?: ReactElement | string;
  titleRender?: ReactElement;
  selectedNumber?: number;
  dropdownItems?: DropdownItem[];
  dropdownMoreItems?: DropdownItem[];
  onClickFilter?: () => void;
  onClickButtonAdd?: () => void;
  actionLeftRender?: ReactElement;
  buttonAddRender?: () => ReactElement;
  buttonFilterKey?: string;
  buttonCreatingKey?: string;
  optionItems?: DropdownItem[];
  middleContent?: ReactElement;
}
const HeaderViewListV2 = (props: IProps) => {
  const {
    bottomContent,
    children,
    title,
    titleRender,
    selectedNumber = 0,
    dropdownItems,
    dropdownMoreItems,
    onClickFilter,
    actionLeftRender,
    onClickButtonAdd,
    buttonAddRender,
    buttonFilterKey,
    buttonCreatingKey,
    optionItems,
    middleContent,
  } = props;

  const { hasPage } = usePermission();

  const checkPermissionButton = (key?: string): boolean =>
    key ? hasPage(key) : true;

  const renderBtnAdd = () => {
    if (buttonAddRender) return buttonAddRender();

    return (
      onClickButtonAdd && (
        <Button
          onClick={onClickButtonAdd}
          className="px-[12px] py-[5px] rounded-[4px] flex gap-2.5 bg-blue-500"
        >
          <div className="flex gap-[5px] items-center">
            <PlusOutlined className="w-[17px] h-[17px]" />
            <span>Thêm mới</span>
          </div>
        </Button>
      )
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-[13px]">
        {titleRender}
        <div className="text-gray-700 font-semibold text-base uppercase">
          {title}
        </div>
        <div className="hidden xmd:block">
          {checkPermissionButton(buttonCreatingKey) && renderBtnAdd()}
        </div>
      </div>
      {middleContent && <>{middleContent}</>}
      <div className="rounded-[6px] overflow-hidden shadow-xsm bg-white">
        <div
          className={classNames("px-[9px] flex flex-wrap justify-between bg-white gap-y-2", {
            "py-2.5":
              !!selectedNumber ||
              !!optionItems ||
              !!actionLeftRender ||
              !!dropdownItems ||
              !!dropdownMoreItems ||
              !!onClickFilter,
          })}
        >
          <div className="flex gap-2.5 items-center">
            <div className="xmd:hidden">{actionLeftRender}</div>
            {selectedNumber !== 0 && (
              <div className="flex gap-1 italic text-[13px] leading-[13px]">
                <span className=" font-light"> Đã chọn</span>{" "}
                <span className="font-medium">{selectedNumber}</span>
              </div>
            )}
            {selectedNumber !== 0 && optionItems && (
              <Dropdown
                menu={{ items: optionItems }}
                trigger="click"
                containerClassName="min-w-fit max-w-fit max-h-fit"
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  htmlType="button"
                  type="alternative"
                  className="py-[5px] p-x-2.5 rounded-[35px] bg-green-500 border-green-500 hover:bg-green-600 hover:text-white text-white gap-2.5"
                >
                  <span className="font-light text-[13px] leading-[16px]">
                    Tuỳ chọn
                  </span>{" "}
                  <ChevronDownOutlined className="w-3 h-3 stroke-2" />
                </Button>
              </Dropdown>
            )}
          </div>
          <div className="flex gap-2.5 items-center">
            <div className="hidden xmd:block">{actionLeftRender}</div>
            <div className="xmd:hidden">
              {checkPermissionButton(buttonCreatingKey) && renderBtnAdd()}
            </div>
            {dropdownItems && dropdownItems?.length > 0 && (
              <Dropdown menu={{ items: dropdownItems }} trigger="click">
                <Button
                  type="alternative"
                  className="rounded-xsm py-1 px-1 bg-blue-50"
                  icon={
                    <AdjustmentsHorizontalOutlined className="text-gray-500  shrink-0" />
                  }
                />
              </Dropdown>
            )}
            {onClickFilter && checkPermissionButton(buttonFilterKey) && (
              <Button
                type="alternative"
                className="hidden xmd:flex rounded-xsm py-1 px-1 bg-blue-50"
                icon={
                  <FunnelOutlined className=" text-blue-500 rounded-[4px] shrink-0" />
                }
                onClick={onClickFilter}
              />
            )}
            {dropdownMoreItems && (
              <Dropdown menu={{ items: dropdownMoreItems }} trigger="click">
                <Button
                  type="alternative"
                  className="rounded-xsm py-1 px-1 bg-blue-50"
                  icon={
                    <EllipsisHorizontalOutlined className="w-5 h-5 text-blue-500" />
                  }
                />
              </Dropdown>
            )}
          </div>
        </div>
        {bottomContent && <div className="border-t">{bottomContent}</div>}
        {children}
      </div>
    </>
  );
};

export default HeaderViewListV2;
