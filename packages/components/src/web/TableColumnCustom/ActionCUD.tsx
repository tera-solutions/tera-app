import { usePermission } from "@tera/states/hooks";
import classnames from "classnames";
import React, { Fragment } from "react";
import {
  ArrowDownTrayOutlined,
  EyeOutlined,
  PencilSquareOutlined,
  Tooltip,
  TrashOutlined,
} from "tera-dls";

export type TTypeButton = "detail" | "update" | "delete" | "download";

interface ActionCUDProps {
  onClickDetail?: () => void;
  onClickUpdate?: () => void;
  onClickDelete?: () => void;
  onClickDownload?: () => void;
  buttonKey?: {
    detail?: string;
    update?: string;
    delete?: string;
    download?: string;
  };
  classNames?: string;
  classNameButtonDetail?: string;
  classNameButtonUpdate?: string;
  classNameButtonDelete?: string;
  classNameButtonDownload?: string;
  propsButtonDetail?: {
    [key: string]: any;
  };
  propsButtonUpdate?: {
    [key: string]: any;
  };
  propsButtonDelete?: {
    [key: string]: any;
  };
  activeButtons?: Array<TTypeButton>;
  size?: "small" | "default" | "large";
}

function ActionCUD({
  onClickDetail,
  onClickUpdate,
  onClickDelete,
  onClickDownload,
  classNames,
  classNameButtonDetail,
  classNameButtonUpdate,
  classNameButtonDelete,
  classNameButtonDownload,
  propsButtonDetail,
  propsButtonUpdate,
  propsButtonDelete,
  buttonKey,
  activeButtons = ["detail", "update", "delete"],
  size = "default",
}: ActionCUDProps) {
  const { hasPage } = usePermission();

  const classNameButton = classnames("cursor-pointer", {
    "w-4 h-4": size === "small",
    "w-6 h-6": size === "default",
    "w-8 h-8": size === "large",
  });

  const classNameDiv = classnames(
    "flex items-center justify-center",
    classNames,
    {
      "gap-x-1.5": size === "small",
      "gap-x-2.5": size !== "small",
    },
  );

  const classNameDetail = classnames(
    classNameButton,
    "text-blue-600",
    classNameButtonDetail,
  );
  const classNameUpdate = classnames(
    classNameButton,
    "text-green-500",
    classNameButtonUpdate,
  );
  const classNameDelete = classnames(
    classNameButton,
    "text-red-600",
    classNameButtonDelete,
  );
  const classNameDownload = classnames(
    classNameButton,
    classNameButtonDownload,
  );

  const checkPermissionButton = (key: string): boolean =>
    key ? hasPage(key) : true;

  const RenderButton = (type: TTypeButton) => {
    switch (type) {
      case "detail":
        return (
          typeof onClickDetail === "function" &&
          checkPermissionButton(buttonKey?.detail) && (
            <Tooltip placement="top" title="Chi tiết">
              <div>
                <EyeOutlined
                  className={classNameDetail}
                  onClick={onClickDetail}
                  {...propsButtonDetail}
                />
              </div>
            </Tooltip>
          )
        );
      case "download":
        return (
          typeof onClickDetail === "function" &&
          checkPermissionButton(buttonKey?.download) && (
            <Tooltip placement="top" title="Tải xuống">
              <div>
                <ArrowDownTrayOutlined
                  onClick={onClickDownload}
                  className={classNameDownload}
                />
              </div>
            </Tooltip>
          )
        );
      case "update":
        return (
          typeof onClickUpdate === "function" &&
          checkPermissionButton(buttonKey?.update) && (
            <Tooltip placement="top" title="Sửa">
              <div>
                <PencilSquareOutlined
                  className={classNameUpdate}
                  onClick={onClickUpdate}
                  {...propsButtonUpdate}
                />
              </div>
            </Tooltip>
          )
        );

      case "delete":
        return (
          typeof onClickDelete === "function" &&
          checkPermissionButton(buttonKey?.delete) && (
            <Tooltip placement="top" title="Xoá">
              <div>
                <TrashOutlined
                  className={classNameDelete}
                  onClick={onClickDelete}
                  {...propsButtonDelete}
                />
              </div>
            </Tooltip>
          )
        );
    }
  };

  return (
    <div className={classNameDiv}>
      {activeButtons &&
        activeButtons.map((item) => (
          <Fragment key={item}>{RenderButton(item)}</Fragment>
        ))}
      {/* {activeButtons.includes('detail') &&
        typeof onClickDetail === 'function' &&
        checkPermissionButton(buttonKey?.detail) && (
          <Tooltip placement='top' title="Chi tiết">
            <div>
              <EyeOutlined
                className={classNameDetail}
                onClick={onClickDetail}
                {...propsButtonDetail}
              />
            </div>
          </Tooltip>
        )}
      {activeButtons.includes('update') &&
        typeof onClickUpdate === 'function' &&
        checkPermissionButton(buttonKey?.update) && (
          <Tooltip placement='top' title="Sửa">
            <div>
              <PencilSquareOutlined
                className={classNameUpdate}
                onClick={onClickUpdate}
                {...propsButtonUpdate}
              />
            </div>
          </Tooltip>
        )}
      {activeButtons.includes('delete') &&
        typeof onClickDelete === 'function' &&
        checkPermissionButton(buttonKey?.delete) && (
          <Tooltip placement='top' title="Xoá">
            <div>
              <TrashOutlined
                className={classNameDelete}
                onClick={onClickDelete}
                {...propsButtonDelete}
              />
            </div>
          </Tooltip>
        )}
      {activeButtons.includes('download') &&
        typeof onClickDownload === 'function' && (
          <Tooltip placement='top' title="Tải xuống">
            <div>
              <ArrowDownTrayOutlined
                onClick={onClickDownload}
                className={classNameDownload}
              />
            </div>
          </Tooltip>
        )} */}
    </div>
  );
}

export default ActionCUD;
