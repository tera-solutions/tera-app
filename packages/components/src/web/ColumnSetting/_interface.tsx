export interface IHiddenColumnVariable {
  id: number;
  status: string;
}

export interface ISortColumn {
  id: number;
  order: number;
}

export interface IColumnType {
  [key: string]: any;
  id: number;
  order: number;
  show_desktop: boolean;
}
