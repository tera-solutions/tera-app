import React from "react";

export type TQuickActions =
  | "activity-log"
  | "comment"
  | "attachment"
  | "mission"
  | "appointment"
  | "chat"
  | "mail"
  | "call";

export interface IRouteProps {
  key: string;
  path: string;
  component?: React.ReactNode | null;
  actions?: TQuickActions[];
  action_type?: string;
}

export interface IMiddleRouterProps {
  children: any;
}

export type ModuleType =
  | "sales"
  | "purchase"
  | "admin"
  | "portal"
  | "contact"
  | "eshop"
  | "finance"
  | "hrm"
  | "logistics"
  | "marketing"
  | "operation"
  | "warehouse"
  | "master";
