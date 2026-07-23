export interface ParentChildRef {
  id: number;
  name: string;
  class_id: number;
  class_name: string;
}

export interface RosterEntry {
  class_id: number;
  class_name: string;
}

export interface ParentRow {
  id: number;
  name: string;
  avatar: string;
  relation: string;
  phone: string;
  email: string;
  children: ParentChildRef[];
}

export interface ParentSummary {
  total_parents: number;
  total_children: number;
  total_classes: number;
}

export interface ParentFormValues {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  branch_id: number | undefined;
  relation: string;
  student_id: number | undefined;
}
