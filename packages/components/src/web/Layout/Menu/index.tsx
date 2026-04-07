import useClickOutside from "@tera/components/web/Flow/useClickOutside";
import Icons from "@tera/components/web/Icons";
import { useStores } from "hooks/useStores";
import useGroupMenu from "@tera/commons/hooks/useGroupMenu";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@tera/themes/images/Icons/LogoTera.svg?react";
import { Bars3Outlined } from "tera-dls";
import { ModuleType } from "@tera/commons/interfaces/router";

import Header from "../Header";
import UserCompany from "../Header/UserCompany";
import DrawerMenu from "./DrawerMenu";
import MoreMenu from "./MoreMenu";
import { IMenu } from "./interface";

export interface MenuProps {
  isExpand?: boolean;
  module?: ModuleType;
}

const MenuComponent: React.FC<MenuProps> = observer(
  ({ isExpand, module }: MenuProps) => {
    const location = useLocation();
    // const navigate = useNavigate();
    const {
      commonStore: { activeMenu, openMenuMore, setActiveMenu, setOpenMenuMore },
      // authStore: { user },
    } = useStores();

    // const { data } = useQuery(
    //   ['get-module-permission'],
    //   () => AdminApi.getModuleActive({ params: { user_id: user?.id } }),
    //   {
    //     gcTime: 300000,
    //     staleTime: 300000,
    //   },
    // );
    const menus = useGroupMenu({ module });
    const [openDrawerMenu, setOpenDrawerMenu] = useState<boolean>(false);
    const updateActiveMenu = () => {
      const splitUrl = location?.pathname?.split("/");
      const checkMenu: IMenu = menus?.find(
        (obj) => splitUrl.indexOf(obj?.key) > -1,
      );

      setActiveMenu(String(checkMenu?.key));
    };

    useEffect(() => {
      location?.pathname && updateActiveMenu();
    }, [location, menus]);

    const handleActiveMenu = (key: string) => {
      setActiveMenu(key);
    };

    const handleOpenMoreMenu = (): void => {
      setOpenMenuMore(!openMenuMore);
    };

    const customItemClasses = (key?: string) => {
      return classNames(
        "tera-menu relative min-w-[80px] flex gap-x-2 items-center px-2 justify-center border-b-2 cursor-pointer hover:bg-blue-50 hover:border-b-2 [&_.menu-icon]:hover:text-blue-600 [&_.menu-title]:hover:text-blue-600",
        activeMenu === key
          ? "[&_.menu-icon]:text-blue-600 [&_.menu-title]:text-blue-600 border-blue-600 bg-blue-50 tera-menu--active"
          : "border-transparent",
      );
    };

    const sliceMenu = useMemo(() => {
      const menu = [...menus].splice(0, 6);
      const menuRemain = [...menus].splice(6, 100);

      return {
        menu,
        menuRemain,
      };
    }, [menus]);

    const elementRef = useRef();

    const handleCloseMoreMenu = () => {
      openMenuMore && setOpenMenuMore(false);
    };

    useClickOutside(elementRef, handleCloseMoreMenu);

    const activeOtherMenu = useMemo(() => {
      const menuRemain = sliceMenu?.menuRemain.map((item) => item.key);
      return menuRemain?.includes(activeMenu);
    }, [activeMenu, sliceMenu]);
    activeOtherMenu;
    handleOpenMoreMenu;
    return (
      <>
        <div
          id="menu"
          ref={elementRef}
          className={`${
            isExpand ? "xmd:left-[225px]" : "xmd:left-[50px]"
          } transition-all fixed top-0 right-0 z-[49] px-2.5 h-[45px]  flex items-center justify-between bg-white border-b border-gray-200 text-xxs left-0`}
          style={{ boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.05)" }}
        >
          <UserCompany />
          <div className="flex items-center gap-x-4 xmd:hidden">
            <Bars3Outlined
              className="text-blue-800 w-7 h-7 cursor-pointer"
              onClick={() => setOpenDrawerMenu(true)}
            />
            <Logo />
          </div>
          <ul className="hidden xmd:flex gap-x-[5px] h-full mr-auto">
            {sliceMenu.menu?.map((item: IMenu) => {
              const { id, key, icon, path, title } = item;
              return (
                <li
                  className={customItemClasses(key)}
                  key={id}
                  onClick={() => handleActiveMenu(key)}
                >
                  <Icons icon={icon} />
                  {/* {icon && (
                    <Icon
                      type={icon}
                      className={classNames('w-4 h-4', {
                        'text-blue-600': activeMenu === key,
                      })}
                    />
                  )}
                  {iconNode && (
                    <i className="w-4 h-4 text-gray-600 menu-icon">
                      {iconNode}
                    </i>
                  )} */}
                  <span className="text-gray-800 text-xxs link-outer-container menu-title">
                    <Link to={path}> {title}</Link>
                  </span>
                </li>
              );
            })}
            {/* <li
              className={`${customItemClasses()} ${
                activeOtherMenu && '!bg-blue-50 !border-b-2 !border-blue-600'
              }`}
              onClick={handleOpenMoreMenu}
            >
              <i className="w-4 h-4 text-gray-600 menu-icon">
                <EllipsisHorizontalOutlined />
              </i>
              <span
                className={classNames(
                  'text-gray-800 text-xxs link-outer-container menu-title',
                  { '!text-blue-600': activeOtherMenu },
                )}
              >
                Khác
              </span>
            </li> */}
          </ul>
          <Header />
        </div>
        <MoreMenu menus={sliceMenu.menuRemain} />
        <DrawerMenu
          open={openDrawerMenu}
          onClose={() => setOpenDrawerMenu(false)}
          containerClassName="p-0"
        />
      </>
    );
  },
);

export default MenuComponent;
