export type PlacementTestStatus = "draft" | "published";

export interface PlacementTestRow {
  id: number;
  code: string;
  title: string;
  description: string | null;
  cefrLevel: string | null;
  skills: string[];
  questionCount: number;
  durationMinutes: number;
  status: PlacementTestStatus;
  attempts: number;
  avgScore: number | null;
  completionRate: number;
  createdAt: string | null;
}

export interface PlacementTestResultRow {
  id: number;
  studentId: number;
  studentName: string | null;
  score: number | null;
  cefrResult: string | null;
  completionRate: number;
  status: string;
  completedAt: string | null;
}

export interface PlacementTestOverview {
  totalTests: number;
  totalAttempts: number;
  totalCompleted: number;
  completionRate: number;
  avgScore: number;
  cefrDistribution: Record<string, number>;
}
