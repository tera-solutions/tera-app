export interface ICourse {
  id?: number;
  code?: string;
  name?: string;
  level_id?: number;
  program_id?: number;
  duration?: number;
  price?: number;
}

export interface ICourseForm {
  code: string;
  name: string;
  level_id: number;
  program_id: number;
  duration: number;
  price: number;
}
