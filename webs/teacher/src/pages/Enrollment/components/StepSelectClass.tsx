import { useMemo, useState } from "react";
import { Button, UsersOutlined } from "tera-dls";

import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import SearchInput from "_common/components/SearchInput";
import { ClassRoomService } from "@tera/modules/education";
import type { Classroom } from "pages/Classroom/_interface";
import { toClassrooms } from "pages/Classroom/_utils";

interface StepSelectClassProps {
  selectedClass: Classroom | null;
  onNext: (classroom: Classroom) => void;
}

const StepSelectClass = ({ selectedClass, onNext }: StepSelectClassProps) => {
  const [search, setSearch] = useState("");
  const [pickedId, setPickedId] = useState<number | null>(selectedClass?.id ?? null);

  const classesQuery = ClassRoomService.useClassRoomList({
    params: { per_page: 50, filters: { status: "active" } },
  });
  const classes = useMemo(() => toClassrooms(classesQuery.data?.data?.items), [classesQuery.data]);

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const picked = classes.find((c) => c.id === pickedId) ?? null;

  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm lớp học..."
      />

      {!classesQuery.isLoading && filtered.length === 0 && (
        <EmptyState description="Không có lớp học phù hợp" className="py-10" />
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((classroom) => {
          const isFull = classroom.student_count >= classroom.max_students;
          const isSelected = pickedId === classroom.id;
          return (
            <button
              key={classroom.id}
              type="button"
              disabled={isFull}
              onClick={() => setPickedId(classroom.id)}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected ? "border-brand bg-sky-50/60" : "border-slate-200 hover:border-brand/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? "border-brand" : "border-slate-300"
                  }`}
                >
                  {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{classroom.name}</p>
                  <p className="text-xs text-slate-400">
                    {classroom.schedule_days || "Chưa xếp lịch"}
                    {classroom.room ? ` — ${classroom.room}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <UsersOutlined className="h-3.5 w-3.5" />
                  {classroom.student_count}/{classroom.max_students || "—"}
                </span>
                {isFull && (
                  <Badge className="bg-red-50 px-2 py-0.5 text-[11px] text-red-600">Đầy</Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex justify-end">
        <Button disabled={!picked} onClick={() => picked && onNext(picked)}>
          Tiếp theo →
        </Button>
      </div>
    </div>
  );
};

export default StepSelectClass;
