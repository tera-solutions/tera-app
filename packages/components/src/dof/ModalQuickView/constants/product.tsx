import {
  Bars4Outlined,
  DocumentTextOutlined,
  InformationCircleOutlined,
  LinkOutlined,
  PhotoOutlined,
} from "tera-dls";

const classIcon = "w-5 h-5";

export const TABS_FORM = {
  general: {
    title: "Thông tin sản phẩm",
    icon: <InformationCircleOutlined className={classIcon} />,
  },
  description: {
    title: "Mô tả",
    icon: <DocumentTextOutlined className={classIcon} />,
  },
  "list-image": {
    title: "Ảnh sản phẩm",
    icon: <PhotoOutlined className={classIcon} />,
  },
  properties: {
    title: "Thuộc tính",
    icon: <Bars4Outlined className={classIcon} />,
  },
  "link-sales": {
    title: "Liên kết bán hàng",
    icon: <LinkOutlined className={classIcon} />,
  },
};

export const ProductType = {
  single: "SP thường",
  variable: "SP biến thể",
  combo: "SP combo",
};

export const ProductTypeColor = {
  single: "gray02",
  variable: "blue03",
  combo: "pink03",
};
