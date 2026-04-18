/* Auto generate interface */

export interface ILesson {
  id?: number;
  code?: string;
  name?: string;
  level?: number;
  status?: string;
}

export interface ILessonForm {
  code: string;
  name: string;
  level: number;
  status: string;
}
