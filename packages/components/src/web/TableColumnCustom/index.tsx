import { usePermission } from "@tera/states/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import {
  EyeOutlined,
  PencilSquareOutlined,
  Tag,
  Tooltip,
  TrashOutlined,
} from "tera-dls";

interface IAction {
  data?: any;
  handleOpenDelete: (data?) => void;
  handleOpenDetail?: (data?) => void;
  handleOpenEdit?: (data?) => void;
  buttonKey?: {
    detail?: string;
    update?: string;
    delete?: string;
  };
}

export const IconButton = ({ icon, callBack }) => {
  return (
    <button onClick={callBack} type={"button"} className="w-6 h-6">
      {icon}
    </button>
  );
};

type StatusEmployee = "active" | "inactive";

const statusWorkColor = {
  active: "green03",
  inactive: "red03",
};

export const Action = ({
  data,
  handleOpenDetail,
  handleOpenDelete,
  handleOpenEdit,
  buttonKey,
}: IAction) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPage } = usePermission();
  const handleRedirectDetail = async (typeRedirect) => {
    const textReplace =
      typeRedirect === "detail" ? `detail/${data?.id}` : `update/${data?.id}`;
    const pathnameDetail = location.pathname.replace("list", textReplace);
    navigate(pathnameDetail);
  };

  const checkPermissionButton = (key: string): boolean =>
    key ? hasPage(key) : true;

  return (
    <div className="flex items-center justify-center gap-2.5">
      {checkPermissionButton(buttonKey?.detail) && (
        <Tooltip title="Chi tiết">
          <IconButton
            icon={<EyeOutlined className="text-blue-600 " />}
            callBack={() => {
              if (handleOpenDetail) {
                handleOpenDetail(data);
                return;
              }
              handleRedirectDetail("detail");
            }}
          />
        </Tooltip>
      )}
      {checkPermissionButton(buttonKey?.update) && (
        <Tooltip title="Sửa">
          <IconButton
            icon={<PencilSquareOutlined className="w-6 h-6 text-green-500" />}
            callBack={() => {
              if (handleOpenEdit) {
                handleOpenEdit(data);
                return;
              }
              handleRedirectDetail("update");
            }}
          />
        </Tooltip>
      )}

      {checkPermissionButton(buttonKey?.delete) && (
        <Tooltip title="Xoá">
          <IconButton
            icon={<TrashOutlined className="w-6 h-6 text-red-600" />}
            callBack={() => handleOpenDelete(data)}
          />
        </Tooltip>
      )}
    </div>
  );
};

interface StatusProps {
  statusType: StatusEmployee;
  statusText: string;
}
export const Status = ({ statusType, statusText }: StatusProps) => {
  return (
    <Tag className="w-fit" color={statusWorkColor[statusType] as any}>
      {statusText}
    </Tag>
  );
};
