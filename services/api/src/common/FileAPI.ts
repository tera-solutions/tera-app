import Axios from "axios";
import { rootStore } from "@tera/stores";
import { fileEndpoint } from "@tera/api/_endpoint";

export interface UploadedFile {
  id: string | number;
  url: string;
  name: string;
  size: number;
}

export interface DownloadedFile {
  id: string | number;
  name: string;
  type: string;
  src: string;
}

/** Drops the extension from a filename, e.g. `apple.jpg` -> `apple`. */
export const stripExtension = (name: string): string =>
  name.replace(/\.[^./\\]+$/, "");

const authHeaders = () => {
  const { token, device } = rootStore.globalStore;
  return {
    authorization: token ? `Bearer ${token}` : "",
    "device-code": device,
    accept: "application/json",
  };
};

export const FileAPI = {
  upload: async (
    file: File,
    meta?: { title?: string; description?: string },
  ): Promise<UploadedFile> => {
    const form = new FormData();
    form.append("file", file);
    form.append("app_id", "2");
    form.append("secure_code", "tera");
    if (meta?.title) form.append("title", meta.title);
    if (meta?.description) form.append("description", meta.description);

    const result = await Axios.post(`${fileEndpoint}/upload`, form, {
      headers: authHeaders(),
    });

    return {
      id: result?.data?.data?.id,
      url: result?.data?.data?.image,
      name: file.name,
      size: file.size,
    };
  },

  download: async (id: string | number): Promise<DownloadedFile> => {
    const result = await Axios.get(`${fileEndpoint}/download/${id}`, {
      headers: authHeaders(),
    });

    return {
      id: result?.data?.detail?.id,
      name: result?.data?.detail?.file_name,
      type: result?.data?.detail?.file_type,
      src: result?.data?.src,
    };
  },
};
