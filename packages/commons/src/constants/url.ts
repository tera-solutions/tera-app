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

export const PARENT_PAGE_URL = {
  list: {
    key: "",
    path: "/student/parent/list",
    shortenUrl: "/student/parent/list",
  },
  create: {
    key: "",
    path: "/student/parent/create",
    shortenUrl: "/student/parent/create",
  },
  detail: {
    key: "",
    path: (id: number) => "/student/parent/detail/" + id,
    shortenUrl: "/student/parent/detail/:id",
  },
  update: {
    key: "",
    path: (id: number) => "/student/parent/update/" + id,
    shortenUrl: "/student/parent/update/:id",
  },
};

export const LEAD_PAGE_URL = {
  list: {
    key: "",
    path: "/student/lead/list",
    shortenUrl: "/student/lead/list",
  },
  create: {
    key: "",
    path: "/student/lead/create",
    shortenUrl: "/student/lead/create",
  },
  detail: {
    key: "",
    path: (id: number) => "/student/lead/detail/" + id,
    shortenUrl: "/student/lead/detail/:id",
  },
  update: {
    key: "",
    path: (id: number) => "/student/lead/update/" + id,
    shortenUrl: "/student/lead/update/:id",
  },
};

export const PARENT_STUDENT_PAGE_URL = {
  list: {
    key: "",
    path: "/student/parent-student/list",
    shortenUrl: "/student/parent-student/list",
  },
  create: {
    key: "",
    path: "/student/parent-student/create",
    shortenUrl: "/student/parent-student/create",
  },
  detail: {
    key: "",
    path: (id: number) => "/student/parent-student/detail/" + id,
    shortenUrl: "/student/parent-student/detail/:id",
  },
  update: {
    key: "",
    path: (id: number) => "/student/parent-student/update/" + id,
    shortenUrl: "/student/parent-student/update/:id",
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
    path: "/course/lesson/list",
    shortenUrl: "/course/lesson/list",
  },
  create: {
    key: PAGE_KEY.LESSON_CREATE_VIEW,
    path: "/course/lesson/create",
    shortenUrl: "/course/lesson/create",
  },
  detail: {
    key: PAGE_KEY.LESSON_DETAIL_VIEW,
    path: (id: string) => "/course/lesson/detail/" + id,
    shortenUrl: "/course/lesson/detail/:id",
  },
  update: {
    key: PAGE_KEY.LESSON_UPDATE_VIEW,
    path: (id: string) => "/course/lesson/update/" + id,
    shortenUrl: "/course/lesson/update/:id",
  },
};

export const COURSE_PAGE_URL = {
  list: {
    key: PAGE_KEY.COURSE_LIST_VIEW,
    path: "/course/list",
    shortenUrl: "/course/list",
  },
  create: {
    key: PAGE_KEY.COURSE_CREATE_VIEW,
    path: "/course/create",
    shortenUrl: "/course/create",
  },
  detail: {
    key: PAGE_KEY.COURSE_DETAIL_VIEW,
    path: (id: number) => "/course/detail/" + id,
    shortenUrl: "/course/detail/:id",
  },
  update: {
    key: PAGE_KEY.COURSE_UPDATE_VIEW,
    path: (id: number) => "/course/update/" + id,
    shortenUrl: "/course/update/:id",
  },
};

export const ENROLLMENT_PAGE_URL = {
  list: {
    key: "",
    path: "/student/enrollment/list",
    shortenUrl: "/student/enrollment/list",
  },
  create: {
    key: "",
    path: "/student/enrollment/create",
    shortenUrl: "/student/enrollment/create",
  },
  detail: {
    key: "",
    path: (id: number) => "/student/enrollment/detail/" + id,
    shortenUrl: "/student/enrollment/detail/:id",
  },
  update: {
    key: "",
    path: (id: number) => "/student/enrollment/update/" + id,
    shortenUrl: "/student/enrollment/update/:id",
  },
};

export const ATTENDANCE_PAGE_URL = {
  list: {
    key: "",
    path: "/student/attendance/list",
    shortenUrl: "/student/attendance/list",
  },
};

export const CLASS_ROOM_PAGE_URL = {
  list: {
    key: PAGE_KEY.CLASS_ROOM_LIST_VIEW,
    path: "/course/class/list",
    shortenUrl: "/course/class/list",
  },
  create: {
    key: PAGE_KEY.CLASS_ROOM_CREATE_VIEW,
    path: "/course/class/create",
    shortenUrl: "/course/class/create",
  },
  detail: {
    key: PAGE_KEY.CLASS_ROOM_DETAIL_VIEW,
    path: (id: number) => "/course/class/detail/" + id,
    shortenUrl: "/course/class/detail/:id",
  },
  update: {
    key: PAGE_KEY.CLASS_ROOM_UPDATE_VIEW,
    path: (id: number) => "/course/class/update/" + id,
    shortenUrl: "/course/class/update/:id",
  },
};


export const TEACHER_PAGE_URL = {
  list: {
    key: PAGE_KEY.TEACHER_LIST_VIEW,
    path: "/teacher/list",
    shortenUrl: "/teacher/list",
  },
  create: {
    key: PAGE_KEY.TEACHER_CREATE_VIEW,
    path: "/teacher/create",
    shortenUrl: "/teacher/create",
  },
  detail: {
    key: PAGE_KEY.TEACHER_DETAIL_VIEW,
    path: (id: number) => "/teacher/detail/" + id,
    shortenUrl: "/teacher/detail/:id",
  },
  update: {
    key: PAGE_KEY.TEACHER_UPDATE_VIEW,
    path: (id: number) => "/teacher/update/" + id,
    shortenUrl: "/teacher/update/:id",
  },
  certificateCreate: {
    key: PAGE_KEY.TEACHER_DETAIL_VIEW,
    path: (id: number) => `/teacher/${id}/certificate/create`,
    shortenUrl: "/teacher/:id/certificate/create",
  },
  certificateUpdate: {
    key: PAGE_KEY.TEACHER_DETAIL_VIEW,
    path: (id: number, certificateId: number) =>
      `/teacher/${id}/certificate/update/${certificateId}`,
    shortenUrl: "/teacher/:id/certificate/update/:certificateId",
  },
};

export const BRANCH_PAGE_URL = {
  list: {
    key: "",
    path: "/system/branch/list",
    shortenUrl: "/system/branch/list",
  },
  create: {
    key: "",
    path: "/system/branch/create",
    shortenUrl: "/system/branch/create",
  },
  detail: {
    key: "",
    path: (id: number) => "/system/branch/detail/" + id,
    shortenUrl: "/system/branch/detail/:id",
  },
  update: {
    key: "",
    path: (id: number) => "/system/branch/update/" + id,
    shortenUrl: "/system/branch/update/:id",
  },
};

export const USER_PAGE_URL = {
  list: {
    key: "",
    path: "/system/user/list",
    shortenUrl: "/system/user/list",
  },
  create: {
    key: "",
    path: "/system/user/create",
    shortenUrl: "/system/user/create",
  },
  detail: {
    key: "",
    path: (id: number) => "/system/user/detail/" + id,
    shortenUrl: "/system/user/detail/:id",
  },
  update: {
    key: "",
    path: (id: number) => "/system/user/update/" + id,
    shortenUrl: "/system/user/update/:id",
  },
};

export const BUSINESS_PAGE_URL = {
  list: {
    key: "",
    path: "/system/business/list",
    shortenUrl: "/system/business/list",
  },
  create: {
    key: "",
    path: "/system/business/create",
    shortenUrl: "/system/business/create",
  },
  detail: {
    key: "",
    path: (id: number) => "/system/business/detail/" + id,
    shortenUrl: "/system/business/detail/:id",
  },
  update: {
    key: "",
    path: (id: number) => "/system/business/update/" + id,
    shortenUrl: "/system/business/update/:id",
  },
};
