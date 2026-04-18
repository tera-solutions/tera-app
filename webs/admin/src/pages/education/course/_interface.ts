/* Auto generate interface */

export interface ICourse {
  id?: number;
  code?: string;
  name?: string;
  level?: number;
  status?: string;
}

export interface ICourseForm {
  code: string;
  name: string;
  level: number;
  status: string;
}
