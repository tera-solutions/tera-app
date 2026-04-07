import { useQuery } from "@tanstack/react-query";
import TableTera from "@tera/components/dof/TableTera";
import { useStores } from "hooks/useStores";
import { IPagination } from "_common/interface";
import { observer } from "mobx-react-lite";
import { Key, useEffect, useMemo, useState } from "react";
import {
  Description,
  Modal,
  PaginationProps,
  Row,
  Spin,
  TableRowSelection,
} from "tera-dls";
import { AnyObject } from "yup";
import ContactApi from "../ModalSelectContactOrder/_api";
import SelectContactModalHeader from "./HeaderSearch";

function ModalSelectContactOrder() {
  const {
    globalStore: { device, authenticated },
    modalSelectStore: { contact, updateData, closeModal },
  } = useStores();
  // const {
  //   openModalContact,
  //   handleSelectItemContact,
  //   typeModalContact,
  //   closeModalContact,
  //   selectContact,
  //   title,
  // } = useCrmClient();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [rowSelected, setRowSelected] = useState<any>(null);
  const [rowId, setRowId] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });

  const { data: listDataTable } = useQuery({
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
    // handleSelectItemContact(rowSelected);
  };

  const columns: any = [
    {
      title: "Mã liên hệ",
      dataIndex: "code",
      align: "center",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      render: (code) => <div className="line-clamp-2">{code}</div>,
    },
    {
      title: "Xưng hô",
      dataIndex: "prefix",
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Chức vụ",
      dataIndex: "job_title_text",
    },
    {
      title: "SĐT cá nhân",
      dataIndex: "personal_phone",
    },
    {
      title: "SĐT công ty",
      dataIndex: "company_phone",
    },
    {
      title: "Email cá nhân",
      dataIndex: "personal_email",
    },
    {
      title: "Email công ty",
      dataIndex: "company_email",
    },
    {
      title: "Email khác",
      dataIndex: "other_email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      render: (customer) => <div className="">{customer?.business_name}</div>,
    },
  ];

  useEffect(() => {
    if (contact?.data) {
      setRowId([contact?.data?.id]);
      setRowSelected(contact?.data);
    }
  }, []);
  return (
    <Modal
      title="Danh sách liên hệ"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[65%] md:w-[65%] lg:w-[90%]"
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
              placeholderProp={`Tìm kiếm theo mã, tên liên hệ`}
            />
          </div>
        </div>
        <Row>
          <Description
            className="grid-cols-1 flex pt-5"
            label="Đã chọn: "
            labelClassName="shrink-0"
          >
            <span className="line-clamp-1 break-word">{rowSelected?.name}</span>
          </Description>
        </Row>
        <TableTera
          columns={columns}
          data={memoDataTable}
          className="max-h-[500px] overflow-auto"
          rowSelection={rowSelection}
          onRow={(record: any) => ({
            onClick: () => {
              setRowSelected(record);
              setRowId([record?.id]);
            },
            className:
              rowId.includes(record?.id) && "tera-table-cell-row-focused",
          })}
          // loading={isLoading}
          pagination={{
            onChange: handleChangePage,
            total: listDataTable?.total || 0,
            current: listDataTable?.current_page,
            pageSize: listDataTable?.per_page,
            to: listDataTable?.to,
            from: listDataTable?.from,
          }}
        />
      </Spin>
    </Modal>
  );
}

export default observer(ModalSelectContactOrder);
