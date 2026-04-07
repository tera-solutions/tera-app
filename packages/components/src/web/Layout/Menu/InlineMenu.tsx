import Logo from "@tera/themes/images/Icons/LogoTera.svg?react";
import { useStores } from "hooks/useStores";
import useSubMenu from "@tera/commons/hooks/useSubMenu";
import classNames from "classnames";
import { groupBy } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bars3BottomRightOutlined, Collapse, Icon, Tooltip } from "tera-dls";
import { ModuleType } from "@tera/commons/interfaces/router";
import { IMenu } from "./interface";
import menu from "./admin.json";

export interface InlineMenuProps {
  containerClassName?: string;
  isExpand?: boolean;
  module?: ModuleType;
  onChangeSize?: (expand: boolean) => void;
}

const InlineMenu: React.FC<InlineMenuProps> = observer(
  ({ isExpand, containerClassName, onChangeSize, module }) => {
    const {
      commonStore: { activeMenu: activeGroupKey },
    } = useStores();
    const location = useLocation();
    const navigate = useNavigate();
    const listMenu = useSubMenu({ module });
    // const menus = useGroupMenu();

    // const title = useMemo(() => {
    //   const data = menus?.find((item) => item.key === activeGroupKey);
    //   return data?.title;
    // }, [menus, activeGroupKey]);

    const [collapseActiveKey, setCollapseActiveKey] = useState<string>();

    const handleClick = async (path: string): Promise<void> => {
      await navigate(path);
    };

    const getActiveKeyInURL = (): string => {
      const split = location?.pathname?.split("/");
      const activeGroupKeyIndex = split?.findIndex(
        (key) => key === activeGroupKey,
      );
      return split?.[activeGroupKeyIndex + 1] ?? "";
    };
    useEffect(() => {
      const activeKey = getActiveKeyInURL();

      setCollapseActiveKey(activeKey);
    }, [location?.pathname, activeGroupKey]);

    const handleChangeSizeMenu = () => {
      onChangeSize(!isExpand);
    };

    const menuClasses = classNames(
      `fixed top-0 left-0 transition-all h-screen shrink-0 py-5 bg-blue-800 overflow-hidden`,
      containerClassName,
      {
        "w-[225px] rounded-se-[20px] rounded-ee-[20px] pr-2.5": isExpand,
        "w-[50px] px-0": !isExpand,
      },
    );

    const isActiveKey = (key: string): boolean => collapseActiveKey === key;

    const getActiveClasses = (activeKeys: any = []): string => {
      const isActive = activeKeys.some((key) =>
        location?.pathname.includes(key),
      );
      return isActive ? "bg-white/25 " : "";
    };

    const groupListMenu = groupBy(listMenu, "parentGroupKey");

    const listCollapse = useCallback(
      (arrMenu) =>
        arrMenu?.map((item: IMenu) => {
          const children = item.children;
          return {
            key: item.key,
            onClick: () => item.path && handleClick(item.path),
            label: (
              <Tooltip
                className={isExpand && "hidden"}
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
            ...(children?.length > 0 && isExpand
              ? {
                  children: (
                    <div className="flex flex-col">
                      {children?.map((child) => {
                        return (
                          <div
                            key={child.id}
                            onClick={() => handleClick(child.path)}
                            className={`text-gray-200 flex items-center gap-2.5 cursor-pointer py-2.5 pl-6 rounded-e-full ${getActiveClasses(
                              [
                                ...(child?.path ? [child.path] : []),
                                ...(child?.activeKeys ? child?.activeKeys : []),
                              ],
                            )}`}
                          >
                            {child.name}
                          </div>
                        );
                      })}
                    </div>
                  ),
                }
              : { children: null }),
          };
        }),
      [listMenu, collapseActiveKey, getActiveClasses],
    );
    // if (!listMenu?.length) return <></>;

    const renderTitle = (title) => {
      if (isExpand) return title;
      return title.slice(0, 1);
    };

    const elementRef = useRef(null);

    const renderHeading = () => {
      const data = menu.groupMenu.find((item) => item?.key === activeGroupKey);
      return data?.title || "Tera";
    };

    return (
      <div className="bg-red-500">
        <div className={menuClasses}>
          <div className="flex flex-col gap-y-5 items-center h-full">
            <div
              className={classNames(
                "flex items-center w-full justify-between",
                {
                  "flex-col": !isExpand,
                  "gap-y-5": !isExpand,
                },
              )}
            >
              <div
                className={classNames("flex items-center", {
                  "gap-x-4 pl-2.5": isExpand,
                })}
              >
                <Logo />
                <h1
                  className={classNames(
                    "text-[21px] leading-5 text-white font-medium line-clamp-1",
                    {
                      hidden: !isExpand,
                    },
                  )}
                  // key={key}
                >
                  {renderHeading()}
                </h1>
              </div>
              <Bars3BottomRightOutlined
                className="w-5 h-5 text-white cursor-pointer shrink-0"
                onClick={handleChangeSizeMenu}
              />
            </div>
            <div
              ref={elementRef}
              className={classNames(
                "flex-1 flex flex-col gap-y-5 overflow-auto w-full scrollbar-none",
                {
                  "shadow-md inset-y-0 bottom-0":
                    elementRef.current?.scrollHeight >
                    elementRef.current?.clientHeight,
                },
              )}
            >
              {Object.entries(groupListMenu).map(([key, value]) => {
                const name = menu?.parentGroup?.find(
                  (i) => i.key === key,
                )?.title;
                return (
                  <div
                    className={classNames("flex flex-col gap-y-[5px]", {
                      "items-center": !isExpand,
                    })}
                  >
                    <Tooltip
                      className={isExpand && "hidden"}
                      title={name || "Khác"}
                      placement="right"
                    >
                      <h3
                        className={classNames(
                          "ml-2.5 uppercase text-gray-200 font-medium transition-all leading-6",
                          {
                            "!ml-0 !font-bold w-5 h-5 rounded-full bg-white/25 flex items-center justify-center":
                              !isExpand,
                          },
                        )}
                      >
                        {renderTitle(name || "Khác")}
                      </h3>
                    </Tooltip>
                    <Collapse
                      accordion
                      activeKey={collapseActiveKey}
                      containerClassName="flex flex-col gap-2.5 w-full"
                      headingClassName={classNames(
                        "p-2.5 bg-blue100 border-none !rounded-e-full text-gray-200 focus:ring-0",
                        { "p-0 !rounded-none": !isExpand },
                      )}
                      contentClassName={classNames(
                        "border-none p-0 !text-red-500",
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
              <p className="text-gray-200">@Copyright TeraVN ver 3.0</p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default InlineMenu;
