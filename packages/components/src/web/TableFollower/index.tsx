import TableTera from "@tera/components/dof/TableTera";
import { INDEX_NUMBER_KEY } from "@tera/components/dof/TableTera/constants";
import { useStores } from "hooks/useStores";
import { usePermission } from "@tera/states/hooks";
import { PlusCircleOutlined, Tooltip } from "tera-dls";
import ActionCUD from "../TableColumnCustom/ActionCUD";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

interface ITableFollowerProps {
  permissionKeyProps?: any;
  isDetail?: boolean;
  dataTable?: any[];
}

const TableFollower = ({
  permissionKeyProps,
  isDetail,
  dataTable,
}: ITableFollowerProps) => {
  const {
    modalSelectStore: { employee, openModal, updateData, clearData },
  } = useStores();
  // const { handleOpenModalEmployee, handleRemoveItemEmployee, selectEmployee } =
  //   useCrmClient();
  const { hasPage } = usePermission();
  const keyConfig = {
    delete: permissionKeyProps?.ACTIVITY_TASK_DELETE,
  };

  const columns: any = [
    {
      title: "STT",
      dataIndex: INDEX_NUMBER_KEY,
      width: 80,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "code",
      //   width: 200,
      render: (value) => <div className="line-clamp-2">{value}</div>,
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      //   width: 200,
      render: (name) => <a className="line-clamp-2">{name}</a>,
    },

    !isDetail && {
      title: hasPage(permissionKeyProps.ACTIVITY_TASK_CREATE) && (
        <div className="flex justify-center">
          <Tooltip title="Thêm">
            <div>
              <PlusCircleOutlined
                className="w-6 h-6 cursor-pointer text-green-600 flex justify-center"
                onClick={() =>
                  openModal("employee", { open: true, title: "người theo dõi" })
                }
              />
            </div>
          </Tooltip>
        </div>
      ),
      dataIndex: "",
      width: 80,
      render: (record) => {
        return (
          <ActionCUD
            classNames="gap-x-2"
            onClickDelete={() => {
              updateData(
                "employee",
                "data",
                employee?.data?.filter(
                  (employee) => employee?.id !== record?.id,
                ),
              );
              // handleRemoveItemEmployee(record);
            }}
            buttonKey={keyConfig}
            activeButtons={["delete"]}
          />
        );
      },
    },
  ];

  useEffect(() => {
    return () => clearData("employee");
  }, []);

  return (
    <TableTera
      rowKey="id"
      //   objectType={TABLE_KEY.ACTIVITY_TASK_LIST}
      columns={columns}
      data={dataTable || employee?.data}
      scroll={{ y: 450 }}
    />
  );
};

export default observer(TableFollower);
