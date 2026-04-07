import { useQuery } from "@tanstack/react-query";
import { MemberDisplayMode } from "@tera/components/dof/CrmProvider";
import TableTera from "@tera/components/dof/TableTera";
import { IPagination } from "_common/interface";
import {
  Key,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  AnyObject,
  PaginationProps,
  TableRowSelection,
  Tag,
  mergeArrayObjectByKey,
} from "tera-dls";
import SelectContactModalHeader from "./HeaderSearch";
import {
  LEAD_STATUS_COLOR,
  LEAD_TYPE,
} from "@tera/components/shared/Opportunity/LeadManagement/constants";
import LeadManagementApi from "@tera/components/shared/Opportunity/LeadManagement/_api";

export interface ISupplierLeadContentRef {
  onSubmit?: () => void;
}

interface IProps {
  title: string;
  value?: any;
  rowSelectionProps?: TableRowSelection<AnyObject>;
  mode?: "single" | "multiple";
  header?: ReactNode;
  displayMode?: MemberDisplayMode;
  exceptedIds?: any;
}

const SupplierLeadContent = (props: IProps, ref) => {
  const {
    title,
    value,
    rowSelectionProps = {},
    mode = "single",
    displayMode = "default",
    header,
    exceptedIds = [],
  } = props;
  const [searchKeyword, setSearchKeyword] = useState("");
  const [rowSelected, setRowSelected] = useState<any>(null);
  const [rowId, setRowId] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });

  const { data: listDataTable, isLoading } = useQuery({
    queryKey: ["get-supplier-list", pagination, searchKeyword, exceptedIds],

    queryFn: () => {
      return LeadManagementApi.getList({
        params: {
          ...pagination,
          keyword: searchKeyword,
          lead_type: "supplier",
          ...(displayMode === "delete" && { except_id: exceptedIds.join(",") }),
        },
      });
    },

    staleTime: 300000,
    gcTime: 300000,
  });

  const memoDataTable = useMemo(() => {
    return listDataTable?.data ? listDataTable?.data : [];
  }, [listDataTable]);

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setPagination({
      limit: pageSize,
      page: Number(pageSize) === Number(pagination.limit) ? page : 1,
    });
  };

  const handleSearch = (value) => {
    setSearchKeyword(value?.keyword);
    setPagination({ ...pagination, page: 1 });
  };

  const rowSelection: TableRowSelection<AnyObject> = {
    type: "radio",
    ...rowSelectionProps,
    selectedRowKeys: rowId,
    onChange: (selectedRowKeys, records) => {
      if (mode == "single") {
        setRowSelected(
          mode === "single" ? records[0] : records.filter((i) => !!i),
        );
      } else {
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
      }
      setRowId(selectedRowKeys);
    },
  };

  useEffect(() => {
    if (displayMode === "delete") return;
    if (value) {
      if (mode === "multiple") {
        const listId = value.map((item) => item?.id);
        setRowId(listId);
      } else {
        setRowId([value?.id]);
      }

      setRowSelected(value);
    }
  }, [value, mode]);

  useImperativeHandle(ref, () => {
    return {
      onSubmit: () => rowSelected,
    };
  }, [ref, rowSelected]);

  const columns: any = [
    {
      title: "Mã tiềm năng",
      dataIndex: "code",
      width: 150,
      render: (data) => <p className="line-clamp-1">{data}</p>,
    },
    {
      title: "Tên tiềm năng",
      dataIndex: "business_name",
      width: 200,
      render: (data) => <p className="line-clamp-2">{data}</p>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 100,
      render: (data) => <p className="line-clamp-2">{data}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
      render: (data) => <p className="line-clamp-2">{data}</p>,
    },
    {
      title: "Loại tiềm năng",
      dataIndex: "lead_type",
      width: 100,
      render: (data) => LEAD_TYPE?.[data],
    },
    {
      title: "Nguồn tiềm năng",
      dataIndex: "source_text",
      width: 200,
      render: (val) => val?.title ?? "",
    },
    {
      title: "Người phụ trách",
      dataIndex: "implementer",
      width: 200,
      render: (data) =>
        data?.full_name ? (
          <>
            <span className="text-green-500">[{data?.code}]</span>
            {" - " + data?.full_name}
          </>
        ) : (
          <div />
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status_text",
      width: 200,
      render: (data, record) =>
        data && (
          <Tag
            color={LEAD_STATUS_COLOR[record?.status]}
            className="line-clamp-1 break-word w-full max-w-max"
          >
            {data}
          </Tag>
        ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <div className="flex gap-2.5">
          <SelectContactModalHeader
            onSearch={handleSearch}
            placeholderProp={`Tìm kiếm theo mã, tên ${title}`}
          />
          {rowId?.length > 0 && (
            <span className="bg-green-300 rounded-full px-5 py-1.5 grid items-center text-white">
              Đã chọn ({rowId?.length ?? 0})
            </span>
          )}
        </div>
        {header}
      </div>
      <TableTera
        rowKey="id"
        columns={columns}
        data={memoDataTable}
        scroll={{ y: 500, x: 1400 }}
        rowSelection={rowSelection}
        onRow={(record: any) => ({
          onClick: () => {
            if (mode === "single") {
              setRowSelected(record);
              setRowId([record?.id]);
              return;
            }
            if (mode === "multiple") {
              if (!rowId.includes(record?.id)) {
                setRowSelected((pre) => [...(pre ?? []), record]);
                setRowId((pre) => [...pre, record?.id]);
                return;
              }
              const filterData = rowSelected.filter(
                (item) => item?.id !== record?.id,
              );
              const filterId = filterData.map((item) => item?.id);
              setRowSelected(filterData);
              setRowId(filterId);
            }
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
    </>
  );
};

export default forwardRef<ISupplierLeadContentRef, IProps>(SupplierLeadContent);
