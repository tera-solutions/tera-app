export interface ITeacher {
  id?: number;
  code?: string;
  name?: string;
  type?: string;
  status?: string;
  salary_per_hour?: number;
}

export interface ITeacherForm {
  code: string;
  name: string;
  type?: string;
  status?: string;
  salary_per_hour?: number | string;
}
