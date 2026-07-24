import { useEffect, useState } from "react";
import { Button, Checkbox, Input, notification, PlusOutlined, Select, TrashOutlined } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import FieldLabel from "_common/components/FieldLabel";
import Table, { TableColumn } from "_common/components/Table";
import useConfirm from "_common/hooks/useConfirm";
import FormScaff from "@tera/components/dof/FormScaff";
import { EvaluationCriteriaTemplateService } from "@tera/modules/education";

import { EVALUATION_CRITERIA_BY_TYPE } from "pages/Evaluation/constants";

const EVALUATION_TYPE_OPTIONS = [
  { value: "teacher", label: "Đánh giá giáo viên" },
  { value: "student", label: "Đánh giá học viên" },
  { value: "parent", label: "Đánh giá phụ huynh" },
];

interface TemplateRow {
  id: number;
  evaluationType: string;
  name: string;
  criteria: string[];
  isShared: boolean;
  status: string;
}

const toRows = (raw: any[] | null | undefined): TemplateRow[] =>
  (raw ?? []).map((t) => ({
    id: t.id ?? 0,
    evaluationType: t.evaluation_type ?? "",
    name: t.name ?? "",
    criteria: Array.isArray(t.criteria) ? t.criteria : [],
    isShared: !!t.is_shared,
    status: t.status ?? "",
  }));

const emptyForm = {
  evaluation_type: "teacher",
  name: "",
  criteria: [] as string[],
  is_shared: false,
};

const TemplateForm = ({
  open,
  onClose,
  template,
}: {
  open: boolean;
  onClose: () => void;
  template: TemplateRow | null;
}) => {
  const isEdit = !!template;
  const [form, setForm] = useState(emptyForm);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const { mutate: create, isPending: creating } = EvaluationCriteriaTemplateService.useEvaluationCriteriaTemplateCreate();
  const { mutate: update, isPending: updating } = EvaluationCriteriaTemplateService.useEvaluationCriteriaTemplateUpdate();

  useEffect(() => {
    if (!open) return;
    setForm(
      template
        ? {
            evaluation_type: template.evaluationType,
            name: template.name,
            criteria: template.criteria,
            is_shared: template.isShared,
          }
        : emptyForm,
    );
  }, [open, template]);

  const options = EVALUATION_CRITERIA_BY_TYPE[form.evaluation_type] ?? {};

  const toggleCriterion = (key: string, checked: boolean) =>
    set({ criteria: checked ? [...form.criteria, key] : form.criteria.filter((c) => c !== key) });

  const handleSubmit = () => {
    const criteria = form.criteria;
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên bảng tiêu chí" });
      return;
    }
    if (criteria.length === 0) {
      notification.warning({ message: "Cần ít nhất một tiêu chí" });
      return;
    }

    const done = {
      onSuccess: () => {
        notification.success({ message: isEdit ? "Đã cập nhật bảng tiêu chí" : "Đã tạo bảng tiêu chí" });
        onClose();
      },
      onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể lưu bảng tiêu chí" }),
    };

    if (isEdit && template) {
      update({ id: template.id, params: { name: form.name.trim(), criteria, is_shared: form.is_shared } }, done);
    } else {
      create(
        {
          params: {
            evaluation_type: form.evaluation_type,
            name: form.name.trim(),
            criteria,
            is_shared: form.is_shared,
          },
        },
        done,
      );
    }
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Tạo bảng tiêu chí"
      titleEdit="Sửa bảng tiêu chí"
      className="!w-[95%] xmd:!w-[480px]"
      okText="Lưu"
      onOk={handleSubmit}
      confirmLoading={creating || updating}
    >
      <div className="space-y-3">
        {!isEdit && (
          <div>
            <FieldLabel required>Áp dụng cho</FieldLabel>
            <Select
              value={form.evaluation_type}
              options={EVALUATION_TYPE_OPTIONS}
              onChange={(v: any) => set({ evaluation_type: v, criteria: [] })}
            />
          </div>
        )}
        <div>
          <FieldLabel required>Tên bảng tiêu chí</FieldLabel>
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="VD: Đánh giá giáo viên chuẩn" />
        </div>
        <div>
          <FieldLabel required>Tiêu chí</FieldLabel>
          <p className="mb-1.5 text-xs text-slate-400">
            Chọn các tiêu chí sẽ dùng khi chấm — danh sách cố định theo loại đánh giá.
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-3">
            {Object.entries(options).map(([key, label]) => (
              <Checkbox
                key={key}
                checked={form.criteria.includes(key)}
                onChange={(e) => toggleCriterion(key, e.target.checked)}
              >
                <span className="text-sm text-slate-600">{label}</span>
              </Checkbox>
            ))}
          </div>
        </div>
      </div>
    </FormScaff>
  );
};

/** Rubrics (named criteria lists) admins define for everyone, or a teacher
 * defines privately for themselves. Criteria are a subset of the fixed
 * EvaluationType::criteria() allowlist for the chosen evaluation_type —
 * evaluation/create rejects any other key, so the template is guaranteed
 * to be usable when picked in EvaluationForm. */
const EvaluationCriteriaSettingsTab = () => {
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateRow | null>(null);

  const listQuery = EvaluationCriteriaTemplateService.useEvaluationCriteriaTemplateList({ params: { per_page: 50 } });
  const rows = toRows(listQuery.data?.data?.items);

  const { mutate: suspendTemplate } = EvaluationCriteriaTemplateService.useEvaluationCriteriaTemplateSuspend();
  const { mutate: restoreTemplate } = EvaluationCriteriaTemplateService.useEvaluationCriteriaTemplateRestore();

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const handleEdit = (row: TemplateRow) => {
    setEditing(row);
    setFormOpen(true);
  };
  const handleToggleStatus = (row: TemplateRow) => {
    const isActive = row.status === "active";
    confirm.warning({
      title: isActive ? "Ngừng sử dụng bảng tiêu chí" : "Khôi phục bảng tiêu chí",
      content: `${isActive ? "Ngừng" : "Khôi phục"} bảng tiêu chí "${row.name}"?`,
      onOk: () => {
        const mutate = isActive ? suspendTemplate : restoreTemplate;
        mutate(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã cập nhật trạng thái" }),
            onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể cập nhật" }),
          },
        );
      },
    });
  };

  const typeLabel = (value: string) =>
    EVALUATION_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;

  const columns: TableColumn<TemplateRow>[] = [
    {
      key: "name",
      title: "Tên bảng tiêu chí",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-slate-800">{r.name}</span>
          {r.isShared && <Badge className="bg-sky-50 px-2 py-0.5 text-[11px] text-brand">Dùng chung</Badge>}
        </div>
      ),
    },
    { key: "type", title: "Áp dụng cho", render: (r) => typeLabel(r.evaluationType) },
    {
      key: "criteria",
      title: "Tiêu chí",
      render: (r) => {
        const labels = EVALUATION_CRITERIA_BY_TYPE[r.evaluationType] ?? {};
        return (
          <span className="text-xs text-slate-500">
            {r.criteria.map((c) => labels[c] ?? c).join(", ")}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            r.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          {r.status === "active" ? "Đang dùng" : "Ngừng"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => handleEdit(r)} className="rounded-lg px-2 py-1 text-xs font-medium text-brand hover:bg-sky-50">
            Sửa
          </button>
          <button
            type="button"
            onClick={() => handleToggleStatus(r)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 [&_svg]:h-4 [&_svg]:w-4"
          >
            <TrashOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Bảng tiêu chí đánh giá</p>
          <p className="text-xs text-slate-400">
            Tạo sẵn bộ tiêu chí dùng chung cho cả trung tâm, hoặc mỗi giáo viên tự định nghĩa bộ
            tiêu chí riêng của mình.
          </p>
        </div>
        <Button icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo bảng tiêu chí
        </Button>
      </div>

      {rows.length === 0 && !listQuery.isLoading ? (
        <EmptyState description="Chưa có bảng tiêu chí nào" className="py-8" />
      ) : (
        <Table
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          isLoading={listQuery.isLoading}
          isError={listQuery.isError}
          onRetry={() => listQuery.refetch()}
          errorMessage="Không tải được danh sách bảng tiêu chí"
          emptyText="Chưa có bảng tiêu chí nào"
          minWidthClassName="min-w-180"
        />
      )}

      <TemplateForm open={formOpen} onClose={() => setFormOpen(false)} template={editing} />
    </Card>
  );
};

export default EvaluationCriteriaSettingsTab;
