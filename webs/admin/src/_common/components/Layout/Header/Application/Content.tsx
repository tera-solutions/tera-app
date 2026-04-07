import { useQuery } from "@tanstack/react-query";
import DefaultImage from "@tera/components/web/DefaultImage";
import Icons from "@tera/components/web/Icons";
import { TypeIcon } from "@tera/components/web/Icons/interface";
import { useStores } from "_common/hooks/useStores";
import { CryptoJSAesEncrypt } from "@tera/commons/utils/hashHelper";
import { observer } from "mobx-react-lite";
import { Row, Spin, Tooltip, updateQueryParams } from "tera-dls";

export const modules = [
  {
    id: "r1",
    code: "sale",
    title: "Bán hàng",
    path: "/sale/customer/list",
    icon: "menu16",
    key: "sale",
    permission: "sale",
  },
  {
    id: "r2",
    title: "Marketing",
    path: "/marketing/campaign-management",
    icon: "menu2",
    key: "marketing",
    code: "mkt",
    permission: "mkt",
  },
  {
    id: "r3",
    title: "CSKH",
    path: "/customer-care/consulting-ticket/list",
    icon: "menu3",
    key: "customer-care",
    code: "cs",
    permission: "cs",
  },
  {
    id: "r4",
    title: "Kho",
    path: "/warehouse/product-management/list",
    icon: "menu4",
    key: "warehouse",
    code: "wh",
    permission: "wh",
  },
  {
    id: "r5",
    title: "Mua hàng",
    path: "/purchase/supplier/list",
    icon: "menu5",
    key: "purchase",
    code: "purchase",
    permission: "purchase",
  },
  {
    id: "r6",
    title: "Vận chuyển",
    path: "/transport/delivery-sell",
    icon: "menu7",
    key: "transport",
    code: "log",
    permission: "log",
  },
  {
    id: "r7",
    title: "Công việc",
    path: "/work/project/list",
    icon: "menu8",
    key: "work",
    code: "work",
    permission: "work",
  },
  {
    id: "r8",
    title: "Vận hành",
    path: "/operation-management/operation/approval/list",
    icon: "menu9",
    key: "operation-management",
    code: "operation",
    permission: "operation",
  },
  {
    id: "r11",
    title: "Nhân sự",
    path: "/hrm/employee/list",
    icon: "menu12",
    key: "hrm",
    code: "hr",
    permission: "hr",
  },
  {
    id: "r12",
    title: "Tài chính",
    path: "/finance/sales-order-confirm/list",
    icon: "menu13",
    key: "finance",
    code: "fin",
    permission: "fin",
  },
];

function Content({ onClickViewMore }) {
  const {
    commonStore: { business },
    authStore: { user, access_id },
  } = useStores();

  const handleRedirectLink = (link) => {
    if (!link) return;
    const bodyParams = {
      access_id: access_id,
    };
    const queryParams = updateQueryParams({
      client_id: "tera",
      req: JSON.stringify(CryptoJSAesEncrypt(bodyParams)),
    });

    console.log("bodyParams", bodyParams);

    window.open(`${link}${queryParams}`, "_self");
  };

  return (
    <div className="max-w-[400px]">
      <Row className="grid-cols-2 gap-6 ">
        <p className="text-gray-500">Tổ chức kinh doanh</p>
        <p className="text-gray-500">Tài khoản đăng nhập</p>
        <div className="flex flex-col gap-y-[5px]">
          <p className="font-bold line-clamp-1 break-word">{business?.name}</p>
          <p className="text-gray-500 line-clamp-1 break-word">
            {business?.ownerName}
          </p>
        </div>
        <div className="flex items-center gap-x-2.5">
          <DefaultImage
            src={user?.avatar_url}
            alt={user?.full_name}
            className="w-[30px] h-[30px] rounded-full"
          />
          <div className="flex flex-col justify-between">
            <p className="font-bold text-blue-500 line-clamp-1 break-word">
              {user?.full_name}
            </p>
            <p className="text-gray-500 line-clamp-1 break-word">
              {user?.role_name}
            </p>
          </div>
        </div>
      </Row>
      <div className="mt-[35px]">
        <div className="flex justify-between">
          <p className="text-gray-500">Các ứng dụng của bạn</p>
          <span
            onClick={onClickViewMore}
            className="hover:text-blue-600 hover:underline hover:cursor-pointer"
          >
            Xem thêm
          </span>
        </div>
      </div>
    </div>
  );
}

export default observer(Content);
