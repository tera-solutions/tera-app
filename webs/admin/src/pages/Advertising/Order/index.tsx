import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import PackageOrderFilter from "./containers/Filter";
import { formatCurrency } from "tera-dls";

const PackageOrderPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const columns = [
    {
      title: "Gói cửa hàng",
      dataIndex: "name",
    },
    {
      title: "Giá trọn gói",
      dataIndex: "price",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Ngày mua",
      dataIndex: "date",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "exp",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "transaction",
    },
    {
      title: "Thời gian còn lại",
      dataIndex: "remain",
    },
  ];
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Danh sách gói mua hàng</h1>

      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm gói"
          />
        }
      >
        <TableTera
          columns={columns}
          data={[
            {
              id: 1,
              name: "Gói cơ bản",
              price: 100000,
              date: "01/01/2025",
              exp: "01/01/2025",
              transaction: "Chuyển khoản",
              remain: "5 ngày",
            },
            {
              id: 2,
              name: "Gói nâng cao",
              price: 10000000,
              date: "01/01/2025",
              exp: "01/01/2025",
              transaction: "Ví",
              remain: "10 ngày",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <PackageOrderFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default PackageOrderPage;
