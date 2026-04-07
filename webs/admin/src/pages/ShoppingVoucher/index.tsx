import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { BTN_PRIMARY, HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import React, { useState } from "react";
import ShoppingVoucherFilter from "./containers/Filter";
import {
  Button,
  DropdownItem,
  formatCurrency,
  formatDate,
  formatNumber,
  TabItemType,
  Tabs,
  Tag,
} from "tera-dls";
import classNames from "classnames";
import { COLOR_SHOPPING_STATUS, SHOPPING_STATUS } from "./constants";
import useConfirm from "@tera/states/hooks/useConfirm";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";
import ShoppingVoucherForm from "./containers/Form";

const ShoppingVoucherPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState({ open: false, id: null });
  const confirm = useConfirm();

  const handleDelete = (record: any): void => {
    confirm.warning({
      title: "Xác nhận xóa mã ưu đãi",
      content: (
        <p className="break-word">
          <p>Bạn có chắc muốn xóa mã ưu đãi</p>
          <p>
            <span className="font-bold break-word">{record?.code} </span>
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
        onClick: () => setOpenForm({ open: true, id: record?.id }),
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
      title: "Mã ưu đãi",
      dataIndex: "code",
    },
    {
      title: "Loại đơn áp dụng",
      dataIndex: "type",
    },
    {
      title: "Giảm giá theo tiền",
      dataIndex: "discount_value",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Giảm giá theo %",
      dataIndex: "discount_percent",
    },
    {
      title: "Đã sử dụng",
      dataIndex: "used",
      render: (value) => formatNumber(value),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      render: (value) => formatDate(value),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      render: (value) => formatDate(value),
    },
    {
      title: "Trạng thái sử dụng",
      dataIndex: "status",
      render: (value) => (
        <Tag color={COLOR_SHOPPING_STATUS[value]}>{SHOPPING_STATUS[value]}</Tag>
      ),
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

  const items: TabItemType[] = [
    {
      key: "1",
      label: "Tất cả",
    },
    {
      key: "2",
      label: "Đạng hoạt động",
    },
    {
      key: "3",
      label: "Ngưng hoạt động",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className={classNames(HEADING_CLASS_NAME, "!mb-0")}>
          Phiếu mua hàng
        </h1>
        <Button
          className={BTN_PRIMARY}
          onClick={() => setOpenForm({ open: true, id: null })}
        >
          Thêm phiếu mua hàng
        </Button>
      </div>
      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm mã ưu đãi"
          />
        }
        bottomContent={<Tabs items={items} className="mb-0" />}
      >
        <TableTera
          columns={columns}
          data={[
            {
              id: 1,
              code: "MGG_001",
              type: "Sản phẩm",
              discount_value: 100000,
              discount_percent: 10,
              used: 10,
              start_date: "01/01/2025",
              end_date: "10/01/2025",
              status: "active",
            },
            {
              id: 2,
              code: "MGG_001",
              type: "Sản phẩm",
              discount_value: 100000,
              discount_percent: 10,
              used: 10,
              start_date: "01/01/2025",
              end_date: "10/01/2025",
              status: "inactive",
            },
          ]}
        />
      </HeaderViewList>

      {isOpenFilter && (
        <ShoppingVoucherFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          // onFilter={handleFilter}
          // initialValue={queryParams}
        />
      )}
      {openForm.open && (
        <ShoppingVoucherForm
          open={openForm.open}
          id={openForm.id}
          onClose={() => setOpenForm({ open: false, id: null })}
        />
      )}
    </div>
  );
};

export default ShoppingVoucherPage;
