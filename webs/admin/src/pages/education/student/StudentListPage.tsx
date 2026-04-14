import { useQueryClient } from "@tanstack/react-query";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";
import useConfirm from "_common/hooks/useConfirm";
import classNames from "classnames";
import { useState } from "react";
import {
  ArrowDownTrayOutlined,
  Button,
  Col,
  DropdownItem,
  FunnelOutlined,
  PaginationProps,
  PlusCircleOutlined,
  Row,
  Tag,
  Tooltip,
} from "tera-dls";
import { useNavigate } from "react-router-dom";
import { StudentService } from "@tera/modules";
import { TableTera } from "@tera/components/dof";

const classNameButton = classNames("cursor-pointer", "w-4 h-4");
const classNameDownload = classNames(classNameButton);

const StudentListPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [params, setParams] = useState<any>({});
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [itemClick, setItemClick] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isPending } = StudentService.useStudentList(params);

  console.log("isPending", isPending)
  console.log("data", data)

  const itemsAction = (item): DropdownItem[] => {
    return [
      {
        key: 1,
        label: "Xem",
        onClick: () => {},
      },
      {
        key: 2,
        label: "Sửa",
        onClick: () => {
          setItemClick(item);
          setIsOpenForm(true);
        },
      },
      {
        key: 3,
        label: <span className="text-red-500">Xóa</span>,
      },
    ];
  };

  const columns = [
    {
      title: "Tên mẫu in",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Loại mẫu in",
      dataIndex: "print_type",
      key: "print_type",
      render: (data) => <p className="line-clamp-2">{data?.title}</p>,
    },
    {
      title: "Thứ tự",
      dataIndex: "item_prev_order",
      key: "item_prev_order",
    },
    {
      title: "Hiển thị",
      dataIndex: "display",
      key: "display",
    },
    {
      title: "",
      width: 80,
      render: (record: any) => (
        <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
      ),
    },
  ];

  // ----- Function -----
  const handleSearch = (value) => {
    setParams({ ...params, keyword: value?.keyword, page: 1 });
  };

  const handleFilter = (value) => {
    setParams({ ...params, ...value, page: 1 });
    queryClient.invalidateQueries({ queryKey: ["student", "list"] });
  };

  const handleOpenFiler = () => {
    setIsOpenFilter(true);
  };

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    const isDiffPageSize = params?.limit && pageSize !== Number(params?.limit);
    setParams({
      ...params,
      page: isDiffPageSize ? 1 : page,
      limit: pageSize,
    });
  };

  return (
    <>
      <div className="flex items-center justify-end mx-5 mb-5">
        <div className="flex gap-2.5">
          <Button
            type="alternative"
            className="rounded-xsm px-2 py-1"
            onClick={handleOpenFiler}
          >
            <FunnelOutlined className="w-5 h-5 text-gray-400 shrink-0" />
          </Button>
          <Button
            onClick={() => setIsOpenForm(true)}
            className="rounded-xsm shrink-0 px-2 py-1"
          >
            <div className="flex items-center gap-1 shrink-0">
              <PlusCircleOutlined className="w-5 h-5" />
              <span>Thêm mới</span>
            </div>
          </Button>
        </div>
      </div>
      <TableTera
        rowKey={(record: any) => record.id}
        columns={columns}
        data={data?.data?.data || []}
        loading={isPending}
        pagination={{
          onChange: handleChangePage,
          total: data?.data?.total,
          current: data?.data?.current_page,
          pageSize: Number(data?.data?.per_page),
          to: data?.data?.to,
          from: data?.data?.from,
        }}
      />
    </>
  );
};

export default StudentListPage;
