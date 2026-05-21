import { systemSubMenu } from "../components/Layout/Menu/menus";
import { mergeArrayObjectByKeyDependOnNewArray } from "tera-dls";
import { useMemo } from "react";
import { useStates } from "@tera/game/_common/hooks/useStates";

// Import các file menu JSON từ path của bạn
import admin from "@tera/game/_common/components/Layout/Menu/admin.json";

const subMenuObject = {
  ["system"]: systemSubMenu,
};

// Giả lập dữ liệu từ API (sau này bạn có thể mở lại useQuery ở đây)
const subMenusFromApi = {
  data: [],
};

interface UseSubMenuProps {
  active?: string;
}

const useSubMenu = ({ active }: UseSubMenuProps = {}) => {
  const {
    commonStore: { activeMenu },
  } = useStates();

  // 2. Logic lấy sub menu từ file JSON hiện tại
  const getSubMenuFromJson = (targetParentKey: string) =>
    admin.subMenu.filter((item: any) => item?.parentKey === targetParentKey);

  // 3. Xử lý dữ liệu cấu hình từ API (nếu có)
  const configSubMenu = useMemo(() => {
    return subMenusFromApi?.data
      ?.filter((item: any) => item.status === "active")
      ?.map((item: any) => ({ ...item, code: item.concatenated_code }));
  }, []);

  // 4. Merge dữ liệu Parent Menu và Sub Menu
  const menus = useMemo(() => {
    const targetParentKey = active || activeMenu;

    return admin.parentMenu
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
  }, [admin, active, activeMenu, configSubMenu]);

  // Trả về menu hệ thống nếu key là 'system', ngược lại trả về menu theo module
  return subMenuObject[activeMenu] ?? menus;
};

export default useSubMenu;
