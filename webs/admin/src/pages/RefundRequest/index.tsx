import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import { TabItemType, Tabs, Tag } from "tera-dls";
import RefundRequestFilter from "./containers/Filter";
import { COLOR_REFUND_STATUS, REFUND_STATUS } from "./constants";

const RefundRequestPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "code",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
    },
    {
      title: "Giá trị hoàn tiền",
      dataIndex: "value",
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value) => (
        <Tag color={COLOR_REFUND_STATUS[value]}>{REFUND_STATUS[value]}</Tag>
      ),
    },
  ];

  const items: TabItemType[] = [
    {
      key: "1",
      label: "Tất cả",
    },
    {
      key: "2",
      label: "Chờ duyệt",
    },
    {
      key: "3",
      label: "Đã duyệt",
    },
    {
      key: "4",
      label: "Từ chối",
    },
  ];

  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Yêu cầu hoàn tiền</h1>
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
              code: "HT_001",
              customer: "Khách hàng",
              value: 1000000,
              date: "01/01/2025",
              status: "pending",
            },
            {
              id: 2,
              code: "HT_002",
              customer: "Khách hàng",
              value: 1000000,
              date: "01/01/2025",
              status: "pending",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <RefundRequestFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default RefundRequestPage;
