import { ExamDetailStats, ExamResultRow, ExamScoreSummary } from '../../types';
import ExamStatsRow from '../ExamStatsRow';
import ProgressSection from '../ProgressSection';
import ScoreSummarySection from '../ScoreSummarySection';
import RecentSubmissions from '../RecentSubmissions';

interface Props {
  stats: ExamDetailStats;
  scoreSummary: ExamScoreSummary;
  rows: ExamResultRow[];
  examDate: string;
  onViewAllStudents?: () => void;
}

export default function OverviewTab({ stats, scoreSummary, rows, examDate, onViewAllStudents }: Props) {
  return (
    <>
      <ExamStatsRow stats={stats} />
      <ProgressSection percent={stats.submittedPercent} updatedAt={examDate} />
      <ScoreSummarySection summary={scoreSummary} />
      <RecentSubmissions rows={rows} maxScore={scoreSummary.totalScore} onViewAll={onViewAllStudents} />
    </>
  );
}
