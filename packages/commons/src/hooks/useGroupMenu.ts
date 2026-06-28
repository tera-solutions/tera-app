import { dashboardMenu, systemMenu } from "../components/Layout/Menu/menus";
import { ModuleType } from "@tera/commons/interfaces/router";

const useGroupMenu = ({ module }: { module?: ModuleType }) => {
  const menuMap: Record<ModuleType, any> = {};

  const targetMenu = module ? menuMap[module] : {};

  return [dashboardMenu, ...targetMenu, systemMenu];
};

export default useGroupMenu;
