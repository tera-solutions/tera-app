import { useQuery } from "@tanstack/react-query";
import TableTera from "@tera/components/dof/TableTera";
import { IPagination } from "_common/interface";
import { observer } from "mobx-react-lite";

import { useStores } from "hooks/useStores";
import { StatusTaskActivity } from "@tera/components/shared/Activity/constants";
import TaskApi from "@tera/components/shared/Activity/containers/Task/_api";
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

function ModalSelectActivityTask() {
  const {
    globalStore: { device, authenticated },
    modalSelectStore: { task, closeModal, updateData },
  } = useStores();
  // const {
  //   openModalActivityTask,
  //   handleSelectActivityTask,
  //   closeModalActivityTask,
  //   selectActivityTask,
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
      "get-list-select-activity-task-modal",
      pagination,
      searchKeyword,
    ],

    queryFn: () => {
      return TaskApi.getList({
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
      activity_type: "task",
      staff_by: item?.staff_by,
      idTask: item?.id || item?.idTask,
      title: item?.title,
      status: item?.status,
      status_text: item?.status_text,
    }));
    updateData("task", "data", convertData);
    closeModal("task");
  };

  const columns: any = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 200,
    },
    {
      title: "Đối tượng",
      dataIndex: "object",
      width: 200,
      render: (object) => (
        <a
          className="line-clamp-2"
          onClick={() => {
            // navigate(`${PRICE_QUOTATION_URL.detail.path}/${record?.id}`);
            // quickView({
            //   detail_id: record?.id,
            //   detail_type: record?.type,
            //   onView: () => redirectDetails(record?.type, record?.id),
            // });
          }}
        >
          {object?.name}
        </a>
      ),
    },
    {
      title: "Liên quan đến",
      dataIndex: "relation_to",
      width: 150,
      render: (item) => {
        if (item?.code) {
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
      title: "Loại nhiệm vụ",
      dataIndex: "task_type",
      width: 150,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Mức độ ưu tiên",
      dataIndex: "priority_level",
      width: 150,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "time_start",
      width: 150,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "time_end",
      width: 150,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: 150,
      render: (status) => (
        <Tag color={StatusTaskActivity[status]?.color}>
          {StatusTaskActivity[status]?.text}
        </Tag>
      ),
    },
    {
      title: "Người thực hiện",
      dataIndex: "staff_by",
      width: 200,
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
  ];

  useEffect(() => {
    if (task.data?.length > 0) {
      const listId = task.data.map((item) => item?.idTask);
      setRowId(listId);
      setRowSelected(task.data);
    }
  }, []);

  return (
    <Modal
      title="DANH SÁCH NHIỆM VỤ"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[65%] md:w-[65%] lg:w-[90%] z-100"
      onOk={() => handleOk()}
      onCancel={() => closeModal("task")}
      open={task?.open}
      centered={true}
    >
      <Spin spinning={false}>
        <div className="flex justify-between items-center pb-4">
          <div>
            <SelectContactModalHeader
              onSearch={handleSearch}
              placeholderProp="Tìm kiếm theo tiêu đề, đối tượng"
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
                  item?.idTask !== record?.id && item?.id !== record?.id,
              );

              const filterId = filterData.map(
                (item) => item?.idTask || item?.id,
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

export default observer(ModalSelectActivityTask);
