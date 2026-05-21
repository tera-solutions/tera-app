import { IRouteProps } from "@tera/commons/interfaces/router";
import FileUploadedPage from ".";
import { FILE_UPLOADED_URL } from "./url";

export const FileUploadedRouter: IRouteProps[] = [
  {
    key: FILE_UPLOADED_URL.list.key,
    path: FILE_UPLOADED_URL.list.shortenUrl,
    component: <FileUploadedPage />,
  },
];
