import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import moment from "moment";
import {
  AcademicCapOutlined,
  CheckBadgeOutlined,
  ChartBarOutlined,
  ChatBubbleLeftRightOutlined,
  UsersOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import StatisticCard from "_common/components/StatisticCard";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { StudentAPI } from "@tera/api";
import { ClassRoomService, EvaluationService, StudentService } from "@tera/modules/education";

import type { RankingTab } from "./_interface";
import { RANKING_TABS } from "./constants";
import { rankedByScore, scoreHistogram, summarize, toProgressRows, toRankingRows } from "./_utils";
import RankingTable from "./components/RankingTable";
import Top3Cards from "./components/Top3Cards";
import ScoreHistogram from "./components/ScoreHistogram";
import MonthFilter from "./components/MonthFilter";
import ProgressTable from "./components/ProgressTable";
import GroupCompare from "./components/GroupCompare";

const Ranking = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<RankingTab>("overall");
  const [month, setMonth] = useState(moment().format("YYYY-MM"));

  const studentsQuery = StudentService.useStudentList({ params: { per_page: 200 } });
  const evaluationsQuery = EvaluationService.useEvaluationList({
    params: { per_page: 500, filters: { evaluation_type: "student" } },
  });
  const isLoading = studentsQuery.isLoading || evaluationsQuery.isLoading;
  const isError = studentsQuery.isError || evaluationsQuery.isError;

  // Same roster-scan workaround as the Feedback page: student list/detail
  // carries no class field for the teacher role, so each student's class is
  // resolved by scanning the teacher's own classes' rosters.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => classesQuery.data?.data?.items ?? [], [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ["ranking", "class-roster", c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: classes.length > 0,
    })),
  });

  const studentClassMap = useMemo(() => {
    const map = new Map<number, string>();
    classes.forEach((c: any, i: number) => {
      const items = (rosterQueries[i]?.data as any)?.data?.items ?? [];
      items.forEach((s: any) => {
        if (!map.has(s.id)) map.set(s.id, c.name);
      });
    });
    return map;
  }, [classes, rosterQueries]);

  const evaluationItems = evaluationsQuery.data?.data?.items ?? [];
  const rows = useMemo(
    () => toRankingRows(studentsQuery.data?.data?.items, evaluationItems, studentClassMap, month),
    [studentsQuery.data, evaluationItems, studentClassMap, month],
  );
  const ranked = useMemo(() => rankedByScore(rows), [rows]);
  const summary = useMemo(() => summarize(rows, classes.length), [rows, classes]);
  const histogram = useMemo(() => scoreHistogram(rows), [rows]);
  const progressRows = useMemo(() => toProgressRows(rows), [rows]);

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Bảng xếp hạng học tập</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Xếp hạng học viên theo điểm đánh giá của các lớp bạn phụ trách
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatisticCard
          icon={<UsersOutlined />}
          value={summary.total_students}
          label="Tổng HV"
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ChartBarOutlined />}
          value={summary.avg_score || "—"}
          label="Điểm TB"
          iconClassName="bg-violet-50 text-violet-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<AcademicCapOutlined />}
          value={summary.total_classes}
          label="Tổng lớp"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={`${summary.good_rate}%`}
          label="Tỷ lệ khá giỏi"
          sublabel="Điểm từ 8 trở lên"
          iconClassName="bg-amber-50 text-amber-500"
          loading={isLoading}
        />
      </div>

      <Card animated={false} className="mb-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {RANKING_TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                tab === item.key ? "bg-sky-50 text-brand" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {tab === "overall" && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
          <Card>
            <RankingTable rows={ranked} isLoading={isLoading} isError={isError} onRetry={() => {
              studentsQuery.refetch();
              evaluationsQuery.refetch();
            }} />
          </Card>

          <div className="flex flex-col gap-4">
            <Top3Cards top3={ranked.slice(0, 3)} />
            <ScoreHistogram buckets={histogram} />
            <MonthFilter value={month} onChange={setMonth} />
          </div>
        </div>
      )}

      {tab === "progress" && (
        <Card>
          <ProgressTable rows={progressRows} isLoading={isLoading} />
        </Card>
      )}

      {tab === "group" && <GroupCompare rows={ranked} />}

      {tab === "evaluation" && (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <ChatBubbleLeftRightOutlined className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">
              Xem và gửi nhận xét chi tiết cho từng học viên tại trang Nhận xét
            </p>
            <button
              type="button"
              onClick={() => navigate(PATHS.comments)}
              className="rounded-full bg-sky-50 px-4 py-1.5 text-xs font-medium text-brand hover:bg-sky-100"
            >
              Đi tới Nhận xét & Đánh giá
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Ranking;
