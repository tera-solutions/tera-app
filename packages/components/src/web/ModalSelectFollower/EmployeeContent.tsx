import { useQuery } from "@tanstack/react-query";
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
  Description,
  PaginationProps,
  Row,
  Table,
  TableRowSelection,
  Tag,
  mergeArrayObjectByKey,
} from "tera-dls";
import PaginationCustom from "../PaginationCustom";
import SelectContactModalHeader from "./HeaderSearch";
import EmployeeApi from "@tera/components/shared/Employee/_api";
import { StatusEmployeeDOF } from "@tera/components/shared/Employee/constants/statusType";

export interface IEmployeeContentRef {
  onSubmit?: () => Array<any>;
}

interface IProps {
  title: string;
  value?: any;
  rowSelectionProps?: TableRowSelection<AnyObject>;
  mode?: "default" | "disable" | "delete";
  header?: ReactNode;
  onChange?: (val: any) => void;
}

const EmployeeContent = (props: IProps, ref) => {
  const {
    title,
    value,
    rowSelectionProps = {},
    mode = "default",
    onChange,
  } = props;
  const [searchKeyword, setSearchKeyword] = useState("");
  const [rowSelected, setRowSelected] = useState<any>(null);
  const [rowId, setRowId] = useState<Key[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });

  const selectEmployeeIds = value?.map((item) => item.id) ?? [];

  useEffect(() => {
    onChange && onChange(rowSelected);
  }, [rowSelected]);

  const { data: listDataTable, isLoading } = useQuery({
    queryKey: [
      "get-list-select-employee-modal",
      pagination,
      searchKeyword,
      mode,
      selectEmployeeIds,
    ],

    queryFn: () => {
      return EmployeeApi.getList({
        params: {
          ...pagination,
          keyword: searchKeyword,
          onlyUser: 1,
          ...(mode === "delete" && { except_id: selectEmployeeIds.join(",") }),
        },
      });
    },

    staleTime: 300000,
    gcTime: 300000,
  });

  const memoDataTable = useMemo(() => {
    return listDataTable?.data ?? [];
  }, [listDataTable]);

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setPagination({
      limit: pageSize,
      page: Number(pageSize) === Number(pagination.limit) ? page : 1,
    });
  };

  const handleSearch = (value) => {
    setSearchKeyword(value?.keyword);
  };

  const rowSelection: TableRowSelection<AnyObject> = {
    selectedRowKeys: rowId,
    ...rowSelectionProps,
    ...(mode === "disable" && {
      getCheckboxProps: (record) => {
        if (value?.find((item) => item.id === record.id)) {
          return { disabled: true };
        }
        return {};
      },
    }),
    onChange: (selectedRowKeys, record) => {
      setRowSelected((prev) => {
        const existedRecord = (prev ?? []).filter((item) =>
          selectedRowKeys.includes(item?.id),
        );
        const usedRecord = record.filter((item) => !!item);
        return mergeArrayObjectByKey(
          existedRecord ?? [],
          usedRecord ?? [],
          "id",
        );
      });
      setRowId(selectedRowKeys);
    },
  };

  useImperativeHandle(ref, () => {
    return {
      onSubmit: () => rowSelected,
    };
  }, [ref, rowSelected]);

  const columns: any = [
    {
      title: "Mã NV",
      dataIndex: "code",
      width: "8%",
      render: (value) => <div className="line-clamp-2">{value}</div>,
    },
    {
      title: "Mã nhân sự",
      dataIndex: "employee_hrm",
      render: (code_hrm) => (
        <div className="line-clamp-2">{code_hrm?.code}</div>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      render: (name) => <div className="line-clamp-2">{name}</div>,
    },
    {
      title: "Phòng ban",
      dataIndex: "department_text",
      render: (department, record) =>
        record?.employee_hrm ? (
          <div className="line-clamp-2">
            {record?.employee_hrm?.department?.name}
          </div>
        ) : (
          <div className="line-clamp-2">{department?.title}</div>
        ),
    },
    {
      title: "Chức danh",
      dataIndex: "job_title_text",
      render: (jobTitle) => (
        <div className="line-clamp-2">{jobTitle?.title} </div>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "position_text",
      render: (position) => (
        <div className="line-clamp-2">{position?.title}</div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "8%",
      align: "center",
      render: (status) =>
        StatusEmployeeDOF?.[status]?.color && (
          <Tag color={StatusEmployeeDOF?.[status]?.color}>
            {StatusEmployeeDOF?.[status]?.title}
          </Tag>
        ),
    },
  ];

  useEffect(() => {
    if (value?.length > 0) {
      if (mode === "delete") return;
      if (mode === "disable") {
        const listId = value.map((item) => item?.id);
        setRowId(listId);
        setRowSelected(value.map((item) => ({ ...item, disable: true })));
        return;
      }
      const listId = value.map((item) => item?.id);
      setRowId(listId);
      setRowSelected(value);
    }
  }, [value, mode]);

  const getClassName = (record) => {
    if (selectEmployeeIds.includes(record.id) && mode === "disable")
      return "!bg-gray-100";
    return rowId.includes(record?.id) && " tera-table-cell-row-focused ";
  };

  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <div>
          <SelectContactModalHeader
            onSearch={handleSearch}
            placeholderProp={`Tìm kiếm theo mã, tên ${title}`}
          />
        </div>
      </div>
      <Row>
        <Description className="grid-cols-1 flex" label="Đã chọn: ">
          {rowId?.length}
        </Description>
      </Row>
      <Table
        rowKey={"id"}
        columns={columns}
        data={memoDataTable}
        className="max-h-[500px] overflow-auto"
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => {
            if (mode === "disable") {
              if (selectEmployeeIds.includes(record?.id)) {
                return;
              }
            }
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
          },
          className: getClassName(record),
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
    </>
  );
};

export default forwardRef<IEmployeeContentRef, IProps>(EmployeeContent);
