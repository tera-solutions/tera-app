import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import { TabItemType, Tabs, Tag } from "tera-dls";
import ProductReviewFilter from "./containers/Filter";
import { COLOR_STATUS, SHIPPING_STATUS } from "./constants";

const OrderPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value) => (
        <Tag color={COLOR_STATUS[value]}>{SHIPPING_STATUS[value]}</Tag>
      ),
    },
    {
      title: "Giao hàng",
      dataIndex: "ship",
      render: (value) => (
        <Tag color={COLOR_STATUS[value]}>{SHIPPING_STATUS[value]}</Tag>
      ),
    },
    {
      title: "COD",
      dataIndex: "cod",
      render: (value) => (
        <Tag color={COLOR_STATUS[value]}>{SHIPPING_STATUS[value]}</Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
    },
  ];

  const items: TabItemType[] = [
    {
      key: "all",
      label: "Tất cả",
    },
    {
      key: "pending",
      label: "Chờ xác nhận",
    },
    {
      key: "approve",
      label: "Đã duyệt",
    },
    {
      key: "shipping",
      label: "Đang giao hàng",
    },
  ];

  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Phiếu mua hàng</h1>

      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm mã đơn"
          />
        }
        bottomContent={<Tabs items={items} className="mb-0" />}
      >
        <TableTera
          columns={columns}
          data={[
            {
              id: 1,
              code: "001",
              customer: "Khách hàng",
              status: "created",
              ship: "pending",
              cod: "pending",
              total: 100000,
              created_at: "01/01/2025",
            },
            {
              id: 2,
              code: "002",
              customer: "Khách hàng",
              status: "created",
              ship: "pending",
              cod: "pending",
              total: 100000,
              created_at: "01/01/2025",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <ProductReviewFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default OrderPage;
