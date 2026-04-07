import { endpoint } from "@tera/api/_endpoint";
import React, { useEffect, useRef, useState } from "react";
import { rootStore } from "@tera/states/stores";
import { DocumentOutlined, Input, notification } from "tera-dls";
import Axios from "axios";
import ActionCUD from "@tera/components/web/TableColumnCustom/ActionCUD";

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

function UploadFile({
  object_key,
  folder,
  fileList,
  onReceiveFiles,
  onRemove,
  children = null,
  ...props
}) {
  const [fileListState, setFileListState] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    setFileListState(fileList);
  }, [fileList]);

  const handleSuccess = ({ url, file, id }) => {
    const newPdf = {
      id,
      name: file?.name,
      url,
    };

    const newListFile = [...fileListState, newPdf];

    setFileListState(newListFile);
    if (typeof onReceiveFiles === "function") {
      onReceiveFiles(newPdf, newListFile);
    }
  };

  const handleUploadFailed = (res) => {
    const { file } = res;
    if (!file) return;
    const data = [...fileListState];
    const index = data.findIndex((i) => i?.id === file?.id);
    data.splice(index, 1);

    setFileListState(data);
  };

  const _handleUpload = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("app_id", config.appId);
    form.append("object_id", props?.object_id);
    form.append("object_key", object_key);
    form.append("folder", folder);
    form.append("secure_code", "tera");
    try {
      const authToken = rootStore.authStore.token;
      const deviceCode = rootStore.authStore.device;
      const result = await Axios({
        method: "POST",
        url: `${endpoint}/file/upload`,
        data: form,
        headers: {
          authorization: authToken ? `Bearer ${authToken}` : "",
          "device-code": deviceCode,
        },
      });
      if (result?.data?.code !== 200) throw new Error(result?.data?.msg);
      handleSuccess({
        file: file,
        url: result?.data?.data?.thumb,
        id: result?.data?.data?.id,
      });
    } catch (error) {
      notification.error({
        message: "Tải file lên thất bại!",
      });
      if (handleUploadFailed) {
        handleUploadFailed({ file });
      }
    }
  };

  const _handleRemove = (file) => {
    if (typeof onRemove === "function") {
      onRemove(file);
    }
  };

  const handleOpenNewTab = (file) => {
    if (!file?.url)
      return notification.error({ message: "Không tìm thấy file đính kèm" });

    window.open(file?.url, "_blank");
    return null;
  };

  const handleUploadNewFile = () => {
    ref?.current?.click();
  };

  return (
    <>
      {children && <div onClick={handleUploadNewFile}>{children}</div>}

      <Input
        type="file"
        onChange={(e) => _handleUpload(e.target.files[0])}
        ref={ref}
        className={`${!!children ? "hidden" : ""}`}
      />

      {fileListState?.length > 0 &&
        fileListState.map((file) => (
          <div className="flex justify-between border p-2.5" key={file?.id}>
            <div className="flex items-center gap-x-1">
              <DocumentOutlined className="w-6 h-6" />
              <span>{file?.name}</span>
            </div>
            <ActionCUD
              classNames="gap-x-2"
              onClickDetail={() => handleOpenNewTab(file)}
              onClickDelete={() => _handleRemove(file)}
              activeButtons={["detail", "delete"]}
            />
          </div>
        ))}
    </>
  );
}

export default UploadFile;
