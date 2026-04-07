import HeaderViewList from "@tera/components/web/HeaderViewList";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import PackageOrderFilter from "./containers/Filter";
import SearchTable from "@tera/components/web/SearchTable";
import { formatCurrency } from "tera-dls";

const AdvertisingPackageOrderPage = () => {
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
      title: "Hình thức thanh toán",
      dataIndex: "transaction",
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
              price: 10000,
              transaction: "Chuyển khoản",
            },
            {
              id: 2,
              name: "Gói nâng cao",
              price: 10000000,
              transaction: "Chuyển khoản",
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

export default AdvertisingPackageOrderPage;
