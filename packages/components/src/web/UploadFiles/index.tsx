import { portalEndpoint } from "@tera/api/_endpoint";
import React, { useEffect, useRef, useState } from "react";
import { rootStore } from "@tera/states/stores";
import {
  Button,
  DocumentOutlined,
  Input,
  PaperClipOutlined,
  notification,
} from "tera-dls";
import Axios from "axios";
import ActionCUD from "@tera/components/web/TableColumnCustom/ActionCUD";
import ModalPreview from "./ModalPreview";
import { IFileUpload } from "@tera/commons/interfaces";

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
  fileList: IFileUpload[];
  children?: React.ReactNode;
  multiple?: boolean;
  accept?: string;
  object_id?: string;
  mode?: "edit" | "view";
  isSingle?: boolean;
  isView?: boolean;
  maxSize?: number;
  onRemove?: (file: IFileUpload) => void;
  onReceiveFiles?: (file: IFileUpload, files: IFileUpload[]) => void;
  onProgressUpdate?: (percent?: number, file?: HTMLInputElement) => void;
  onFailed?: (error) => void;
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
  maxSize,
  children = null,
  multiple = false,
  accept,
  object_id,
  mode = "edit",
  isView = true,
  isSingle = false,

  onRemove,
  onReceiveFiles,
  onProgressUpdate,
  onFailed,
  ...props
}: UploadFilesProps) {
  const [fileListState, setFileListState] = useState([]);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFileListState(fileList);
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
      const newListFile = [newPdf, ...fileListState];
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
      const authToken = rootStore.authStore.token;
      const deviceCode = rootStore.authStore.device;
      const result = await Axios({
        method: "POST",
        url: `${portalEndpoint}/file/upload`,
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
      if (onFailed) {
        onFailed(error);
      }
      notification.error({
        message: "Tải file lên thất bại!",
      });
    }
  };

  const _handleRemove = (file) => {
    if (typeof onRemove === "function") {
      onRemove(file);
    }
  };

  const _handleDownload = async (file) => {
    if (!file) return;
    try {
      const authToken = rootStore.authStore.token;
      const deviceCode = rootStore.authStore.device;
      const result = await Axios({
        method: "GET",
        url: `${portalEndpoint}/file/download/${file?.id}?object_id=${object_id}`,

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

  return (
    <>
      {children && <div onClick={handleUploadNewFile}>{children}</div>}

      <Input
        type="file"
        onChange={(e) => _handleUpload(e.target.files[0])}
        ref={inputRef}
        className="hidden"
        multiple={multiple}
        accept={accept}
        {...props}
      />
      {!children && mode === "edit" && (
        <div
          className="p-2 flex justify-between items-center bg-[#fafafa] rounded-[3px] border border-[#f5f5f5] cursor-pointer"
          onClick={handleUploadNewFile}
        >
          <Button htmlType="button" type="alternative">
            File
          </Button>
          <p className="flex gap-x-2 items-center">
            <PaperClipOutlined className="w-[16px] h-[16px]" />
            <span>Tải File</span>
          </p>
        </div>
      )}

      {fileListState?.length > 0 &&
        isView &&
        fileListState.map((file) => (
          <div className="flex justify-between  p-2.5" key={file?.id}>
            <div className="flex items-center gap-x-1">
              <DocumentOutlined className="w-6 h-6" />
              <span>{file?.name}</span>
            </div>
            <ActionCUD
              classNames="gap-x-2"
              onClickDetail={() => {
                setFilePreview(file);
                setIsPreview(true);
              }}
              onClickDelete={() => _handleRemove(file)}
              onClickDownload={() => _handleDownload(file)}
              activeButtons={
                mode === "edit" ? ["detail", "delete"] : ["detail", "download"]
              }
            />
          </div>
        ))}
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

export default UploadFiles;
