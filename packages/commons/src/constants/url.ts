import { PAGE_KEY, PURCHASE_REQUEST_PERMISSION_KEY } from "./permission";

export const DASHBOARD_URL = {
  list: {
    key: PAGE_KEY.DASHBOARD_LIST_VIEW,
    path: "/dashboard",
    shortenUrl: "",
  },
  create: {
    key: PAGE_KEY.DASHBOARD_LIST_CREATE,
    path: "/dashboard/create",
    shortenUrl: "create",
  },
};

export const PURCHASE_REQUEST_URL = {
  list: {
    key: PURCHASE_REQUEST_PERMISSION_KEY.PURCHASE_REQUEST_LIST,
    path: "/purchase/purchase-request/list",
    shortenUrl: "list",
  },
  create: {
    key: PURCHASE_REQUEST_PERMISSION_KEY.PURCHASE_REQUEST_CREATE,
    path: "/purchase/purchase-request/create",
    shortenUrl: "create",
  },
  update: {
    key: PURCHASE_REQUEST_PERMISSION_KEY.PURCHASE_REQUEST_UPDATE,
    path: "/purchase/purchase-request/update",
    shortenUrl: "update/:id",
  },
  detail: {
    key: PURCHASE_REQUEST_PERMISSION_KEY.PURCHASE_REQUEST_DETAIL,
    path: "/purchase/purchase-request/detail",
    shortenUrl: "detail/:id",
  },
};

export const EPIC_KEY_URL = {
  DASHBOARD: "/dashboard",
  USER_LIST: "/user",
  BUSINESS_LIST: "business",
  MODULE_LIST: "/module",
  CONFIG_DATA: "/system/config-data",
  CONFIG_STATUS: "/system/config-status",
  CONFIG_APPLICATION: "/system/config-application",
  CONFIG_DEPARTMENT: "/system/config-department",
  CONFIG_POSITION: "/system/config-position",
  CONFIG_JOB_TITLE: "/system/config-job-title",
  CONFIG_PERMISSION: "/system/config-permission",
  MANAGE_EPIC: "/system/manage-epic",
  MANAGE_MODULE: "/system/manage-module",
  MANAGE_GROUP_CONTROL: "/system/manage-group-control",
};

export const EPIC_URL = {
  CONFIG_DATA: "/system/config-data",
  CONFIG_STATUS: "/system/config-status",
  CONFIG_APPLICATION: "/system/config-application",
  CONFIG_DEPARTMENT: "/system/config-department",
  CONFIG_POSITION: "/system/config-position",
  CONFIG_JOB_TITLE: "/system/config-job-title",
  CONFIG_PERMISSION: "/system/config-permission",
  MANAGE_PAGE: "/system/manage-page",
  CONFIG_APPROVAL: "/system/config-approval",
};

export const CONFIG_DATA_URL = {
  list: {
    key: PAGE_KEY.CONFIG_DATA_LIST_VIEW,
    path: "/system/config-data",
    shortenUrl: "",
  },
};

export const CONFIG_STATUS_URL = {
  list: {
    key: PAGE_KEY.CONFIG_STATUS_LIST_VIEW,
    path: "/system/config-status",
    shortenUrl: "",
  },
};

export const CONFIG_APPLICATION_URL = {
  list: {
    key: PAGE_KEY.CONFIG_APPLICATION_LIST_VIEW,
    path: "/system/config-application",
    shortenUrl: "",
  },
};

export const CONFIG_DEPARTMENT_URL = {
  list: {
    key: PAGE_KEY.CONFIG_DEPARTMENT_LIST_VIEW,
    path: "/system/config-department",
    shortenUrl: "",
  },
};
export const CONFIG_POSITION_URL = {
  list: {
    key: PAGE_KEY.CONFIG_POSITION_LIST_VIEW,
    path: "/system/config-position",
    shortenUrl: "",
  },
};
export const CONFIG_JOB_TITLE_URL = {
  list: {
    key: PAGE_KEY.CONFIG_JOB_TITLE_LIST_VIEW,
    path: "/system/config-job-title",
    shortenUrl: "",
  },
};
export const CONFIG_PERMISSION_URL = {
  list: {
    key: PAGE_KEY.CONFIG_PERMISSION_LIST_VIEW,
    path: "/system/config-permission",
    shortenUrl: "",
  },
  setting: {
    key: PAGE_KEY.CONFIG_PERMISSION_LIST_SETTING,
    path: "/system/config-permission/setting",
    shortenUrl: "setting/:id",
  },
};

export const STUDENT_PAGE_URL = {
  list: {
    key: PAGE_KEY.STUDENT_LIST_VIEW,
    path: "/student/list",
    shortenUrl: "/student/list",
  },
  create: {
    key: PAGE_KEY.STUDENT_CREATE_VIEW,
    path: "/student/create",
    shortenUrl: "/student/create",
  },
  detail: {
    key: PAGE_KEY.STUDENT_DETAIL_VIEW,
    path: (id: number) => `/student/detail/${id}`,
    shortenUrl: "/student/detail/:id",
  },
  update: {
    key: PAGE_KEY.STUDENT_UPDATE_VIEW,
    path: (id: number) => `/student/update/${id}`,
    shortenUrl: "/student/update/:id",
  },
};

export const MANAGE_PAGE_URL = {
  list: {
    key: PAGE_KEY.MANAGE_PAGE_LIST_VIEW,
    path: "/system/manage-page",
    shortenUrl: "",
  },
  detail: {
    key: PAGE_KEY.MANAGE_PAGE_LIST_VIEW_DETAIL,
    path: "/system/manage-page",
    shortenUrl: ":pageId",
  },
  columnConfig: {
    key: PAGE_KEY.COLUMN_CONFIG_LIST_VIEW,
    path: "/system/manage-page",
    shortenUrl: ":pageId/column-config/:tableId",
  },
  tableConfig: {
    key: PAGE_KEY.MANAGE_PAGE_TABLE_CONFIG,
    path: (id: string) => `/system/manage-page/table-config/${id}`,
    shortenUrl: "table-config/:id",
  },
  tableConfigDetail: {
    key: PAGE_KEY.MANAGE_PAGE_TABLE_CONFIG_DETAIL,
    path: "/system/manage-page",
    shortenUrl: ":pageId/table-config-detail/:tableId",
  },
  controlConfig: {
    key: PAGE_KEY.MANAGE_PAGE_CONTROL_CONFIG,
    path: "/system/manage-page/control-config",
    shortenUrl: "control-config/:pageId",
  },
};

export const MANAGE_PAGE_CONFIG_FORM_URL = {
  list: {
    key: PAGE_KEY.MANAGE_PAGE_CONFIG_FORM,
    path: "/system/manage-page/config-form",
    shortenUrl: "config-form/:pageId",
  },
  detail: {
    key: PAGE_KEY.MANAGE_PAGE_CONFIG_FORM_DETAIL,
    path: "/system/manage-page/config-form/detail",
    shortenUrl: "config-form/:pageId/detail/:formId",
  },
  configField: {
    key: PAGE_KEY.MANAGE_PAGE_CONFIG_FIELD,
    path: "/system/manage-page/config-field",
    shortenUrl: ":pageId/config-field/:formId",
  },
};

export const BUSINESS_URL = {
  list: {
    key: PAGE_KEY.BUSINESS_LIST_VIEW,
    path: "/business-management/business/list",
    shortenUrl: "business/list",
  },
  create: {
    key: PAGE_KEY.BUSINESS_CREATE,
    path: "/business-management/business/create",
    shortenUrl: "business/create",
  },
  update: {
    key: PAGE_KEY.BUSINESS_UPDATE,
    path: "/business-management/business/update",
    shortenUrl: "business/update/:id",
  },
  detail: {
    key: PAGE_KEY.BUSINESS_DETAIL,
    path: "/business-management/business/detail",
    shortenUrl: "business/detail/:id",
  },
};

export const USER_URL = {
  list: {
    key: PAGE_KEY.USER_VIEW,
    path: "/user/list",
    shortenUrl: "list",
  },
  detail: {
    key: PAGE_KEY.USER_DETAIL,
    path: "/user/detail",
    shortenUrl: "detail/:id",
  },
};

export const MODULE_LIST_URL = {
  list: {
    key: PAGE_KEY.MODULE_LIST_VIEW,
    path: "/module/list",
    shortenUrl: "list",
  },
};

export const MODULE_URL = {
  list: {
    key: PAGE_KEY.MODULE_LIST_VIEW,
    path: "/system/manage-module",
    shortenUrl: "",
  },
};

export const GROUP_CONTROL_URL = {
  list: {
    key: PAGE_KEY.GROUP_CONTROL_LIST_VIEW,
    path: "/system/manage-group-control",
    shortenUrl: "",
  },
};

export const FILE_MANAGEMENT_URL = {
  list: {
    key: PAGE_KEY.FILE_MANAGEMENT_LIST_VIEW,
    path: "/file-management",
    shortenUrl: "",
  },
  detail: {
    key: PAGE_KEY.FILE_MANAGEMENT_LIST_DETAIL,
    path: "/file-management/detail",
    shortenUrl: "detail/:id",
  },
};

export const CART_URL = "/cart";


export const LESSON_PAGE_URL = {
  list: {
    key: PAGE_KEY.LESSON_LIST_VIEW,
    path: "/lesson/list",
    shortenUrl: "/lesson/list",
  },
  create: {
    key: PAGE_KEY.LESSON_CREATE_VIEW,
    path: "/lesson/create",
    shortenUrl: "/lesson/create",
  },
  detail: {
    key: PAGE_KEY.LESSON_DETAIL_VIEW,
    path: (id: string) => "/lesson/detail/" + id,
    shortenUrl: "/lesson/detail/:id",
  },
  update: {
    key: PAGE_KEY.LESSON_UPDATE_VIEW,
    path: (id: string) => "/lesson/update/" + id,
    shortenUrl: "/lesson/update/:id",
  },
};
