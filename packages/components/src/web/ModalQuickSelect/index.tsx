import { useQuery } from "@tanstack/react-query";
import TableTera from "@tera/components/dof/TableTera";
import { useHrmClient } from "@tera/components/dof/hrmProvider";
import { IPagination } from "_common/interface";
import { observer } from "mobx-react-lite";
import { Key, useMemo, useState } from "react";
import {
  Description,
  Modal,
  PaginationProps,
  Row,
  Spin,
  TableRowSelection,
} from "tera-dls";
import { AnyObject } from "yup";
import SelectContactModalHeader from "./HeaderSearch";
import PrintKeyApi from "./_api";

function ModalSelectPrintKey() {
  const {
    openModalSelectPrintKey,
    listPrintKeySelect,
    closeModalPrintKey,
    excludeIds,
    setListPrintKey,
  } = useHrmClient();
  const [filter, setFilter] = useState({
    keyword: "",
    category_type_id: null,
  });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [rowIds, setRowIds] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });

  const { data: listDataTable, isLoading } = useQuery({
    queryKey: [
      "get-list-select-activity-call-modal",
      pagination,
      filter,
      excludeIds,
    ],

    queryFn: () => {
      return PrintKeyApi.getList({
        ...pagination,
        keyword_ids: excludeIds,
        ...filter,
      });
    },

    staleTime: 300000,
    gcTime: 300000,
  });

  const memoDataTable = useMemo(() => {
    return listDataTable?.data ? listDataTable?.data : [];
  }, [listDataTable]);

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    const isDiffPageSize =
      listDataTable?.limit && pageSize !== Number(listDataTable?.limit);
    setPagination({
      page: isDiffPageSize ? 1 : page,
      limit: pageSize,
    });
  };

  const handleFilter = (values) => {
    setFilter(values);
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const rowSelection: TableRowSelection<AnyObject> = {
    selectedRowKeys: rowIds,
    onChange: (selectedRowKeys, records) => {
      setSelectedRows(records);
      setRowIds(selectedRowKeys);
    },
  };

  const handleOk = () => {
    const hasIdPrintKey = (id) => rowIds.includes(id);
    const arrPrintKey = listPrintKeySelect.filter((item) =>
      hasIdPrintKey(item.id),
    );
    let newArrPrintKey = [];

    const printKeyIds = arrPrintKey.map((item) => item.id);

    const filterSelectedRows = selectedRows
      .filter((row) => !printKeyIds.includes(row.id))
      .map((item) => ({
        ...item,
        isNew: true,
        word: true,
        excel: true,
      }));
    let mergeSelectedRows = [...filterSelectedRows];

    if (arrPrintKey) {
      newArrPrintKey = arrPrintKey.map((item) => {
        delete item.isDelete;
        return {
          ...item,
          isUpdate: true,
          word: true,
          excel: true,
        };
      });
      mergeSelectedRows = mergeSelectedRows.concat(newArrPrintKey);
    }

    const filterPrintKeyInSelectedRows = listPrintKeySelect.filter(
      (item) => !hasIdPrintKey(item.id),
    );
    mergeSelectedRows = [...mergeSelectedRows, ...filterPrintKeyInSelectedRows];
    setListPrintKey(mergeSelectedRows);
    closeModalPrintKey();
  };

  const columns: any = [
    {
      title: "Mã từ khoá",
      dataIndex: "code",
      width: 200,
    },
    {
      title: "Tên từ khoá",
      dataIndex: "title",
      width: 200,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Danh mục",
      dataIndex: "type",
      width: 150,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
  ];

  return (
    <Modal
      title="CHỌN TỪ KHÓA"
      okText="Lưu"
      cancelText="Huỷ"
      className="sm:w-[65%] md:w-[65%] lg:w-[65%] z-100"
      onOk={() => handleOk()}
      onCancel={() => closeModalPrintKey()}
      open={openModalSelectPrintKey}
    >
      <Spin spinning={false}>
        <div className="flex items-center justify-between pb-4">
          <SelectContactModalHeader onFilter={handleFilter} />
        </div>
        <Row>
          <Description className="flex grid-cols-1" label="Đã chọn: ">
            {rowIds?.length}
          </Description>
        </Row>
        <TableTera
          columns={columns}
          data={memoDataTable}
          className="max-h-[500px] overflow-auto"
          rowSelection={rowSelection}
          onRow={(record: any) => ({
            onClick: () => {
              if (!rowIds.includes(record?.id)) {
                setSelectedRows((pre) => [...(pre ?? []), record]);
                setRowIds((pre) => [...pre, record?.id]);
                return;
              }
              const filterData = selectedRows.filter(
                (item) => item?.id !== record?.id,
              );
              const filterId = filterData.map((item) => item?.id);
              setSelectedRows(filterData);
              setRowIds(filterId);
            },
            className:
              rowIds.includes(record?.id) && "tera-table-cell-row-focused",
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

export default observer(ModalSelectPrintKey);
