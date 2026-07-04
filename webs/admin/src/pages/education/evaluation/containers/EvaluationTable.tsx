/* Import: library */
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItem, PaginationProps, notification } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";

/* Import: services */
import { EvaluationService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import RatingStars from "./RatingStars";
import {
  CLASSIFICATION_COLOR,
  IEvaluation,
  STATUS_COLOR,
} from "../_interface";

const fmtDate = (v?: string) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "";

interface IProps {
  params: any;
  setParams: (updater: any) => void;
  onView: (record: IEvaluation) => void;
  onEdit: (record: IEvaluation) => void;
}

const EvaluationTable = ({ params, setParams, onView, onEdit }: IProps) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { data, isPending } = EvaluationService.useEvaluationList({ params });
  const { mutate: submit } = EvaluationService.useEvaluationSubmit();
  const { mutate: approve } = EvaluationService.useEvaluationApprove();
  const { mutate: reject } = EvaluationService.useEvaluationReject();
  const { mutate: lock } = EvaluationService.useEvaluationLock();

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );
  const EMPTY = <span className="text-gray-300">—</span>;

  const Badge = ({
    text,
    cfg,
  }: {
    text?: string;
    cfg?: { color: string; backgroundColor: string };
  }) =>
    text ? (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium"
        style={{
          color: cfg?.color ?? "#6b7280",
          backgroundColor: cfg?.backgroundColor ?? "#f3f4f6",
        }}
      >
        {text}
      </span>
    ) : (
      EMPTY
    );

  const runAction = (
    fn: (p: { id: number }) => void,
    id: number,
    successMsg: string,
  ) =>
    fn(
      { id },
      {
        onSuccess: () => notification.success({ message: successMsg }),
        onError: (e: any) =>
          notification.error({
            message: e?.message || t("common.error_message"),
          }),
      } as any,
    );

  const itemsAction = (record: IEvaluation): DropdownItem[] => {
    const items: DropdownItem[] = [
      { key: "detail", label: t("button.detail"), onClick: () => onView(record) },
    ];
    const id = record.id;

    // Sửa nội dung đánh giá — không cho khi đã khóa
    if (record.status !== "locked") {
      items.push({
        key: "edit",
        label: t("button.edit"),
        onClick: () => onEdit(record),
      });
    }

    if (record.status === "draft") {
      items.push({
        key: "submit",
        label: t("evaluation.action_submit"),
        onClick: () =>
          confirm.warning({
            title: t("evaluation.action_submit"),
            content: t("evaluation.confirm_submit"),
            onOk: () => runAction(submit, id, t("common.update_success")),
          }),
      });
    }
    if (record.status === "submitted") {
      items.push(
        {
          key: "approve",
          label: t("evaluation.action_approve"),
          onClick: () =>
            confirm.warning({
              title: t("evaluation.action_approve"),
              content: t("evaluation.confirm_approve"),
              onOk: () => runAction(approve, id, t("common.update_success")),
            }),
        },
        {
          key: "reject",
          label: (
            <span className="text-red-500">{t("evaluation.action_reject")}</span>
          ),
          onClick: () =>
            confirm.warning({
              title: t("evaluation.action_reject"),
              content: t("evaluation.confirm_reject"),
              onOk: () => runAction(reject, id, t("common.update_success")),
            }),
        },
      );
    }
    if (record.status === "approved") {
      items.push({
        key: "lock",
        label: t("evaluation.action_lock"),
        onClick: () =>
          confirm.warning({
            title: t("evaluation.action_lock"),
            content: t("evaluation.confirm_lock"),
            onOk: () => runAction(lock, id, t("common.update_success")),
          }),
      });
    }
    return items;
  };

  const columns = [
    {
      title: <HeaderTitle>{t("evaluation.code")}</HeaderTitle>,
      dataIndex: "evaluation_code",
      key: "evaluation_code",
      width: 130,
    },
    {
      title: <HeaderTitle>{t("evaluation.type")}</HeaderTitle>,
      key: "type",
      width: 150,
      render: (_: any, r: IEvaluation) => r.evaluation_type_label ?? EMPTY,
    },
    {
      title: <HeaderTitle>{t("evaluation.evaluator")}</HeaderTitle>,
      key: "evaluator",
      width: 140,
      render: (_: any, r: IEvaluation) => r.evaluator_type_label ?? EMPTY,
    },
    {
      title: <HeaderTitle>{t("evaluation.score")}</HeaderTitle>,
      key: "score",
      width: 150,
      render: (_: any, r: IEvaluation) => <RatingStars score={r.score} />,
    },
    {
      title: <HeaderTitle>{t("evaluation.classification")}</HeaderTitle>,
      key: "classification",
      width: 130,
      align: "center" as const,
      render: (_: any, r: IEvaluation) => (
        <Badge
          text={r.classification_label}
          cfg={CLASSIFICATION_COLOR[r.classification ?? ""]}
        />
      ),
    },
    {
      title: <HeaderTitle>{t("evaluation.period")}</HeaderTitle>,
      key: "period",
      width: 130,
      render: (_: any, r: IEvaluation) => r.evaluation_period_label ?? EMPTY,
    },
    {
      title: <HeaderTitle>{t("evaluation.course")}</HeaderTitle>,
      key: "course",
      width: 150,
      render: (_: any, r: IEvaluation) => r.course?.name ?? EMPTY,
    },
    {
      title: <HeaderTitle>{t("evaluation.class")}</HeaderTitle>,
      key: "class",
      width: 120,
      render: (_: any, r: IEvaluation) => r.class_room?.name ?? EMPTY,
    },
    {
      title: <HeaderTitle>{t("evaluation.evaluated_at")}</HeaderTitle>,
      key: "evaluated_at",
      width: 120,
      align: "center" as const,
      render: (_: any, r: IEvaluation) => fmtDate(r.evaluated_at) || EMPTY,
    },
    {
      title: <HeaderTitle>{t("evaluation.status")}</HeaderTitle>,
      key: "status",
      width: 120,
      align: "center" as const,
      render: (_: any, r: IEvaluation) => (
        <Badge text={r.status_label} cfg={STATUS_COLOR[r.status]} />
      ),
    },
    {
      title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: any, record: IEvaluation) => (
        <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
      ),
    },
  ];

  const pagination = data?.data?.pagination;
  const currentPage = pagination?.current_page || params?.page || 1;
  const totalItems = pagination?.total || 0;
  const perPage = Number(pagination?.per_page || params?.per_page || 20);

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setParams((prev: any) => {
      const prevPerPage = Number(prev?.per_page || 20);
      const isPageSizeChanged = pageSize !== prevPerPage;
      return {
        ...prev,
        page: isPageSizeChanged ? 1 : page,
        per_page: pageSize,
      };
    });
  };

  const tableData = data?.data?.items ?? [];

  return (
    <div style={{ width: "100%", overflowX: "auto", colorScheme: "light" }}>
      <TableTera
        rowKey={(record: IEvaluation) => record.id}
        columns={columns}
        data={tableData}
        scroll={{ x: 1360, y: "calc(100vh - 340px)" }}
        loading={isPending}
        pagination={false}
      />
      <Pagination
        total={totalItems}
        current={currentPage}
        pageSize={perPage}
        onChange={handleChangePage}
        pageSizeOptions={[20, 50, 100]}
      />
    </div>
  );
};

export default EvaluationTable;
