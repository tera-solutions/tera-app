import NoPermission from "@tera/components/web/NoPermission";
import ActionCUD, {
  TTypeButton,
} from "@tera/components/web/TableColumnCustom/ActionCUD";
import { fileEndpoint } from "@tera/api/_endpoint";
import { useStores } from "@tera/stores/useStores";
import { usePermission } from "@tera/commons/hooks/usePermission";
import { IFileUpload } from "@tera/commons/interfaces";
import Axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import IconCloud from "@tera/assets/icons/cloud-arrow-up.svg?react";
import customTwMerge from "tailwind-merge.config";
import {
  Button,
  DocumentOutlined,
  DocumentTextOutlined,
  InboxStackOutlined,
  Input,
  PaperClipOutlined,
  PhotoOutlined,
  TableCellsOutlined,
  VideoCameraOutlined,
  checkFileType,
  formatDate,
  notification,
} from "tera-dls";
import ModalPreview from "./ModalPreview";

export const config = {
  google: {
    clientID: "",
    keyGMap: "",
  },
  fbConfig: {
    appId: "",
    version: "v1.0",
  },
  hasHeader: false,
  hasMobile: true,
  templates: ["tera"],
  languages: ["vn"],
  app: {},
  uploadKey: "9074c259a7",
  appId: "2",
};

interface UploadFilesProps {
  object_key?: string;
  folder?: string;
  fileList?: IFileUpload[];
  children?: React.ReactNode;
  multiple?: boolean;
  accept?: string;
  object_id?: string;
  mode?: "edit" | "view";
  isSingle?: boolean;
  isView?: boolean;
  maxSize?: number;
  activeButtons?: Array<TTypeButton>;
  size?: "small" | "default" | "large";
  className?: string;
  cols?: number;
  isCount?: boolean;
  onRemove?: (file: IFileUpload) => void;
  onReceiveFiles?: (file: IFileUpload, files: IFileUpload[]) => void;
  onChangeFile?: (e: any) => void;
  onProgressUpdate?: (percent?: number, file?: HTMLInputElement) => void;
  onFailed?: (error) => void;
  permission?: {
    upload: string;
    download: string;
    delete: string;
    list: string;
  };
  [key: string]: any;
}

export interface UploadFilesRefs {
  cancelUpload: () => void;
}

/**
 * UploadFiles props definition
 * @prop maxSize: dung lượng tối đa file đính kèm (MB)
 */

function UploadFiles({
  object_key,
  folder,
  fileList,
  maxSize = 10,
  children = null,
  multiple = false,
  accept,
  object_id,
  mode = "edit",
  isView = true,
  isSingle = false,
  activeButtons,
  size = "default",
  className,
  cols = 1,
  isCount = true,
  onChangeFile,
  onRemove,
  onReceiveFiles,
  onProgressUpdate,
  onFailed,
  permission,
  ...props
}: UploadFilesProps) {
  const {
    globalStore: { token: tokenModule, device: deviceModule },
    globalStore: { token: tokenGlobal, device: deviceGlobal },
  } = useStores();
  const authToken = tokenGlobal || tokenModule;
  const deviceCode = deviceGlobal || deviceModule;

  const [fileListState, setFileListState] = useState([]);

  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { hasPage } = usePermission();
  useEffect(() => {
    if (fileList) setFileListState(fileList);
  }, [fileList]);

  const handleSuccess = ({ url, file, id }) => {
    const newPdf = {
      id,
      name: file?.name,
      url,
    };

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (isSingle) {
      setFileListState([newPdf]);
      if (typeof onReceiveFiles === "function") {
        onReceiveFiles(newPdf, [newPdf]);
      }
    } else {
      const newListFile = [...fileListState, newPdf];

      setFileListState(newListFile);
      if (typeof onReceiveFiles === "function") {
        onReceiveFiles(newPdf, newListFile);
      }
    }
  };

  // const handleUploadFailed = (res) => {
  //   const { file } = res;
  //   if (!file) return;
  //   const data = [...fileListState];
  //   const index = data.findIndex((i) => i?.id === file?.id);
  //   data.splice(index, 1);

  //   setFileListState(data);
  // };

  const _handleUpload = async (file) => {
    if (!file) return;
    if (maxSize && file?.size > maxSize * 1024 * 1024) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      notification.error({
        message: "File tải lên vượt quá dung lượng cho phép",
      });
      return;
    }
    const form = new FormData();
    form.append("file", file);
    form.append("app_id", config.appId);
    form.append("object_id", object_id);
    form.append("object_key", object_key);
    form.append("folder", folder);
    form.append("secure_code", "tera");

    try {
      // const authToken = rootStore.globalStore.token;
      // const deviceCode = rootStore.globalStore.device;
      const result = await Axios({
        method: "POST",
        url: `${fileEndpoint}/upload`,
        data: form,
        headers: {
          authorization: authToken ? `Bearer ${authToken}` : "",
          "device-code": deviceCode,
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );

          if (onProgressUpdate) {
            onProgressUpdate(percentage, file);
          }
        },
      });

      handleSuccess({
        file: file,
        url: result?.data?.data?.thumb,
        id: result?.data?.data?.id,
      });
    } catch (error) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      if (onFailed) {
        onFailed(error);
      }
      notification.error({
        message: "Tải file lên thất bại!",
      });
    }
  };

  const _handleRemove = (file) => {
    setFileListState((prev) => prev.filter((f) => f?.id !== file?.id));

    if (typeof onRemove === "function") {
      onRemove(file);
    }
  };

  const _handleDownload = async (file) => {
    if (!file) return;
    try {
      // const authToken = rootStore.globalStore.token;
      // const deviceCode = rootStore.globalStore.device;
      const result = await Axios({
        method: "GET",
        url: `${fileEndpoint}/download/${file?.id}?object_id=${object_id}`,

        headers: {
          authorization: authToken ? `Bearer ${authToken}` : "",
          "device-code": deviceCode,
        },
      });
      if (result?.status !== 200) throw new Error(result?.data?.msg);
      const url = result?.data?.src;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${file?.name}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      notification.error({
        message: "Tải file lên thất bại!",
      });
    }
  };

  const handleUploadNewFile = () => {
    inputRef?.current?.click();
  };

  const renderIconTypeFile = (name) => {
    const classIcon = "w-6 h-6 shrink-0 text-gray-500";
    const type = name && checkFileType(name);
    switch (type) {
      case "image":
        return <PhotoOutlined className={classIcon} />;
      case "word":
        return <DocumentTextOutlined className={classIcon} />;
      case "excel":
        return <TableCellsOutlined className={classIcon} />;
      case "audio":
        return <VideoCameraOutlined className={classIcon} />;
      case "zip":
        return <InboxStackOutlined className={classIcon} />;
      default:
        return <DocumentOutlined className={classIcon} />;
    }
  };

  const handleActiveButtons = (activeButtons) => {
    if (activeButtons) return activeButtons;
    return mode === "edit" ? ["detail", "delete"] : ["detail", "download"];
  };

  const [large, setLarge] = useState(false);

  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef?.current?.offsetWidth > 768) {
      setLarge(true);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    _handleUpload(droppedFile);
  };

  if (
    permission &&
    !hasPage(permission?.list) &&
    !hasPage(permission?.upload)
  ) {
    return <NoPermission />;
  }

  return (
    <>
      {children && (
        <div className={className} onClick={handleUploadNewFile}>
          {children}
        </div>
      )}
      <Input
        type="file"
        onChange={(e) => {
          _handleUpload(e.target.files[0]);
          onChangeFile && onChangeFile(e);
        }}
        ref={inputRef}
        className="hidden"
        multiple={multiple}
        accept={accept}
        {...props}
      />
      {/* {hasPage(permission?.upload) && (
        
      )} */}
      {!children && (
      <div ref={elementRef} className="flex flex-col gap-2 items-center">
        {mode === "edit" && hasPage(permission?.upload) && (
          <>
            {large ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={handleUploadNewFile}
                className="cursor-pointer flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2.5 py-[10px] rounded-[10px] bg-white border-2 border-gray-200 border-dashed hover:border-blue-500"
              >
                <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                  <IconCloud />
                  <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-[15px]">
                    <p className="flex-grow-0 flex-shrink-0 text-[13px] font-medium text-center text-gray-700">
                      Chọn file hoặc kéo thả file vào đây
                    </p>
                  </div>
                </div>
                <Button
                  // onClick={handleUploadNewFile}
                  htmlType="button"
                  type="alternative"
                  className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[297px] h-10 relative overflow-hidden gap-2.5 px-[33px] py-4 rounded bg-white border border-[#3f83f8]"
                >
                  Chọn file
                </Button>
              </div>
            ) : (
              <div
                className="p-2 flex justify-between items-center bg-[#fafafa] rounded-[3px] border border-[#f5f5f5] cursor-pointer w-full"
                onClick={handleUploadNewFile}
              >
                <Button htmlType="button" type="alternative">
                  File
                </Button>
                <p className="flex items-center gap-x-2">
                  <PaperClipOutlined className="w-[16px] h-[16px]" />
                  <span>Tải File</span>
                </p>
              </div>
            )}
          </>
        )}
        {hasPage(permission?.list) && (
          <div
            className={customTwMerge(
              `grid grid-cols-${cols} gap-2 w-full`,
              large && "w-3/4",
            )}
          >
            {isCount && fileListState?.length > 0 && (
              <p>
                Đã tải {fileListState?.length}{" "}
                <span className="text-gray-500">file</span>{" "}
              </p>
            )}
            {fileListState?.length > 0 &&
              isView &&
              fileListState.map((file) => {
                const isReviewFile = checkFileType(file?.url ?? "")?.includes(
                  "image",
                );

                return (
                  <>
                    <div
                      className="flex justify-between py-2.5 px-4 border border-gray-300 rounded-xl"
                      key={file?.id}
                    >
                      <div className="flex items-start gap-x-1">
                        {renderIconTypeFile(file?.name)}
                        <div className="flex flex-col">
                          <span className="break-word line-clamp-1 text-gray-800">
                            {file?.name}
                          </span>
                          {file?.created_by && (
                            <span className="break-word line-clamp-1 leading-3 text-[10px] text-gray-500">
                              {file?.created_by?.full_name}
                            </span>
                          )}
                          {file?.size && file?.created_at && (
                            <p className="text-[10px] text-gray-500 leading-3">
                              {file?.size && file?.size} -{" "}
                              {formatDate(
                                file?.created_at,
                                "DD/MM/YYYY - HH:mm:ss",
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      <ActionCUD
                        classNames="gap-x-2"
                        onClickDetail={() => {
                          setFilePreview(file);
                          setIsPreview(true);
                        }}
                        onClickDelete={() => _handleRemove(file)}
                        onClickDownload={() => _handleDownload(file)}
                        activeButtons={handleActiveButtons(
                          activeButtons,
                        ).filter((key) => {
                          if (!isReviewFile) {
                            return key !== "detail";
                          }
                          return true;
                        })}
                        size={size}
                        classNameButtonDelete="rounded-full bg-red-200 p-1"
                        classNameButtonDownload="rounded-full bg-gray-200 p-1"
                        classNameButtonDetail="rounded-full bg-blue-100 p-1"
                      />
                    </div>
                  </>
                );
              })}
          </div>
        )}
      </div>
      )}
      {isPreview && (
        <ModalPreview
          open={isPreview}
          file={filePreview}
          handleClose={() => {
            setFilePreview(null);
            setIsPreview(null);
          }}
        />
      )}
    </>
  );
}

export default observer(UploadFiles);
