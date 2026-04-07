import { useQuery } from "@tanstack/react-query";
import { IPagination } from "_common/interface";
import { observer } from "mobx-react-lite";

import { useStores } from "hooks/useStores";
import { Key, useEffect, useMemo, useState } from "react";
import {
  Modal,
  PaginationProps,
  Spin,
  Table,
  TableRowSelection,
} from "tera-dls";
import { AnyObject } from "yup";
import PaginationCustom from "../PaginationCustom";
import SelectContactModalHeader from "./HeaderSearch";
import ContactApi from "./_api";
import { tw } from "tailwind-merge.config";

function ModalSelectContactOrder() {
  const {
    globalStore: { device, authenticated },
    modalSelectStore: { contact, closeModal, updateData },
  } = useStores();
  // const {
  //   openModalSelectContact,
  //   handleSelectItemContact,
  //   typeModalContact,
  //   closeModalContactOrder,
  //   selectContact,
  // } = useCrmClient();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [rowSelected, setRowSelected] = useState<any>(null);
  const [rowId, setRowId] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });

  const { data: listDataTable, isLoading } = useQuery({
    queryKey: ["get-list-select-modal", pagination, searchKeyword],

    queryFn: () => {
      return ContactApi.getList({
        ...pagination,
        keyword: searchKeyword,
        type: contact?.type,
      });
    },

    enabled: device ? !!authenticated : true,
    staleTime: 300000,
    gcTime: 300000,
  });

  const memoDataTable = useMemo(() => {
    return listDataTable?.data ? listDataTable?.data : [];
  }, [listDataTable]);

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setPagination({ limit: pageSize, page: page });
  };

  const handleSearch = (value) => {
    setSearchKeyword(value?.keyword);
    setPagination({ ...pagination, page: 1 });
  };

  const rowSelection: TableRowSelection<AnyObject> = {
    type: "radio",
    selectedRowKeys: rowId,
    onChange: (selectedRowKeys, record) => {
      setRowSelected(record);
      setRowId(selectedRowKeys);
    },
  };

  const handleOk = () => {
    updateData("contact", "data", rowSelected);
    closeModal("contact");
  };

  const columns: any = [
    {
      title: "STT",
      dataIndex: "record_number",
      width: "5%",
      align: "center",
    },
    {
      title: "ID liên hệ",
      dataIndex: "id",
      render: (code) => <div className="line-clamp-2">{code}</div>,
    },
    {
      title: "Tên liên hệ",
      dataIndex: "name",
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "personal_phone",
    },
  ];

  useEffect(() => {
    if (contact?.data) {
      setRowId([contact?.data?.id]);
    }
    // if (selectContact) {
    //   setRowId([selectContact?.id]);
    // }
  }, []);

  return (
    <Modal
      title={
        contact?.type === "customer"
          ? "DANH SÁCH KHÁCH HÀNG"
          : "DANH SÁCH NHÀ CUNG CẤP"
      }
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className={tw("sm:!w-[95%] xmd:w-[90%]")}
      onOk={() => handleOk()}
      onCancel={() => closeModal("contact")}
      open={contact?.open}
      centered={true}
    >
      <Spin spinning={false}>
        <div className="flex justify-between items-center pb-4">
          <div>
            <SelectContactModalHeader
              onSearch={handleSearch}
              placeholderProp={
                contact?.type === "customer"
                  ? "Tìm kiếm theo tên liên hệ"
                  : "Tìm kiếm theo tên nhà cung cấp"
              }
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={memoDataTable}
          className="max-h-[500px] overflow-auto"
          rowSelection={rowSelection}
          onRow={(record) => ({
            onClick: () => {
              setRowSelected(record);
              setRowId([record?.id]);
            },
            className:
              rowId.includes(record?.id) && "tera-table-cell-row-focused",
          })}
          loading={isLoading}
        />

        {listDataTable?.total > 0 && (
          <PaginationCustom
            onChange={handleChangePage}
            total={listDataTable?.total || 0}
            current={listDataTable?.current_page}
            pageSize={listDataTable?.per_page}
            to={listDataTable?.to}
            from={listDataTable?.from}
          />
        )}
      </Spin>
    </Modal>
  );
}

export default observer(ModalSelectContactOrder);
