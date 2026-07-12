export type LessonApiStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type LessonStatusTab = 'all' | LessonApiStatus;

export type LessonPlanApiStatus = 'draft' | 'reviewing' | 'published' | 'archived';

export interface LessonPlanDetailInfo {
  id: number;
  planCode: string;
  planName: string;
  courseName: string;
  levelName: string;
  version: number;
  description: string;
  status: LessonPlanApiStatus;
}

export interface LessonTemplateSummary {
  id: number;
  lessonNo: number;
  lessonTitle: string;
  duration: number;
  objectiveCount: number;
  activitiesCount: number;
  materialsCount: number;
}

export interface ClassroomOption {
  id: number;
  name: string;
  coverImage?: string | null;
}

export interface LessonRow {
  id: number;
  lessonNo: number;
  lessonTitle: string;
  date: string;
  duration: number;
  status: LessonApiStatus;
  isLocked: boolean;
}
