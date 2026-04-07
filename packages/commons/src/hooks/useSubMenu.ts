import { systemSubMenu } from "../components/Layout/Menu/menus";
import { mergeArrayObjectByKeyDependOnNewArray } from "tera-dls";
import { useStores } from "hooks/useStores";
import { useMemo } from "react";
import { ModuleType } from "@tera/commons/interfaces/router";

// Import các file menu JSON từ path của bạn
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

const subMenuObject = {
  ["system"]: systemSubMenu,
};

// Giả lập dữ liệu từ API (sau này bạn có thể mở lại useQuery ở đây)
const subMenusFromApi = {
  data: [],
};

interface UseSubMenuProps {
  active?: string; // Đổi thành string để nhận key cụ thể nếu cần
  module?: ModuleType;
}

const useSubMenu = ({ active, module = "sales" }: UseSubMenuProps) => {
  const {
    commonStore: { activeMenu },
  } = useStores();

  // 1. Xác định dữ liệu nguồn dựa trên Module
  const currentModuleData = useMemo(() => {
    const menuMap = {
      sales: sale,
      purchase: purchase,
      admin: admin,
      portal: sale,
      contact: contact,
      eshop: eshop,
      finance: finance,
      hrm: hrm,
      logistics: logistic,
      marketing: marketing,
      operation: operation,
      warehouse: warehouse,
      master: master,
    };
    return menuMap[module] || sale;
  }, [module]);

  // 2. Logic lấy sub menu từ file JSON hiện tại
  const getSubMenuFromJson = (targetParentKey: string) =>
    currentModuleData.subMenu.filter(
      (item: any) => item?.parentKey === targetParentKey,
    );

  // 3. Xử lý dữ liệu cấu hình từ API (nếu có)
  const configSubMenu = useMemo(() => {
    return subMenusFromApi?.data
      ?.filter((item: any) => item.status === "active")
      ?.map((item: any) => ({ ...item, code: item.concatenated_code }));
  }, []);

  // 4. Merge dữ liệu Parent Menu và Sub Menu
  const menus = useMemo(() => {
    const targetParentKey = active || activeMenu;

    return currentModuleData.parentMenu
      ?.filter((item: any) => item?.parentKey === targetParentKey)
      ?.map((parent: any) => {
        const defaultChildren = getSubMenuFromJson(parent.key);

        // Merge giữa menu tĩnh (JSON) và menu động (API config)
        const children = mergeArrayObjectByKeyDependOnNewArray(
          configSubMenu,
          defaultChildren,
          "code",
        );

        return { ...parent, children: children ?? [] };
      });
  }, [currentModuleData, active, activeMenu, configSubMenu]);

  // Trả về menu hệ thống nếu key là 'system', ngược lại trả về menu theo module
  return subMenuObject[activeMenu] ?? menus;
};

export default useSubMenu;
