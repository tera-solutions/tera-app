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
  mergeArrayObjectByKey,
} from "tera-dls";
import SelectContactModalHeader from "./HeaderSearch";
import CustomerApi from "./_api";

export interface ICustomerContentRef {
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

const CustomerContent = (props: IProps, ref) => {
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

  //get-customer-management-list
  const { data: listDataTable, isLoading } = useQuery({
    queryKey: [
      "get-customer-management-list",
      pagination,
      searchKeyword,
      exceptedIds,
    ],

    queryFn: () => {
      return CustomerApi.getList({
        ...pagination,
        keyword: searchKeyword,
        type: "customer",
        ...(displayMode === "delete" && { except_id: exceptedIds.join(",") }),
      });
    },

    staleTime: 300000,
    gcTime: 300000,
  });

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

  const memoDataTable = useMemo(() => {
    return listDataTable?.data ? listDataTable?.data : [];
  }, [listDataTable]);

  const columns: any = [
    {
      title: "Mã KH",
      dataIndex: "code",
      width: 100,
      render: (name) => <div className="line-clamp-2">{name}</div>,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      width: 200,
      render: (name) => <div className="line-clamp-2">{name}</div>,
    },
    {
      title: "Loại khách hàng",
      dataIndex: "customer_type_text",
      width: 100,
      render: (text) => <div className="line-clamp-2">{text?.title}</div>,
    },
    {
      title: "Mã số thuế",
      dataIndex: "tax",
      width: 100,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (val) => <div className="line-clamp-1">{val}</div>,
      width: 100,
    },
    {
      title: "Lĩnh vực",
      dataIndex: "sectors_text",
      render: (name) => <div className="line-clamp-2">{name?.title}</div>,
      width: 100,
    },
    {
      title: "Địa chỉ hoá đơn",
      dataIndex: "address",
      render: (name) => <div className="line-clamp-2">{name}</div>,
      width: 200,
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "staff",
      width: 200,
      render: (staff) => {
        if (staff?.id && staff?.full_name) {
          return (
            <p>
              <span className="text-green-500">[{staff?.code}]</span>{" "}
              {staff?.full_name}
            </p>
          );
        }
      },
    },
  ];

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

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <div className="flex gap-2.5">
          <SelectContactModalHeader
            onSearch={handleSearch}
            placeholderProp={`Tìm kiếm theo mã, tên ${title}`}
          />
          {rowId?.length > 0 && (
            <span className="bg-green-300 rounded-full px-5 py-1.5 grid items-center text-white shrink-0">
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

export default forwardRef<ICustomerContentRef, IProps>(CustomerContent);
