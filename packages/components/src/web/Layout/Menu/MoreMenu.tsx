import Icons from "@tera/components/web/Icons";
import { useStores } from "hooks/useStores";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { IMenu } from "./interface";

export interface MoreMenuProps {
  menus?: any;
}
const MoreMenu: React.FC<MoreMenuProps> = observer(({ menus }) => {
  const {
    commonStore: { activeMenu, openMenuMore, setActiveMenu },
  } = useStores();

  const menuClasses = classNames(
    "fixed z-40 w-full bg-white flex gap-12 items-center transition-all ",
    openMenuMore
      ? "top-[45px] mt-0 border border-gray-200"
      : "-z-10 -mt-[89px] border-none",
  );

  const customItemClasses = (key?: string) => {
    return classNames(
      "tera-menu group pb-1 pt-2 min-w-[80px] relative flex flex-col gap-x-2 gap-y-[5px] items-center px-2 justify-center border-b-2 cursor-pointer hover:bg-blue-50 hover:border-b-2 [&_.menu-icon]:hover:text-blue-600 [&_.menu-title]:hover:text-blue-600",
      activeMenu === key
        ? "bg-blue-50 [&_.menu-title]:text-blue-600 border-blue-600 tera-menu--active"
        : "border-transparent",
    );
  };

  const handleActiveMenu = (key: string) => {
    setActiveMenu(key);
  };

  return (
    <div
      className={menuClasses}
      style={{ boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <ul className="flex gap-x-[5px] h-full ">
        {menus?.map((item: IMenu) => {
          const { id, key, icon, iconNode, path, title } = item;
          return (
            <li
              className={customItemClasses(key)}
              key={id}
              onClick={() => handleActiveMenu(key)}
            >
              <div
                className={classNames(
                  "w-9 !h-9 rounded-[5px] flex justify-center items-center text-white bg-gray-200 border border-gray-200 group-hover:border-blue-600",
                  { "!border-blue-600": activeMenu === key },
                )}
              >
                <Icons icon={icon} />

                {/* {icon && (
                  <Icon
                    type={icon}
                    className={classNames(
                      'w-4 h-4 shrink-0 pointer-events-none',
                    )}
                  />
                )} */}
                {iconNode && (
                  <i className="w-4 h-4 !text-white menu-icon">{iconNode}</i>
                )}
              </div>
              <span className="text-gray-800 text-xxs link-outer-container menu-title">
                <Link to={path}> {title}</Link>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default MoreMenu;
