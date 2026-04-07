import { ReactNode } from "react";
import { TableProps } from "tera-dls";

export interface IEditable {
  editableKey?: string | undefined;
  onEditableKeyChange?: (val) => void;
  onValuesChange?: (record, recordList) => void;
  actionRender?: (row, defaultDom) => void;
  onUpdate?: (record) => void;
  onAdd?: (record) => void;
  onDelete?: (record, index?: number) => void;
  buttonEditIndicator?: ReactNode;
  buttonDeleteIndicator?: ReactNode;
  buttonSaveIndicator?: ReactNode;
  buttonCancelIndicator?: ReactNode;
  saveOnClickOut?: boolean;
  isDisabled?: boolean;
}

export interface IRecordCreator {
  position?: "top" | "bottom";
  record: (length: number) => { [key: string]: any };
}

export interface IPagination {
  onChange?: (page: number, pageSize: number) => void;
  current?: number;
  pageSize?: number;
  defaultPageSize?: number;
  total?: number;
  to?: number;
  from?: number;
  [key: string]: any;
}

export interface ILoadingIndicator {
  loading?: boolean;
  indicator?: ReactNode;
}
export interface ITeraTableProps extends TableProps {
  objectType?: string;
  objectId?: number;
  formObjectType?: string;
  formObjectId?: number;
  data: any;
  actionRef?: any;
  editable?: IEditable;
  recordCreatorProps?: IRecordCreator;
  mode?: "editable-cell" | "table" | "editable-row";
  pagination?: IPagination | boolean;
  middleChildren?: ReactNode;
  loadingIndicator?: ILoadingIndicator;
  wrapperProps?: any;
  wrapperClassName?: string;
  [key: string]: any;
}

export interface ITableRowActionRef {
  editRow: (record: any) => void;
  cancelRow: () => void;
  saveRow: () => void;
  addRow: () => void;
  deleteRow: (targetKey: string) => void;
  trigger: () => void;
}
