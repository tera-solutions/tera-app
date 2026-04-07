import React, { useEffect, useState } from "react";
import Axios from "axios";
import { endpoint } from "@tera/api/_endpoint";
import UploadButton from "./UploadButton";
import { rootStore } from "@tera/states/stores";

import { IFileUpload } from "_common/interface";
import { notification } from "tera-dls";

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
  templates: ["remix"],
  languages: ["vn"],
  app: {},
  uploadKey: "9074c259a7",
  appId: "2",
};

interface UploadPdfProps {
  fileList?: Array<IFileUpload>;
  disabled?: boolean;
  textDisplay?: string;
  onReceiveImages: (data) => void;
  object_key: string;
  accept?: string;
  folder: string;
  mode?: string;
  [props: string]: any;
}

const UploadPdf = ({
  fileList = [],
  disabled = false,
  textDisplay = "Kéo thả PDF",
  onReceiveImages,
  object_key,
  accept = ".pdf",
  folder = null,
  mode = "edit",
  ...props
}: UploadPdfProps) => {
  const [fileListState, setFileListState] = useState([]);

  useEffect(() => {
    setFileListState(fileList);
  }, [fileList]);

  const handleSuccess = ({ url, file, id }) => {
    const newPdf = {
      id,
      name: file?.name,
      url,
    };

    setFileListState([newPdf]);
    if (typeof onReceiveImages === "function") {
      onReceiveImages([newPdf]);
    }
  };

  const handleUploadFailed = (res) => {
    const { file } = res;
    const data = [...fileListState];
    const index = data.findIndex((i) => i?.id === file?.id);
    data.splice(index, 1);

    setFileListState(data);
  };

  const _handleUpload = async (file) => {
    if (file?.type !== "application/pdf") {
      notification.error({
        message: "File không hợp lệ",
      });
      return;
    }

    const { onProgressUpdate } = props;
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
        onUploadProgress(progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          if (onProgressUpdate) {
            onProgressUpdate({
              percent: percentCompleted,
              file: file,
            });
          }
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

  const _handleRemove = () => {
    setFileListState([]);
    onReceiveImages([]);
  };

  return (
    <UploadButton
      disabled={disabled}
      onUpload={_handleUpload}
      onRemove={_handleRemove}
      textDisplay={textDisplay}
      file={fileListState[0]}
      accept={accept}
      mode={mode}
      {...props}
    />
  );
};

export default UploadPdf;
