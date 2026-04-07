import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import PaymentHistoryFilter from "./containers/Filter";

const PaymentHistoryPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

  const columns = [
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Chi tiết thanh toán",
      dataIndex: "detail",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "method",
    },
    {
      title: "Ngày",
      dataIndex: "created_at",
    },
  ];

  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Lịch sử thanh toán</h1>
      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm tên người dùng, mã ĐH, tên sản phẩm"
          />
        }
      >
        <TableTera
          columns={columns}
          data={[
            {
              id: 1,
              quantity: 1,
              detail: "content",
              method: "Ví",
              created_at: "01/01/2025",
            },
            {
              id: 2,
              quantity: 1,
              detail: "content",
              method: "Ví",
              created_at: "01/01/2025",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <PaymentHistoryFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default PaymentHistoryPage;
