import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  ArrowDownTrayOutlined,
  Button,
  CheckBadgeOutlined,
  ClipboardDocumentListOutlined,
  DocumentTextOutlined,
  PencilSquareOutlined,
  Spin,
  TrashOutlined,
  UsersOutlined,
  notification,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import StatisticCard from "_common/components/StatisticCard";
import StatusBadge from "_common/components/StatusBadge";
import { PATHS } from "_common/components/Layout/Menu/menus";
import useConfirm from "_common/hooks/useConfirm";
import { useMeta } from "_common/hooks/useMeta";
import { AssignmentService, MaterialService, SubmissionService } from "@tera/modules/education";
import { FileAPI } from "@tera/api/common/FileAPI";

import { ASSIGNMENT_STATUS_META, ASSIGNMENT_TYPE_META } from "pages/Assignment/constants";
import { toSubmissionRows } from "pages/Grading/_utils";
import StudentSubmissionList from "pages/Grading/components/StudentSubmissionList";
import UploadAttachment from "pages/Assignment/components/UploadAttachment";

import { toAssignmentAttachments, toAssignmentDetail } from "./_utils";

const AssignmentDetailPage = () => {
  const navigate = useNavigate();
  const { getLabel } = useMeta();
  const confirm = useConfirm();
  const { id } = useParams<{ id: string }>();
  const assignmentId = id ? Number(id) : null;

  const detailQuery = AssignmentService.useAssignmentDetail({ id: assignmentId ?? "" });
  const assignment = useMemo(() => toAssignmentDetail(detailQuery.data?.data), [detailQuery.data]);
  const notFound = !detailQuery.isLoading && (detailQuery.isError || !assignment?.id);

  const attachmentsQuery = MaterialService.useMaterialList(
    { params: { per_page: 50, filters: { entity_type: "assignment", entity_id: assignmentId } } },
    { enabled: !!assignmentId },
  );
  const attachments = useMemo(
    () => toAssignmentAttachments(attachmentsQuery.data?.data?.items),
    [attachmentsQuery.data],
  );

  const { mutate: deleteMaterial } = MaterialService.useMaterialDelete();
  const handleDeleteAttachment = (attachmentId: number, name: string) => {
    confirm.warning({
      title: "Xóa tài liệu",
      content: (
        <p>
          Bạn có chắc muốn xóa tài liệu <b>{name}</b>?
        </p>
      ),
      onOk: () =>
        deleteMaterial(
          { id: attachmentId },
          {
            onSuccess: () => {
              notification.success({ message: "Xóa tài liệu thành công" });
              attachmentsQuery.refetch();
            },
            onError: (error: any) =>
              notification.error({
                message: error?.data?.msg ?? error?.message ?? "Không thể xóa tài liệu",
              }),
          },
        ),
    });
  };

  const rosterQuery = SubmissionService.useSubmittedList({
    assignmentId: assignmentId ?? "",
    params: { per_page: 100 },
  });
  const rows = useMemo(() => toSubmissionRows(rosterQuery.data?.data?.items), [rosterQuery.data]);

  const handleDownload = async (fileId: number | null, name: string) => {
    if (!fileId) return;
    try {
      const file = await FileAPI.download(fileId);
      const link = document.createElement("a");
      link.href = file.src;
      link.download = file.name || name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Non-critical: the panel above still lets the teacher retry from the list.
    }
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Bài tập", onClick: () => navigate(PATHS.assignment) },
          { label: "Chi tiết bài tập" },
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
          {assignment && (
            <div className="mt-2 flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-800">{assignment.name}</h1>
                    <StatusBadge name={ASSIGNMENT_STATUS_META} value={assignment.status} />
                  </div>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-slate-400">
                    <span>{assignment.code}</span>
                    <span>• {getLabel(ASSIGNMENT_TYPE_META, assignment.type) || assignment.type}</span>
                    <span>• Lớp: {assignment.class_name || "—"}</span>
                    {assignment.due_date && (
                      <span>• Hạn nộp: {moment(assignment.due_date).format("DD/MM/YYYY HH:mm")}</span>
                    )}
                    <span>• Điểm tối đa: {assignment.max_score}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    outlined
                    icon={<PencilSquareOutlined />}
                    onClick={() => navigate(`${PATHS.assignment}/${assignment.id}/edit`)}
                    className="text-brand border-brand hover:bg-brand"
                  >
                    Sửa
                  </Button>
                  <Button
                    icon={<PencilSquareOutlined />}
                    onClick={() => navigate(`${PATHS.grading}/${assignment.id}`)}
                    className="whitespace-nowrap bg-brand hover:bg-brand/80"
                  >
                    Chấm bài
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatisticCard
                  icon={<UsersOutlined />}
                  value={assignment.progress.total}
                  label="Tổng học viên"
                  iconClassName="bg-sky-50 text-brand"
                />
                <StatisticCard
                  icon={<ClipboardDocumentListOutlined />}
                  value={assignment.progress.submitted}
                  label="Đã nộp"
                  iconClassName="bg-violet-50 text-violet-500"
                />
                <StatisticCard
                  icon={<CheckBadgeOutlined />}
                  value={assignment.progress.graded}
                  label="Đã chấm"
                  iconClassName="bg-emerald-50 text-emerald-500"
                />
                <StatisticCard
                  icon={<DocumentTextOutlined />}
                  value={assignment.progress.pending}
                  label="Chưa nộp"
                  iconClassName="bg-amber-50 text-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
                <div className="flex flex-col gap-4">
                  <Card>
                    <p className="mb-2 text-sm font-semibold text-slate-700">Mô tả/yêu cầu</p>
                    <p className="whitespace-pre-line text-sm text-slate-600">
                      {assignment.instruction || "Chưa có mô tả"}
                    </p>
                  </Card>

                  <StudentSubmissionList
                    rows={rows}
                    selectedId={null}
                    onSelect={(row) =>
                      navigate(`${PATHS.grading}/${assignment.id}?student_id=${row.student_id}`)
                    }
                    maxScore={assignment.max_score}
                    isLoading={rosterQuery.isLoading}
                    isError={rosterQuery.isError}
                    onRetry={() => rosterQuery.refetch()}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Card>
                    <p className="mb-3 text-sm font-semibold text-slate-700">Tài liệu đính kèm</p>
                    <UploadAttachment
                      entityType="assignment"
                      entityId={assignment.id}
                      onUploaded={() => attachmentsQuery.refetch()}
                    />
                    {attachments.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {attachments.map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2"
                          >
                            <DocumentTextOutlined className="h-4 w-4 shrink-0 text-brand" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-slate-700">
                                {a.name || a.file_name}
                              </p>
                            </div>
                            <button
                              type="button"
                              title="Tải xuống"
                              disabled={!a.file_id}
                              onClick={() => handleDownload(a.file_id, a.file_name)}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand disabled:cursor-not-allowed disabled:text-slate-200 [&_svg]:h-3.5 [&_svg]:w-3.5"
                            >
                              <ArrowDownTrayOutlined />
                            </button>
                            <button
                              type="button"
                              title="Xóa"
                              onClick={() => handleDeleteAttachment(a.id, a.name || a.file_name)}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 [&_svg]:h-3.5 [&_svg]:w-3.5"
                            >
                              <TrashOutlined />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}
        </Spin>
      )}
    </div>
  );
};

export default AssignmentDetailPage;
