export interface EvaluationSummary {
  totalStudents: number;
  evaluatedRate: number;
  totalComments: number;
  avgRating: number | null;
  satisfactionRate: number;
}

export interface StudentEvaluationRow {
  studentId: number;
  studentCode: string;
  studentName: string;
  classRoomId: number | null;
  className: string;
  status: string;
  avatar: string;
  avgScore: number | null;
  latestComment: string;
  updatedAt: string;
  classificationLabel: string | null;
}

export interface EvaluationEntry {
  id: number;
  targetId: number;
  comment: string;
  evaluatedAt: string;
  classificationLabel: string | null;
  evaluationPeriodLabel: string | null;
}

export interface StudentSkills {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
}

export type PanelTab = 'overview' | 'comments';
