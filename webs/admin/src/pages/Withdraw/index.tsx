import HeaderViewList from "@tera/components/web/HeaderViewList";
import Icon from "@tera/components/web/Icon";
import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import { useState } from "react";
import { Col, Row, TabItemType, Tabs, Tag } from "tera-dls";
import { COLOR_STATUS, WITHDRAW_STATUS } from "./constants";
import WithdrawFilter from "./containers/Filter";

const WithdrawPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Loại hình",
      dataIndex: "type",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value) => (
        <Tag color={COLOR_STATUS[value]}>{WITHDRAW_STATUS[value]}</Tag>
      ),
    },
    {
      title: "Withdraw Type",
      dataIndex: "withdraw_type",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "Thông điệp",
      dataIndex: "message",
    },
  ];

  const items: TabItemType[] = [
    {
      key: "1",
      label: "Lịch sử yêu cầu rút",
    },
    {
      key: "2",
      label: "Đơn hàng bị đóng băng",
    },
    {
      key: "3",
      label: "Lịch sử nạp tiền vào ví",
    },
    {
      key: "4",
      label: "Lịch sử thanh toán",
    },
  ];
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Rút tiền</h1>
      <Row className="grid-cols-4 gap-8 mb-8">
        <Col className="flex gap-2.5 justify-between p-6 rounded-xl bg-blue-100">
          <div>
            <p className="text-xl">Số dư đang chờ xử lý</p>
            <p className="leading-[60px] text-[24px] text-gray-700">10</p>
          </div>
          <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
            <Icon.IconWithdraw7 className="m-auto" />
          </div>
        </Col>
        <Col className="flex gap-2.5 justify-between p-6 rounded-xl bg-green-100">
          <div>
            <p className="text-xl">Lợi nhuận hôm nay</p>
            <p className="leading-[60px] text-[24px] text-gray-700">10</p>
          </div>
          <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
            <Icon.IconWithdraw6 className="m-auto" />
          </div>
        </Col>
        <Col className="flex gap-2.5 justify-between p-6 rounded-xl bg-indigo-100">
          <div>
            <p className="text-xl">Ví tiền </p>
            <p className="leading-[60px] text-[24px] text-gray-700">10</p>
          </div>
          <div className="w-[55px] h-[55px] rounded-full shadow-inner	flex">
            <Icon.IconWithdraw5 className="m-auto" />
          </div>
        </Col>
        <Col className="flex flex-col gap-2.5 justify-between p-6 rounded-xl bg-yellow-100">
          <div className="ml-auto w-[55px] h-[55px] rounded-full shadow-inner	flex">
            <Icon.IconWithdraw4 className="m-auto" />
          </div>
          <p className="text-xl">Gửi yêu cầu rút tiền</p>
        </Col>
        <Col className="flex flex-col gap-2.5 justify-between p-6 rounded-xl bg-gray-100">
          <div className="ml-auto w-[55px] h-[55px] rounded-full shadow-inner	flex">
            <Icon.IconWithdraw3 className="m-auto" />
          </div>
          <p className="text-xl">Ví nạp tiền ngoại tuyến</p>
        </Col>
        <Col className="flex flex-col gap-2.5 justify-between p-6 rounded-xl bg-pink-100">
          <div className="ml-auto w-[55px] h-[55px] rounded-full shadow-inner	flex">
            <Icon.IconWithdraw8 className="w-8 h-8 text-blue-500 m-auto" />
          </div>
          <p className="text-xl">Nạp tiền đảm bảo</p>
        </Col>
        <Col className="flex flex-col gap-2.5 justify-between p-6 rounded-xl bg-blue-100">
          <div className="ml-auto w-[55px] h-[55px] rounded-full shadow-inner	flex">
            <Icon.IconWithdraw1 className="m-auto" />
          </div>
          <p className="text-xl">Nạp tiền trực tuyến</p>
        </Col>
        <Col className="flex flex-col gap-2.5 justify-between p-6 rounded-xl bg-red-100">
          <div className="ml-auto w-[55px] h-[55px] rounded-full shadow-inner	flex">
            <Icon.IconWithdraw2 className="m-auto" />
          </div>
          <p className="text-xl">Rút tiền trực tuyến</p>
        </Col>
      </Row>

      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        bottomContent={<Tabs items={items} className="mb-0" />}
      >
        <TableTera
          columns={columns}
          data={[
            {
              id: 1,
              date: "01/01/2025",
              withdraw_type: "content",
              quantity: "123",
              type: "content",
              status: "pending",
              remarks: "content",
              message: "thông điệp",
            },
            {
              id: 2,
              date: "01/01/2025",
              withdraw_type: "content",
              quantity: "123",
              type: "content",
              status: "complete",
              remarks: "content",
              message: "thông điệp",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <WithdrawFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
    </div>
  );
};

export default WithdrawPage;
