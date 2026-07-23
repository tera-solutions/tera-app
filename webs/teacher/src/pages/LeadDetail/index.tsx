import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowsRightLeftOutlined, Button, notification, PencilSquareOutlined, Spin } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { LeadService } from "@tera/modules/crm";

import LeadForm from "pages/Leads/components/LeadForm";
import { toLeadRows } from "pages/Leads/_utils";

import { toLeadDetail, toLeadHistories } from "./_utils";
import LeadInfoCard from "./components/LeadInfoCard";
import CareHistoryTimeline from "./components/CareHistoryTimeline";
import ConvertToStudentModal from "./components/ConvertToStudentModal";

const LeadDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const leadId = id ? Number(id) : null;
  const [editOpen, setEditOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  const detailQuery = LeadService.useLeadDetail({ id: leadId ?? "" });
  const lead = useMemo(() => toLeadDetail(detailQuery.data?.data?.lead), [detailQuery.data]);
  const histories = useMemo(() => toLeadHistories(detailQuery.data?.data?.histories), [detailQuery.data]);
  const leadRow = useMemo(() => toLeadRows(lead ? [detailQuery.data?.data?.lead] : [])[0] ?? null, [lead, detailQuery.data]);

  const { mutate: updateStatus, isPending: isStatusChanging } = LeadService.useLeadUpdateStatus();

  const isLoading = detailQuery.isLoading;
  const notFound = !isLoading && (detailQuery.isError || !lead?.id);

  const handleStatusChange = (status: string) => {
    if (!lead) return;
    updateStatus(
      { id: lead.id, params: { status } },
      {
        onSuccess: () => notification.success({ message: "Đã cập nhật trạng thái" }),
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể cập nhật trạng thái" }),
      },
    );
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: "Khách hàng tiềm năng", onClick: () => navigate(PATHS.leads) },
            { label: lead?.name || "Chi tiết lead" },
          ]}
        />
        {lead && lead.status !== "inactive" && (
          <div className="flex items-center gap-2">
            <Button outlined icon={<PencilSquareOutlined />} onClick={() => setEditOpen(true)}>
              Sửa
            </Button>
            {lead.status !== "studying" && (
              <Button icon={<ArrowsRightLeftOutlined />} onClick={() => setConvertOpen(true)}>
                Chuyển đổi
              </Button>
            )}
          </div>
        )}
      </div>

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => detailQuery.refetch()}
            message="Không tìm thấy lead hoặc bạn không có quyền truy cập"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{ label: "Về danh sách lead", onClick: () => navigate(PATHS.leads) }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {lead && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
              <LeadInfoCard lead={lead} onStatusChange={handleStatusChange} statusChanging={isStatusChanging} />

              <Card>
                <p className="mb-3 text-sm font-semibold text-slate-700">Lịch sử chăm sóc</p>
                <CareHistoryTimeline histories={histories} loading={isLoading} />
              </Card>
            </div>
          )}
        </Spin>
      )}

      <LeadForm open={editOpen} onClose={() => setEditOpen(false)} lead={leadRow} />
      <ConvertToStudentModal open={convertOpen} lead={lead} onClose={() => setConvertOpen(false)} />
    </div>
  );
};

export default LeadDetail;
