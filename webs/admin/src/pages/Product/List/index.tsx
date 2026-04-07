import DefaultImage from "@tera/components/web/DefaultImage";
import HeaderViewList from "@tera/components/web/HeaderViewList";
import Icon from "@tera/components/web/Icon";
import SearchTable from "@tera/components/web/SearchTable";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";
import {
  BTN_PRIMARY,
  BTN_PRIMARY_LIGHT,
  HEADING_CLASS_NAME,
  TITLE_CLASS_NAME,
} from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import useConfirm from "@tera/states/hooks/useConfirm";
import classNames from "classnames";
import {
  Button,
  DropdownItem,
  formatCurrency,
  formatNumber,
  Toggle,
} from "tera-dls";
import { PRODUCT_LIST_URL } from "./url";
import { useNavigate } from "react-router-dom";

const ProductListPage = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const handleDelete = (record: any): void => {
    confirm.warning({
      title: "Xác định xóa sản phẩm",
      content: (
        <p className="break-word">
          <p>Bạn có chắc muốn xóa sản phẩm</p>
          <p>
            <span className="font-bold break-word">{record?.name} </span>
            này không?
          </p>
        </p>
      ),
      onOk: () => {
        console.log(123);
      },
    });
  };

  const generateDropDownItems = (record): DropdownItem[] => {
    const dropdownItems: DropdownItem[] = [
      {
        key: 1,
        label: "Nhân bản",
      },
      {
        key: 2,
        label: "Sửa",
        onClick: () =>
          navigate(`${PRODUCT_LIST_URL.update.path}/${record?.id}`),
      },
      {
        key: 3,
        label: <a className="text-red-500">Xóa</a>,
        onClick: () => handleDelete(record),
      },
    ];

    return dropdownItems;
  };

  const columns: any = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (image) => (
        <DefaultImage src={image} alt="image" className="rounded w-10 h-10" />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (price) => formatNumber(price),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Hoạt động",
      dataIndex: "activity",
      render: (value) => <Toggle checked={value} />,
    },
    {
      title: "Nổi bật",
      dataIndex: "featured",
      render: (value) => <Toggle checked={value} />,
    },
    {
      title: "Khuyến mãi",
      dataIndex: "promotion",
      render: (value) => <Toggle checked={value} />,
    },
    {
      title: "",
      dataIndex: "operation",
      width: 46,
      fixed: "right",
      render: (_, record) => (
        <ActionDropdown
          dropdownItems={generateDropDownItems(record)}
          trigger="click"
          containerClassName="w-[50px]"
          placement="bottom-end"
        />
      ),
    },
  ];
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className={HEADING_CLASS_NAME}>Sản phẩm</h1>
        <Button
          className={classNames(BTN_PRIMARY, "h-[33px]")}
          onClick={() => navigate(PRODUCT_LIST_URL.create.path)}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <div className="flex gap-[30px] justify-center mb-6">
        <div className="p-6 rounded-md bg-blue-100 flex gap-4 min-w-[300px]">
          <div className="flex flex-col gap-2.5">
            <p className={TITLE_CLASS_NAME}>Lượt tải lên còn lại</p>
            <p className="leading-[60px] text-2xl tex-gray-700">10</p>
          </div>
          <div className="w-[55px] h-[55px] rounded-full shadow-inner flex">
            <Icon.IconBox className="m-auto" />
          </div>
        </div>
        <div className="p-6 rounded-md bg-blue-100 flex gap-4 justify-between min-w-[300px]">
          <div className="flex flex-col gap-2.5 justify-between">
            <div className="leading-5">
              <p className="font-light">Gói hiện tại:</p>
              <p className="text-base">Shop Bạc</p>
            </div>
            <Button className={BTN_PRIMARY_LIGHT}>Nâng cấp gói</Button>
          </div>
          <div className="w-[55px] h-[55px] rounded-full shadow-inner flex">
            <Icon.IconBox className="m-auto" />
          </div>
        </div>
      </div>
      <HeaderViewList
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm tên sản phẩm, danh mục"
          />
        }
      >
        <TableTera
          columns={columns}
          data={[
            {
              id: 1,
              image: "https://picsum.photos/200",
              name: "Tên sản phẩm",
              category: "Danh mục",
              quantity: 100,
              price: 100000,
              featured: true,
              activity: false,
              promotion: true,
            },
            {
              id: 2,
              image: "https://picsum.photos/200",
              name: "Tên sản phẩm",
              category: "Danh mục",
              quantity: 100,
              price: 100000,
              featured: false,
              activity: true,
              promotion: false,
            },
          ]}
        />
      </HeaderViewList>
    </div>
  );
};

export default ProductListPage;
