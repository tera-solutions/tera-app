export interface IParentStudentHistory {
  id?: number;
  user?: { id?: number; name?: string; full_name?: string };
  changed_by?: string | { id?: number; name?: string; full_name?: string };
  content?: string;
  description?: string;
  created_at?: string;
}

export interface IParentStudentLink {
  id?: number;
  parent_id?: number;
  parent_code?: string;
  parent?: {
    id?: number;
    code?: string;
    name?: string;
    status?: string;
    phone?: string;
    email?: string;
  };
  parent_status?: string;
  student_id?: number;
  student_code?: string;
  student?: {
    id?: number;
    code?: string;
    name?: string;
    status?: string;
    level_id?: number;
    level?: { id?: number; name?: string };
    class_name?: string;
    class?: { id?: number; name?: string };
  };
  student_status?: string;
  relation?: string;
  is_primary_contact?: boolean | number;
  is_billing_contact?: boolean | number;
  is_pickup_authorized?: boolean | number;
  note?: string;
  histories?: IParentStudentHistory[];
  logs?: IParentStudentHistory[];
  change_logs?: IParentStudentHistory[];
  created_at?: string;
}

export interface IParentStudentLinkForm {
  parent_id?: number | string;
  student_id?: number | string;
  relation?: string;
  is_primary_contact?: boolean;
  is_billing_contact?: boolean;
  is_pickup_authorized?: boolean;
  note?: string;
}
