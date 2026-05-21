import Icons from "@tera/components/web/Icons";
import { useStores } from "@tera/stores/useStores";
import classNames from "classnames";
import { groupBy } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, Collapse, Icon, XMarkSolid } from "tera-dls";
import { IMenu } from "./interface";
import admin from "./admin.json";
import useSubMenu from "_common/hooks/useSubMenu";
import useGroupMenu from "_common/hooks/useGroupMenu";
import { usePermission } from "@tera/commons/hooks/usePermission";
import { useStates } from "_common/hooks/useStates";

export interface MiniInlineMenuProps {
  onClose: (e?) => void;
}
const MiniInlineMenu: React.FC<MiniInlineMenuProps> = observer(
  ({ onClose }) => {
    const {
      commonStore: { activeMenu: activeGroupKey },
    } = useStates();
    const [activeGroupDraft, setActiveGroupDraft] = useState<string>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { hasPage } = usePermission();

    const listMenu = useSubMenu(activeGroupDraft || activeGroupKey);
    const groupMenu = useGroupMenu();

    const [collapseActiveKey, setCollapseActiveKey] = useState<string>();

    const handleClick = (path: string): void => {
      navigate(path);
      onClose();
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
        arrMenu
          ?.filter((item) => hasPage(item?.permission))
          ?.map((item: IMenu) => {
            const children = item.children;
            return {
              key: item.key,
              onClick: () => item.path && handleClick(item.path),
              label: (
                <div
                  className={classNames(
                    "flex items-center gap-2.5 font-normal text-gray-200",
                    // { '!gap-1 py-[8px] justify-center w-full': !isExpand },
                  )}
                >
                  <div
                    className={`w-[3px] h-[15px] rounded-r-[2px] ${
                      !isActiveKey(item.key) ? "" : "bg-[#00AFEF]"
                    }`}
                  />

                  {item.icon && <Icon type={item.icon} className={`w-4 h-4`} />}
                  {item?.iconNode && (
                    <i className="w-4 h-4 text-white menu-icon">
                      {item.iconNode}
                    </i>
                  )}
                  <span>{item.title}</span>
                </div>
              ),
              ...(children?.length > 0
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
                                  ...(child?.activeKeys
                                    ? child?.activeKeys
                                    : []),
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

    const renderTitle = (title) => {
      return title;
    };

    const elementRef = useRef(null);

    const renderHeading = () => {
      const data = admin.groupMenu.find((item) => item?.key === activeGroupKey);

      return (
        <span className="flex gap-x-2 items-center">
          <Icons icon={data?.icon as any} className="tera-menu-mini_icon" />{" "}
          {data?.title || "Tera"}
        </span>
      );
    };

    const [isModuleMenu, setIsModuleMenu] = useState<boolean>(false);

    return (
      <div className="flex flex-col gap-y-4 items-center h-full bg-blue-800 p-5">
        <div className="shrink-0">
          <XMarkSolid className="w-6 h-6 text-white" onClick={onClose} />
        </div>
        {isModuleMenu ? (
          <div className="grid grid-cols-2 w-full gap-x-10 gap-y-2.5">
            {groupMenu.map((item) => (
              <div
                className={classNames(
                  "flex flex-col p-2.5 items-center gap-y-2.5 rounded-[10px]",
                  {
                    "bg-white/25": activeGroupKey === item?.key,
                  },
                )}
                onClick={() => {
                  setActiveGroupDraft(item.key);
                  setIsModuleMenu(false);
                }}
              >
                <Icons
                  icon={item?.icon}
                  className="tera-menu-mini_icon"
                  width={30}
                  height={30}
                />
                <span className="text-white line-clamp-1 break-all">
                  {item?.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={"flex items-center w-full justify-between"}>
              <div className={"flex items-center gap-x-2.5"}>
                <ArrowLeftOutlined
                  className="w-5 h-5 text-white"
                  onClick={() => setIsModuleMenu(true)}
                />
                <h1
                  className={classNames("text-white")}
                  // key={key}
                >
                  {renderHeading()}
                </h1>
              </div>
            </div>
            <div
              ref={elementRef}
              className="flex-1 flex flex-col gap-y-5 overflow-auto w-full scrollbar-none"
            >
              {Object.entries(groupListMenu)
                .filter(([, value]) => {
                  return value.some((item) => hasPage(item.permission));
                })
                .map(([key, value]) => {
                  const name = menu?.parentGroup?.find(
                    (i) => i.key === key,
                  )?.title;
                  return (
                    <div className={classNames("flex flex-col gap-y-[5px]")}>
                      <h3
                        className={classNames(
                          "ml-2.5 uppercase text-gray-200 font-medium transition-all leading-6",
                        )}
                      >
                        {renderTitle(name || "Khác")}
                      </h3>

                      <Collapse
                        accordion
                        activeKey={collapseActiveKey}
                        containerClassName="flex flex-col gap-2.5 w-full"
                        headingClassName={classNames(
                          "p-2.5 bg-transparent border-none !rounded-e-full text-gray-200 focus:ring-0",
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
            <p className="text-gray-200">@Copyright TeraVN ver 3.0</p>
          </>
        )}
      </div>
    );
  },
);

export default MiniInlineMenu;
