import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { Button, PlusOutlined, Select, TrashOutlined } from "tera-dls";
import classNames from "classnames";

import Card from "_common/components/Card";
import Table, { TableColumn } from "_common/components/Table";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Input from "@tera/components/dof/Control/Input";
import DatePicker from "@tera/components/dof/Control/DatePicker";
import { StudentService } from "@tera/modules/education";

import type { EnrollmentDraftStudent, EnrollmentDraftStudentNew } from "../_interface";
import { GENDER_OPTIONS } from "../constants";
import StudentSelect from "./StudentSelect";

interface StepStudentsProps {
  classroomName: string;
  students: EnrollmentDraftStudent[];
  onChange: (students: EnrollmentDraftStudent[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const NEW_STUDENT_DEFAULTS: Omit<EnrollmentDraftStudentNew, "mode" | "key"> = {
  name: "",
  dob: "",
  gender: "male",
  email: "",
  phone: "",
  parent_name: "",
  parent_phone: "",
};

const StepStudents = ({ classroomName, students, onChange, onBack, onNext }: StepStudentsProps) => {
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [existingId, setExistingId] = useState<number | undefined>(undefined);

  const form = useForm<typeof NEW_STUDENT_DEFAULTS>({
    mode: "onChange",
    defaultValues: NEW_STUDENT_DEFAULTS,
  });

  const existingStudentQuery = StudentService.useStudentDetail(
    { id: existingId ?? "" },
    { enabled: !!existingId },
  );

  const handleAddNew = (values: typeof NEW_STUDENT_DEFAULTS) => {
    onChange([...students, { mode: "new", key: `new-${Date.now()}`, ...values }]);
    form.reset(NEW_STUDENT_DEFAULTS);
  };

  const handleAddExisting = () => {
    const student = existingStudentQuery.data?.data?.student;
    if (!existingId || !student) return;
    onChange([
      ...students,
      {
        mode: "existing",
        key: `existing-${existingId}`,
        student_id: existingId,
        name: student.name ?? `#${existingId}`,
        dob: student.dob ?? "",
        email: student.email ?? "",
      },
    ]);
    setExistingId(undefined);
  };

  const handleRemove = (key: string) => onChange(students.filter((s) => s.key !== key));

  const columns: TableColumn<EnrollmentDraftStudent>[] = [
    { key: "name", title: "Tên", render: (s) => s.name || "—" },
    { key: "dob", title: "Ngày sinh", render: (s) => s.dob || "—" },
    { key: "class", title: "Lớp", render: () => classroomName },
    { key: "email", title: "Email", render: (s) => s.email || "—" },
    {
      key: "actions",
      title: "",
      render: (s) => (
        <button
          type="button"
          onClick={() => handleRemove(s.key)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
        >
          <TrashOutlined className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <Card>
      <div className="mb-3 flex gap-2">
        {(["new", "existing"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={classNames(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              mode === m ? "bg-brand text-white" : "bg-slate-100 text-slate-500",
            )}
          >
            {m === "new" ? "Học viên mới" : "Học viên đã có"}
          </button>
        ))}
      </div>

      {mode === "new" ? (
        <FormTera form={form} onSubmit={form.handleSubmit(handleAddNew)}>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormTeraItem
              label="Họ tên học viên"
              name="name"
              rules={[{ required: "Vui lòng nhập tên học viên" }]}
            >
              <Input placeholder="VD: Nguyễn Minh An" />
            </FormTeraItem>

            <FormTeraItem
              label="Ngày sinh"
              name="dob"
              rules={[{ required: "Vui lòng nhập ngày sinh" }]}
            >
              <Controller
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={field.value ? moment(field.value) : undefined}
                    onChange={(value: any) => field.onChange(value ? moment(value).format("YYYY-MM-DD") : "")}
                    placeholder="Chọn ngày sinh"
                  />
                )}
              />
            </FormTeraItem>

            <FormTeraItem label="Giới tính" name="gender">
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} options={GENDER_OPTIONS} onChange={field.onChange} />
                )}
              />
            </FormTeraItem>

            <FormTeraItem label="Email" name="email">
              <Input placeholder="email@example.com" />
            </FormTeraItem>

            <FormTeraItem label="Số điện thoại" name="phone">
              <Input placeholder="09xxxxxxxx" />
            </FormTeraItem>

            <FormTeraItem label="Tên phụ huynh" name="parent_name">
              <Input placeholder="VD: Nguyễn Văn B" />
            </FormTeraItem>

            <FormTeraItem label="SĐT phụ huynh" name="parent_phone">
              <Input placeholder="09xxxxxxxx" />
            </FormTeraItem>
          </div>

          <div className="mt-2 flex justify-end">
            <Button htmlType="submit" outlined icon={<PlusOutlined />}>
              Thêm học viên
            </Button>
          </div>
        </FormTera>
      ) : (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <StudentSelect value={existingId} onChange={(v) => setExistingId(v != null ? Number(v) : undefined)} />
          </div>
          <Button outlined icon={<PlusOutlined />} disabled={!existingId} onClick={handleAddExisting}>
            Thêm học viên
          </Button>
        </div>
      )}

      <p className="mb-2 mt-5 text-sm font-semibold text-slate-700">
        Danh sách học viên ({students.length})
      </p>
      <Table columns={columns} data={students} rowKey={(s) => s.key} emptyText="Chưa thêm học viên nào" />

      <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
        <Button outlined onClick={onBack}>
          ← Quay lại
        </Button>
        <Button disabled={students.length === 0} onClick={onNext}>
          Tiếp theo →
        </Button>
      </div>
    </Card>
  );
};

export default StepStudents;
