import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import CommissionHistoryFilter from "./containers/Filter";
import { formatCurrency } from "tera-dls";

const CommissionHistoryPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "code",
    },
    {
      title: "Hoa hồng",
      dataIndex: "commission",
    },
    {
      title: "Giá trị hoa hồng",
      dataIndex: "value",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
    },
  ];

  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Lịch sử hoa hồng</h1>
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
              code: "HT_001",
              commission: "1%",
              value: 10000000,
              created_at: "01/01/2025",
            },
            {
              id: 2,
              code: "HT_002",
              commission: "2%",
              value: 20000000,
              created_at: "02/01/2025",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <CommissionHistoryFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default CommissionHistoryPage;
