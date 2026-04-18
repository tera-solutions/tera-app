import classNames from "classnames";
import { groupBy } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@tera/themes/images/Icons/LogoTera.svg?react";
import { Bars3BottomRightOutlined, Collapse, Icon, Tooltip } from "tera-dls";
import useSubMenu from "_common/hooks/useSubMenu";
import { usePermission } from "@tera/commons/hooks/usePermission";
import { useStores } from "@tera/stores/useStores";

// Import các file menu JSON
import admin from "_common/components/Layout/Menu/admin.json";
import { useStates } from "_common/hooks/useStates";

import { IMenu } from "./interface";

export interface InlineMenuProps {
  containerClassName?: string;
  isExpand?: boolean;
  onChangeSize?: (expand: boolean) => void;
}

const InlineMenuV2: React.FC<InlineMenuProps> = observer(
  ({ isExpand, containerClassName, onChangeSize }) => {
    const {
      commonStore: { activeMenu: activeGroupKey },
    } = useStates();
    const { hasPage } = usePermission();
    const location = useLocation();
    const navigate = useNavigate();
    const listMenu = useSubMenu();
    const elementRef = useRef<HTMLDivElement>(null);

    const [collapseActiveKey, setCollapseActiveKey] = useState<string>();

    const handleClick = (path: string): void => {
      if (path === window.location.pathname) return;
      navigate(path);
    };

    const getActiveKeyInURL = (groupKey: string): string => {
      const split = location?.pathname?.split("/");
      const index = split?.findIndex((key) => key === groupKey);
      return split?.[index + 1] ?? "";
    };

    useEffect(() => {
      const activeKey = getActiveKeyInURL(activeGroupKey);
      setCollapseActiveKey(activeKey);
    }, [location?.pathname, activeGroupKey]);

    const handleChangeSizeMenu = () => {
      onChangeSize?.(!isExpand);
    };

    const menuClasses = classNames(
      `h-full py-5 bg-blue-800 overflow-hidden transition-all duration-300`,
      containerClassName,
      {
        "w-[225px] rounded-se-[20px] rounded-ee-[20px] pr-2.5": isExpand,
        "w-[50px] px-0": !isExpand,
      },
    );

    const isActiveKey = (key: string): boolean => collapseActiveKey === key;

    const groupListMenu = groupBy(listMenu, "parentGroupKey");
    const listCollapse = useCallback(
      (arrMenu: IMenu[]) =>
        arrMenu
          ?.filter((item) => hasPage(item?.permission))
          ?.map((item: IMenu) => {
            const children = item.children;
            return {
              key: item.key,
              onClick: () => item.path && handleClick(item.path),
              label: (
                <Tooltip
                  className={isExpand ? "hidden" : ""}
                  title={item.title}
                  placement="right"
                >
                  <div
                    className={classNames(
                      "flex items-center gap-2.5 font-normal text-gray-200",
                      { "!gap-1 py-[8px] justify-center w-full": !isExpand },
                    )}
                  >
                    {isExpand && (
                      <div
                        className={`w-[3px] h-[15px] rounded-r-[2px] ${
                          !isActiveKey(item.key) ? "" : "bg-[#00AFEF]"
                        }`}
                      />
                    )}

                    {item.icon && (
                      <Icon
                        type={item.icon}
                        className={`${isExpand ? "w-4 h-4" : "w-5 h-5"} shrink-0`}
                      />
                    )}
                    {item?.iconNode && (
                      <i className="w-4 h-4 text-white menu-icon">
                        {item.iconNode}
                      </i>
                    )}
                    <span
                      className={classNames("truncate", { hidden: !isExpand })}
                    >
                      {item.title}
                    </span>
                  </div>
                </Tooltip>
              ),
              ...(children && children.length > 0 && isExpand
                ? {
                    children: (
                      <div className="flex flex-col">
                        {children.map((child: any) => (
                          <div
                            key={child.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(child.path);
                            }}
                            className={classNames(
                              `text-gray-200 flex items-center gap-2.5 cursor-pointer py-2.5 pl-6 rounded-e-full hover:bg-white/10`,
                              {
                                "bg-white/25":
                                  getActiveKeyInURL(child?.parentKey) ===
                                  child?.activeKeys,
                              },
                            )}
                          >
                            {child.name}
                          </div>
                        ))}
                      </div>
                    ),
                  }
                : { children: null }),
            };
          }),
      [listMenu, collapseActiveKey, isExpand, hasPage],
    );

    const renderTitle = (title: string) => {
      return isExpand ? title : title.slice(0, 1);
    };

    const renderHeading = () => {
      const data = admin.groupMenu.find(
        (item: any) => item?.key === activeGroupKey,
      );
      return data?.title || "Tera";
    };

    return (
      <div className="hidden xmd:block fixed top-0 left-0 transition-all h-screen shrink-0 bg-gradient-to-b from-white to-[#F3F3F9] z-[1000]">
        <div className={menuClasses}>
          <div className="flex flex-col gap-y-5 items-center h-full">
            {/* Header: Logo & Toggle */}
            <div
              className={classNames(
                "flex items-center w-full justify-between",
                { "flex-col gap-y-5": !isExpand },
              )}
            >
              <div
                className={classNames("flex items-center", {
                  "gap-x-4 pl-2.5": isExpand,
                })}
              >
                <Logo className="w-8 h-8" />
                <h1
                  className={classNames(
                    "text-[21px] text-white font-medium truncate",
                    { hidden: !isExpand },
                  )}
                >
                  {renderHeading()}
                </h1>
              </div>
              <Bars3BottomRightOutlined
                className="w-5 h-5 text-white cursor-pointer hover:opacity-80"
                onClick={handleChangeSizeMenu}
              />
            </div>

            {/* Menu List */}
            <div
              ref={elementRef}
              className="flex-1 flex flex-col gap-y-5 overflow-auto w-full scrollbar-none"
            >
              {Object.entries(groupListMenu)
                .filter(([, value]) =>
                  value.some((item: any) => hasPage(item.permission)),
                )
                .map(([key, value]) => {
                  const groupInfo = admin?.parentGroup?.find(
                    (i: any) => i.key === key,
                  );
                  const groupName = groupInfo?.title || "Khác";

                  return (
                    <div
                      key={key}
                      className={classNames("flex flex-col gap-y-[5px]", {
                        "items-center": !isExpand,
                      })}
                    >
                      <Tooltip
                        className={isExpand ? "hidden" : ""}
                        title={groupName}
                        placement="right"
                      >
                        <h3
                          className={classNames(
                            "ml-2.5 uppercase text-gray-200 font-medium transition-all leading-6",
                            {
                              "!ml-0 !font-bold w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-[10px]":
                                !isExpand,
                            },
                          )}
                        >
                          {renderTitle(groupName)}
                        </h3>
                      </Tooltip>
                      <Collapse
                        accordion
                        activeKey={collapseActiveKey ? [collapseActiveKey] : []}
                        containerClassName="flex flex-col gap-2.5 w-full"
                        headingClassName={classNames(
                          "p-2.5 bg-transparent border-none !rounded-e-full text-gray-200 focus:ring-0 hover:bg-white/10",
                          { "p-0 !rounded-none justify-center": !isExpand },
                        )}
                        activeClassName="bg-white/25 text-gray-200"
                        onChange={(key: any) => setCollapseActiveKey(key[0])}
                        items={listCollapse(value)}
                      />
                    </div>
                  );
                })}
            </div>

            {isExpand && (
              <p className="text-gray-200 text-[10px] opacity-50">
                @Copyright TeraVN ver 3.0
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default InlineMenuV2;
