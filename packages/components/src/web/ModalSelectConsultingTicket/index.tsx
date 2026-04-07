import { useQuery } from "@tanstack/react-query";
import TableTera from "@tera/components/dof/TableTera";
import { IPagination } from "_common/interface";
import { observer } from "mobx-react-lite";

import { useStores } from "hooks/useStores";
import { StatusTaskActivity } from "@tera/components/shared/Activity/constants";
import ConsultingTicketApi from "@tera/components/shared/ConsultingTicket/_api/consulting_ticket";
import { Key, useEffect, useMemo, useState } from "react";
import {
  Description,
  Modal,
  PaginationProps,
  Row,
  Spin,
  TableRowSelection,
  Tag,
  mergeArrayObjectByKey,
} from "tera-dls";
import { AnyObject } from "yup";
import SelectContactModalHeader from "./HeaderSearch";

function ModalSelectConsultingTicket() {
  const {
    globalStore: { device, authenticated },
    modalSelectStore: { consulting_ticket, closeModal, updateData },
  } = useStores();
  // const {
  //   openModalConsultingTicket,
  //   handleSelectConsultingTicket,
  //   closeModalConsultingTicket,
  //   selectConsultingTicket,
  //   // title,
  // } = useCrmClient();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [rowSelected, setRowSelected] = useState<any>(null);
  const [rowId, setRowId] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });

  const { data: listDataTable, isLoading } = useQuery({
    queryKey: [
      "get-list-select-consulting-ticket-modal",
      pagination,
      searchKeyword,
    ],

    queryFn: () => {
      return ConsultingTicketApi.getList({
        ...pagination,
        keyword: searchKeyword,
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
    selectedRowKeys: rowId,
    onChange: (selectedRowKeys, records) => {
      setRowId(selectedRowKeys);
      setRowSelected((prev) => {
        const existedRecord = (prev ?? []).filter((item) =>
          selectedRowKeys.includes(item?.id),
        );
        const usedRecord = records.filter((item) => !!item);
        return mergeArrayObjectByKey(
          existedRecord ?? [],
          usedRecord ?? [],
          "id",
        );
      });
    },
  };

  const handleOk = () => {
    const convertData = rowSelected?.map((item) => ({
      activity_type: "consulting_ticket",
      staff_by: item?.staff_by,
      idConsultingTicket: item?.id || item?.idConsultingTicket,
      title: item?.name,
      status: item?.status,
      status_text: item?.status_text,
    }));
    updateData("consulting_ticket", "data", convertData);
    closeModal("consulting_ticket");
  };

  const columns = [
    {
      title: "Mã tư vấn",
      dataIndex: "code",
      width: "10%",
    },
    {
      title: "Tên thẻ tư vấn",
      dataIndex: "name",
      width: "10%",
      render: (text) => <p className="line-clamp-2">{text}</p>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      width: "10%",
      render: (customer) => <p className="line-clamp-2">{customer?.name}</p>,
    },
    {
      title: "Liên hệ",
      dataIndex: "contact",
      width: "10%",
      render: (contact) => <p className="line-clamp-2">{contact?.name}</p>,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone_number",
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "10%",
    },
    {
      title: "Người thực hiện",
      dataIndex: "staff_by",
      width: "10%",
      render: (item) => {
        if (item) {
          return (
            <p className="line-clamp-2">
              <span className="text-green-500">[{item?.code}] </span>
              {item?.full_name}
            </p>
          );
        }
      },
    },
    {
      title: "Mức độ ưu tiên",
      dataIndex: "priority_level",
      width: "10%",
    },
    {
      title: "Thời gian hoàn thành",
      dataIndex: "time_end",
      width: "10%",
    },
    {
      title: "Trạng thái tư vấn",
      dataIndex: "status",
      width: "10%",
      render: (status) => {
        return (
          <Tag color={StatusTaskActivity[status]?.color}>
            {StatusTaskActivity[status]?.text}
          </Tag>
        );
      },
    },
  ];

  useEffect(() => {
    if (consulting_ticket?.data?.length > 0) {
      const listId = consulting_ticket?.data.map(
        (item) => item?.idConsultingTicket,
      );
      setRowId(listId);
      setRowSelected(consulting_ticket?.data);
    }
  }, []);

  return (
    <Modal
      title="DANH SÁCH THẺ TƯ VẤN"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[65%] md:w-[65%] lg:w-[90%] z-100"
      onOk={() => handleOk()}
      onCancel={() => closeModal("consulting_ticket")}
      open={consulting_ticket?.open}
      centered={true}
    >
      <Spin spinning={false}>
        <div className="flex justify-between items-center pb-4">
          <div>
            <SelectContactModalHeader
              onSearch={handleSearch}
              placeholderProp="Tìm kiếm theo mã, tên thẻ tư vấn"
            />
          </div>
        </div>
        <Row>
          <Description className="grid-cols-1 flex" label="Đã chọn: ">
            {rowId?.length}
          </Description>
        </Row>
        <TableTera
          columns={columns}
          data={memoDataTable}
          className="max-h-[500px] overflow-auto"
          rowSelection={rowSelection}
          onRow={(record: any) => ({
            onClick: () => {
              if (!rowId.includes(record?.id)) {
                setRowSelected((pre) => [...(pre ?? []), record]);
                setRowId((pre) => [...pre, record?.id]);
                return;
              }
              const filterData = rowSelected.filter(
                (item) =>
                  item?.id !== record?.id &&
                  item?.idConsultingTicket !== record?.id,
              );
              const filterId = filterData.map(
                (item) => item?.idConsultingTicket || item?.id,
              );
              setRowSelected(filterData);
              setRowId(filterId);
            },
            className:
              rowId.includes(record?.id) && "tera-table-cell-row-focused",
          })}
          loading={isLoading}
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

export default observer(ModalSelectConsultingTicket);
