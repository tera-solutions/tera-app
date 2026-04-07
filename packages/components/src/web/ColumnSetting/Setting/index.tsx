import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";
import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import TableTera from "@tera/components/dof/TableTera";
import { INDEX_NUMBER_KEY } from "@tera/components/dof/TableTera/constants";
import useConfirm from "@tera/states/hooks/useConfirm";
import ColumnConfigApi from "@tera/commons/system/ManagePage/ColumnConfig/_api";
import ColumnConfigDetail from "@tera/commons/system/ManagePage/ColumnConfig/containers/Detail";
import ColumnConfigForm from "@tera/commons/system/ManagePage/ColumnConfig/containers/Form";
import {
  dataType,
  statusOnOffString,
} from "@tera/commons/system/ManagePage/constants";
import { useState } from "react";
import {
  Button,
  DropdownItem,
  PlusCircleOutlined,
  Tag,
  notification,
} from "tera-dls";

interface IProps {
  value: any;
  tableId: string | number;
  loading?: boolean;
  onUpdatedData?: (val: boolean) => void;
}

function TableColumConfig(props: IProps) {
  const { value, tableId, loading, onUpdatedData } = props;
  const confirm = useConfirm();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [idColumn, setIdColumn] = useState<number | string>(null);
  // const { hasPage } = usePermission();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  const { mutate: deleteColumn } = useMutation({
    mutationFn: (id: number) => ColumnConfigApi.delete(id),
  });

  const { mutate: deleteMultipleColumns } = useMutation({
    mutationFn: (variables: any) => ColumnConfigApi.deleteMultiple(variables),
  });

  const handleDelete = (id: number) => {
    confirm.warning({
      title: "XÁC NHẬN XÓA CỘT DỮ LIỆU",
      content: (
        <>
          <p>Bạn có chắc chắn muốn xóa cột</p>
          <p>này không?</p>
        </>
      ),
      onOk: () => {
        deleteColumn(id);
      },
    });
  };

  const handleDetail = (id: number) => {
    setIsOpenDetail(true);
    setIdColumn(id);
  };

  const handleUpdate = (id: number) => {
    setIsOpenForm(true);
    setIdColumn(id);
  };

  const generateDropDownItems = (record): DropdownItem[] => {
    const dropdownItems: DropdownItem[] = [];
    // hasPage(BUTTON_KEY.COLUMN_CONFIG_LIST_DETAIL) &&
    dropdownItems.push({
      key: 1,
      label: <a onClick={() => handleDetail(record?.id)}>Xem</a>,
    });

    // hasPage(BUTTON_KEY.COLUMN_CONFIG_LIST_UPDATE) &&
    dropdownItems.push({
      key: 10,
      label: <a onClick={() => handleUpdate(record?.id)}>Sửa</a>,
    });

    // hasPage(BUTTON_KEY.COLUMN_CONFIG_LIST_DELETE) &&
    dropdownItems.push({
      key: 2,
      label: (
        <a className="text-red-500" onClick={() => handleDelete(record?.id)}>
          Xóa
        </a>
      ),
    });

    return dropdownItems;
  };

  const handleDeleteMultipleRows = () => {
    confirm.warning({
      title: "XÁC NHẬN XÓA CÁC CỘT DỮ LIỆU",
      content: <p>Bạn có chắc chắn muốn xóa các cột đã chọn này không?</p>,
      onOk: () => {
        deleteMultipleColumns({ ids: selectedRowKeys, table_id: tableId });
      },
    });
  };

  const columns: any = [
    {
      title: "STT",
      dataIndex: INDEX_NUMBER_KEY,
      width: 50,
      align: "center",
    },
    {
      title: "Mã cột dữ liệu",
      dataIndex: "concatenated_code",
      width: 300,

      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 200,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Loại dữ liệu",
      dataIndex: "type",
      width: 150,
      render: (type) => dataType[type],
    },
    {
      title: "Key dữ liệu",
      dataIndex: "key",
      width: 150,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "className",
      dataIndex: "class_name",
      width: 150,
      render: (text) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (text) => (
        <Tag color={statusOnOffString[text]?.color}>
          {statusOnOffString[text]?.name}
        </Tag>
      ),
    },
    {
      title: "",
      width: 30,
      fixed: "right",
      render: (_, record) => {
        return (
          <ActionDropdown
            dropdownItems={generateDropDownItems(record)}
            trigger="click"
            placement="bottom-end"
            containerClassName="w-12"
          />
        );
      },
    },
  ];

  return (
    <>
      <div className={`flex justify-between items-center mb-3.5`}>
        {selectedRowKeys?.length > 0 ? (
          <div className="flex gap-5">
            <span className="bg-green-300 rounded-full px-5 py-1.5 grid items-center text-white">
              Đã chọn ({selectedRowKeys?.length ?? 0})
            </span>

            <Button
              onClick={() =>
                selectedRowKeys?.length > 0 && handleDeleteMultipleRows()
              }
              type="danger"
            >
              Xóa
            </Button>
          </div>
        ) : (
          <div />
        )}
        {/* {hasPage(BUTTON_KEY.COLUMN_CONFIG_LIST_CREATE) && (
        )} */}
        <Button
          onClick={() => setIsOpenForm(true)}
          disabled={!tableId}
          className="rounded-xsm"
        >
          <PlusCircleOutlined className="w-[1rem] h-[1rem]" />
          Thêm mới
        </Button>
      </div>

      <div className="bg-white shadow-xsm rounded-[5px] overflow-hidden">
        <TableTera
          loading={loading}
          columns={columns}
          data={value ?? []}
          rowKey="id"
          pagination={{}}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        />
      </div>
      {isOpenDetail && idColumn && (
        <ColumnConfigDetail
          open={isOpenDetail}
          onClose={() => {
            setIdColumn(null);
            setIsOpenDetail(false);
          }}
          id={idColumn}
        />
      )}
      {isOpenForm && (
        <ColumnConfigForm
          open={isOpenForm}
          id={idColumn}
          onClose={() => {
            setIsOpenForm(false);
            setIdColumn(null);
          }}
          onRefetch={() => {
            onUpdatedData && onUpdatedData(true);
          }}
          tableId={tableId}
        />
      )}
    </>
  );
}

export default TableColumConfig;
