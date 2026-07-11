import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import ErrorRetry from "_common/components/ErrorRetry";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { AssignmentService, SubmissionService } from "@tera/modules/education";

import type { SubmissionRow } from "./_interface";
import { toAssignmentHeader, toSubmissionDetail, toSubmissionRows } from "./_utils";
import SubmissionViewer from "./components/SubmissionViewer";
import GradingForm from "./components/GradingForm";
import StudentSubmissionList from "./components/StudentSubmissionList";

const Grading = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const assignmentId = id ? Number(id) : null;

  const [filters, setFilters] = useUrlFilters({
    studentId: { type: "number", default: undefined as number | undefined, param: "student_id" },
  });

  const detailQuery = AssignmentService.useAssignmentDetail({ id: assignmentId ?? "" });
  const header = useMemo(() => toAssignmentHeader(detailQuery.data?.data), [detailQuery.data]);

  const rosterQuery = SubmissionService.useSubmittedList({
    assignmentId: assignmentId ?? "",
    params: { per_page: 100 },
  });
  const rows = useMemo(
    () => toSubmissionRows(rosterQuery.data?.data?.items),
    [rosterQuery.data],
  );

  const selected = useMemo(
    () => rows.find((row) => row.student_id === filters.studentId) ?? null,
    [rows, filters.studentId],
  );

  // No student pre-selected via URL yet — default to the first submission
  // once the roster loads, and reflect it in the URL for deep-linking.
  useEffect(() => {
    if (filters.studentId != null || rows.length === 0) return;
    setFilters({ studentId: rows[0].student_id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, filters.studentId]);

  const setSelected = (row: SubmissionRow) => setFilters({ studentId: row.student_id });

  const submissionQuery = SubmissionService.useSubmissionDetail({ id: selected?.id ?? "" });
  const submission = useMemo(
    () => (submissionQuery.data?.data ? toSubmissionDetail(submissionQuery.data.data) : undefined),
    [submissionQuery.data],
  );

  const notFound = !detailQuery.isLoading && (detailQuery.isError || !header?.id);

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Bài tập", onClick: () => navigate(PATHS.assignment) },
          { label: `Chấm bài${header ? `: ${header.name}` : ""}` },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => detailQuery.refetch()}
            message="Không tìm thấy bài tập hoặc bạn không có quyền truy cập"
            secondaryAction={{ label: "Về danh sách bài tập", onClick: () => navigate(PATHS.assignment) }}
          />
        </div>
      ) : (
        <Spin spinning={detailQuery.isLoading}>
          {header && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_320px]">
              <SubmissionViewer
                submission={submission}
                isLoading={submissionQuery.isLoading}
                isError={submissionQuery.isError}
                onRetry={() => submissionQuery.refetch()}
                hasSelection={!!selected}
              />

              <GradingForm
                submission={submission}
                maxScore={header.max_score}
                hasSelection={!!selected}
                onGraded={() => {
                  rosterQuery.refetch();
                  submissionQuery.refetch();
                }}
              />

              <StudentSubmissionList
                rows={rows}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
                maxScore={header.max_score}
                isLoading={rosterQuery.isLoading}
                isError={rosterQuery.isError}
                onRetry={() => rosterQuery.refetch()}
              />
            </div>
          )}
        </Spin>
      )}
    </div>
  );
};

export default Grading;
