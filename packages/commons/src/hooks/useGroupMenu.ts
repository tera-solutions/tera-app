import { dashboardMenu, systemMenu } from "../components/Layout/Menu/menus";
import { ModuleType } from "@tera/commons/interfaces/router";

import sale from "@tera/components/web/Layout/Menu/sale.json";
import purchase from "@tera/components/web/Layout/Menu/purchase.json";
import admin from "@tera/components/web/Layout/Menu/admin.json";
import contact from "@tera/components/web/Layout/Menu/contact.json";
import eshop from "@tera/components/web/Layout/Menu/eshop.json";
import finance from "@tera/components/web/Layout/Menu/finance.json";
import hrm from "@tera/components/web/Layout/Menu/hrm.json";
import logistic from "@tera/components/web/Layout/Menu/logistic.json";
import marketing from "@tera/components/web/Layout/Menu/marketing.json";
import operation from "@tera/components/web/Layout/Menu/operation.json";
import warehouse from "@tera/components/web/Layout/Menu/warehouse.json";
import master from "@tera/components/web/Layout/Menu/master.json";

const useGroupMenu = ({ module }: { module?: ModuleType }) => {
  const menuMap: Record<ModuleType, any> = {
    sales: sale.groupMenu,
    purchase: purchase.groupMenu,
    admin: admin.groupMenu,
    portal: sale.groupMenu,
    contact: contact.groupMenu,
    eshop: eshop.groupMenu,
    finance: finance.groupMenu,
    hrm: hrm.groupMenu,
    logistics: logistic.groupMenu,
    marketing: marketing.groupMenu,
    operation: operation.groupMenu,
    warehouse: warehouse.groupMenu,
    master: master.groupMenu,
  };

  const targetMenu = module ? menuMap[module] : sale.groupMenu;

  return [dashboardMenu, ...targetMenu, systemMenu];
};

export default useGroupMenu;
