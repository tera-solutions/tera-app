import { dashboardMenu, systemMenu } from "../components/Layout/Menu/menus";

import admin from "_common/components/Layout/Menu/admin.json";

const useGroupMenu = () => {
  return [dashboardMenu, ...admin.groupMenu, systemMenu];
};

export default useGroupMenu;
