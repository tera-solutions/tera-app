import { portalEndpoint } from "@tera/api/_endpoint";
import { rootStore } from "@tera/states/stores";
import Axios from "axios";

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise(async (resolve, reject) => {
          const form = new FormData();
          form.append("upload", file);
          form.append("app_id", 2);
          form.append("folder", "ckeditor");
          form.append("ckCsrfToken", "tera");
          form.append("secure_code", "tera");

          try {
            const authToken =
              rootStore.globalStore.token || rootStore.authStore.token;
            const deviceCode =
              rootStore.globalStore.device || rootStore.authStore.device;
            const result = await Axios({
              method: "POST",
              url: `${portalEndpoint}/file/ckeditor-upload`,
              data: form,
              headers: {
                authorization: authToken ? `Bearer ${authToken}` : "",
                "device-code": deviceCode,
              },
            });
            if (result?.data?.code !== 200) reject(result?.data?.msg);
            resolve({ default: result?.data?.data.default });
          } catch (error) {
            reject(error.message);
          }
        }),
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", `${portalEndpoint}/file/ckeditor-upload`, true);
    xhr.responseType = "json";
  }

  _initListeners(resolve, reject, file) {
    const { xhr } = this;
    const { loader } = this;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const { response } = xhr;

      if (!response || response.error) {
        return reject(
          response && response.error
            ? response.error.message
            : genericErrorText,
        );
      }

      console.log("response", response);

      resolve(response.data);
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    const data = new FormData();

    data.append("upload", file);
    data.append("ckCsrfToken", "remix");

    this.xhr.send(data);
  }
}

export default MyUploadAdapter;
