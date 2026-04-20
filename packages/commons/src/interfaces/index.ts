import { Ref } from "react";

export type SpecificTables =
  | "generals"
  | "table_version_logs"
  | "business_locations"
  | "customers";

export type ISyncType = "manual" | "background" | "realtime";
export type ISyncStatus = "queued" | "running" | "completed" | "failed";
export type ISyncAction = "GET" | "CREATE" | "UPDATE" | "DELETE";

export interface IQueueProps {
  type: ISyncType;
  table: SpecificTables;
}

export const SyncStatus = Object.freeze({
  QUEUED: "queued",
  RUNNING: "running",
  COMPLETE: "completed",
  FAILED: "failed",
});

export interface IFileUpload {
  name?: string;
  url?: string;
  id?: number;
}

export interface IPagination {
  page?: number;
  limit?: number;
}
export interface EmployeeCreated {
  code: string;
  full_name: string;
  gender_text: string;
  id: number;
  status_text: string;
  user_id: number;
}

export interface ImportFile {
  file: string;
  overwrite: boolean;
}

export interface ListParams<TFilter = any> {
  page?: number;
  per_page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: TFilter;
}

export interface ITeraFormRef {
  checkError: () => boolean;
  getTotal: () => number;
}

export interface IFormRef {
  isValid: () => boolean;
  submit: () => void;
  isDirty: () => boolean;
}

export type ITypeForm = "create" | "update" | "detail";

export interface IFormProps {
  dataDetail?: any;
  type: ITypeForm;
  ref: Ref<IFormRef>;
}

export interface IModalProps {
  open: boolean;
  type: "create" | "update" | "detail";
  onClose?: () => void;
  onSuccess?: () => void;
  id?: number;
}

export interface ITableProps<T = any> {
  params: ListParams<T>;
  setParams: (value: ListParams<T> | ((prev: ListParams<T>) => ListParams<T>)) => void;
  setModalData: (data: IModalProps) => void
}
