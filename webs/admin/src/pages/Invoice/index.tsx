import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import React, { useState } from "react";
import InvoiceFilter from "./containers/Filter";
import { formatCurrency } from "tera-dls";

const InvoicePage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
    },
    {
      title: "Tổng giá trị",
      dataIndex: "total",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "method",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
    },
  ];

  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Hóa đơn</h1>
      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm mã hóa đơn"
          />
        }
      >
        <TableTera
          columns={columns}
          data={[
            {
              id: 1,
              code: "CODE_001",
              type: "Thanh toán",
              total: 1000000,
              method: "Chuyển khoản",
              created_at: "01/01/2025",
              status: "pending",
            },
            {
              id: 2,
              code: "CODE_001",
              type: "Thanh toán",
              total: 1000000,
              method: "Chuyển khoản",
              created_at: "01/01/2025",
              status: "pending",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <InvoiceFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default InvoicePage;
