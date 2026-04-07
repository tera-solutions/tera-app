import { ReactNode } from "react";

export interface IMenu {
  key?: string;
  isDisplay?: boolean;
  iconNode?: ReactNode;
  name?: string;
  title?: string;
  path?: string;
  icon?: any;
  id?: number | string;
  code?: string;
  [key: string]: any;
}
export type SubMenu = {
  [key: string]: IMenu[];
};

export interface TypeMoreMenu extends IMenu {
  img?: { src?: string; alt?: string };
}
