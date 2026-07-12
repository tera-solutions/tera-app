export interface PlanSummary {
  id: number;
  planName: string;
  planCode: string;
  courseName: string;
  levelName: string;
}

export interface ClassroomOption {
  id: number;
  name: string;
  courseName: string;
  startDate: string;
  endDate: string;
}
