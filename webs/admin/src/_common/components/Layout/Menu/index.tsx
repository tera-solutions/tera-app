import Icons from "@tera/components/web/Icons";
import { useStores } from "@tera/stores/useStores";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@tera/assets/icons/LogoTera.svg?react";
import { Bars3Outlined } from "tera-dls";
import useGroupMenu from "_common/hooks/useGroupMenu";
import useClickOutside from "_common/hooks/useClickOutside";
import { useStates } from "_common/hooks/useStates";

import Header from "../Header";
import DrawerMenu from "./DrawerMenu";
import MoreMenu from "./MoreMenu";
import { IMenu } from "./interface";

export interface MenuProps {
  isExpand?: boolean;
}

const MenuComponent: React.FC<MenuProps> = observer(
  ({ isExpand }: MenuProps) => {
    const location = useLocation();
    const {
      commonStore: { activeMenu, openMenuMore, setActiveMenu, setOpenMenuMore },
    } = useStates();

    const menus = useGroupMenu();
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

    const elementRef = useRef(null);

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
          id='menu'
          ref={elementRef}
          className={`${
            isExpand ? "xmd:left-[225px]" : "xmd:left-[50px]"
          } transition-all fixed top-0 right-0 z-[49] px-2.5 h-[45px] flex items-center justify-between bg-white border-b border-gray-200 text-xxs left-0`}
          style={{ boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.05)" }}
        >
          <div className='flex items-center gap-x-4 xmd:hidden'>
            <Bars3Outlined
              className='text-blue-800 w-7 h-7 cursor-pointer flex-shrink-0'
              onClick={() => setOpenDrawerMenu(true)}
            />
            <Logo />
          </div>

          {/* Desktop: menu items*/}
          <ul className='hidden xmd:flex gap-x-[5px] h-full mr-auto'>
            {sliceMenu.menu?.map((item: IMenu) => {
              const { id, key, icon, path, title } = item;
              return (
                <li
                  className={customItemClasses(key)}
                  key={id}
                  onClick={() => handleActiveMenu(key)}
                >
                  <Icons icon={icon} />
                  <span className='text-gray-800 text-xxs link-outer-container menu-title'>
                    <Link to={path}>{title}</Link>
                  </span>
                </li>
              );
            })}
          </ul>

          <Header />
        </div>

        {/* Mobile: bottom navigation */}
        <nav
          className='xmd:hidden fixed bottom-0 left-0 right-0 z-[49] bg-white border-t border-gray-200 h-[60px]'
          style={{ boxShadow: "0px -2px 4px 0px rgba(0, 0, 0, 0.05)" }}
        >
          <ul className='flex items-center justify-around h-full'>
            {sliceMenu.menu?.map((item: IMenu) => {
              const { id, key, icon, path, title } = item;
              return (
                <li
                  key={id}
                  className='flex flex-col items-center justify-center gap-y-0.5 cursor-pointer flex-1 h-full'
                  onClick={() => handleActiveMenu(key)}
                >
                  <Link
                    to={path}
                    className={`flex flex-col items-center justify-center gap-y-0.5 w-full h-full
              ${
                key === activeMenu
                  ? "text-blue-600 border-t-2 border-blue-600"
                  : "text-gray-500"
              }`}
                  >
                    <Icons icon={icon} className='w-5 h-5' />
                    <span className='text-[10px] leading-tight'>{title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <MoreMenu menus={sliceMenu.menuRemain} />
        <DrawerMenu
          open={openDrawerMenu}
          onClose={() => setOpenDrawerMenu(false)}
          containerClassName='p-0'
        />
      </>
    );
  },
);

export default MenuComponent;
