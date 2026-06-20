export interface AchievementSummary {
  id: string;
  title: string;
  value: number;
  color: string;
}

export interface AchievementCategory {
  id: string;
  title: string;
  icon: string;
  totalStudents: number;
  color: string;
}

export interface StudentRanking {
  id: string;
  rank: number;
  avatar: string;
  name: string;
  className: string;
  score: number;
  achievements: string[];
}

export interface Certificate {
  id: string;
  title: string;
  studentName: string;
  issueDate: string;
  image: string;
}

export interface RankingTag {
  label: string;
  color?: string;
  backgroundColor?: string;
}
