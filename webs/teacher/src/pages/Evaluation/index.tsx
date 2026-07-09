import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { CheckBadgeOutlined, ChatBubbleLeftRightOutlined, StarOutlined, UsersOutlined } from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";
import { StudentAPI } from "@tera/api";
import { ClassRoomService, EvaluationService, StudentService } from "@tera/modules/education";

import type { StudentEvaluationRow } from "./_interface";
import { toEvaluationSummary, toStudentEvaluationRows } from "./_utils";
import StudentEvaluationTable from "./components/StudentEvaluationTable";
import StudentDetailPanel from "./components/StudentDetailPanel";
import EvaluationForm from "./components/EvaluationForm";

const Evaluation = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentEvaluationRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  const summaryQuery = EvaluationService.useEvaluationStudentSummary();
  const summary = useMemo(
    () => toEvaluationSummary(summaryQuery.data?.data),
    [summaryQuery.data],
  );

  const studentsQuery = StudentService.useStudentList({ params: { per_page: 100 } });
  const evaluationsQuery = EvaluationService.useEvaluationList({
    params: { filters: { evaluation_type: "student" } },
  });
  const isLoading = studentsQuery.isLoading || evaluationsQuery.isLoading;
  const isError = studentsQuery.isError || evaluationsQuery.isError;
  const refetch = () => {
    studentsQuery.refetch();
    evaluationsQuery.refetch();
  };

  const evaluationItems = evaluationsQuery.data?.data?.items ?? [];

  // The student list/detail endpoints carry no class field (crm/enrollment is
  // admin-only for the teacher role), so each student's class is found by
  // scanning the teacher's own classes' rosters — same fix as the student
  // detail page's "Lớp học hiện tại" table.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => classesQuery.data?.data?.items ?? [], [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ["feedback", "class-roster", c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: classes.length > 0,
    })),
  });

  const studentClassMap = useMemo(() => {
    const map = new Map<number, number>();
    classes.forEach((c: any, i: number) => {
      const items = (rosterQueries[i]?.data as any)?.data?.items ?? [];
      items.forEach((s: any) => {
        if (!map.has(s.id)) map.set(s.id, c.id);
      });
    });
    return map;
  }, [classes, rosterQueries]);

  const rows = useMemo(
    () => toStudentEvaluationRows(studentsQuery.data?.data?.items, evaluationItems, studentClassMap),
    [studentsQuery.data, evaluationItems, studentClassMap],
  );
  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((r) => r.student_name.toLowerCase().includes(keyword));
  }, [rows, search]);

  const selectedRow = rows.find((r) => r.student_id === selectedStudent?.student_id) ?? null;

  // Deep-link from the student list / classroom roster ("Nhận xét" action):
  // `?student_id=` pre-selects the student and opens the evaluation form once
  // the rows have loaded.
  const [searchParams] = useSearchParams();
  const presetStudentId = searchParams.get("student_id");
  const presetApplied = useRef(false);
  useEffect(() => {
    if (presetApplied.current || !presetStudentId || rows.length === 0) return;
    const row = rows.find((r) => r.student_id === Number(presetStudentId));
    if (row) {
      setSelectedStudent(row);
      setFormOpen(true);
      presetApplied.current = true;
    }
  }, [presetStudentId, rows]);

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Nhận xét & Đánh giá</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Theo dõi tiến bộ và gửi nhận xét giúp học viên phát triển tốt hơn
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <StatisticCard
          icon={<UsersOutlined />}
          value={summary.total_students}
          label="Học viên"
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={`${summary.evaluated_rate}%`}
          label="Đã đánh giá"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ChatBubbleLeftRightOutlined />}
          value={summary.total_comments}
          label="Nhận xét"
          iconClassName="bg-violet-50 text-violet-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<StarOutlined />}
          value={summary.avg_rating ?? "—"}
          label="Đánh giá TB"
          iconClassName="bg-amber-50 text-amber-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={`${summary.satisfaction_rate}%`}
          label="Hài lòng"
          iconClassName="bg-cyan-50 text-cyan-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <Card>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm học viên..."
            wrapperClassName="mb-3"
          />
          <StudentEvaluationTable
            rows={filteredRows}
            selectedId={selectedStudent?.student_id ?? null}
            onSelect={setSelectedStudent}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
        </Card>

        <div className="flex flex-col gap-4">
          <StudentDetailPanel
            student={selectedRow}
            rows={rows}
            evaluations={evaluationItems}
            onAddEvaluation={() => setFormOpen(true)}
          />
        </div>
      </div>

      <EvaluationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        studentId={selectedRow?.student_id ?? null}
        studentName={selectedRow?.student_name}
        classId={selectedRow?.class_room_id ?? null}
      />
    </div>
  );
};

export default Evaluation;
