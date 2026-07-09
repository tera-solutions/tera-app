import { useMemo, useState } from "react";
import { CheckBadgeOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";

import type { RankingRow } from "../_interface";

interface GroupCompareProps {
  rows: RankingRow[];
}

/**
 * Ad-hoc, session-only comparison group — no backend persistence. The teacher
 * picks a few students to see their group average vs. the whole roster.
 */
const GroupCompare = ({ rows }: GroupCompareProps) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((r) => r.student_name.toLowerCase().includes(keyword));
  }, [rows, search]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const groupRows = rows.filter((r) => selected.has(r.student_id) && r.score != null);
  const groupAvg = groupRows.length
    ? groupRows.reduce((sum, r) => sum + (r.score as number), 0) / groupRows.length
    : 0;
  const overallScored = rows.filter((r) => r.score != null);
  const overallAvg = overallScored.length
    ? overallScored.reduce((sum, r) => sum + (r.score as number), 0) / overallScored.length
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
      <Card>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm học viên để thêm vào nhóm..."
          wrapperClassName="mb-3"
        />
        {filtered.length === 0 ? (
          <EmptyState description="Không tìm thấy học viên phù hợp" className="py-6" />
        ) : (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {filtered.map((row) => {
              const checked = selected.has(row.student_id);
              return (
                <button
                  key={row.student_id}
                  type="button"
                  onClick={() => toggle(row.student_id)}
                  className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                    checked ? "border-brand bg-sky-50" : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <Avatar src={row.student_avatar} alt={row.student_name} sizeClassName="h-8 w-8" />
                  <span className="flex-1 truncate text-sm font-medium text-slate-700">
                    {row.student_name}
                  </span>
                  {checked && <CheckBadgeOutlined className="h-4 w-4 text-brand" />}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-4">
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={selected.size}
          label="Đã chọn"
          iconClassName="bg-sky-50 text-brand"
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={groupRows.length ? groupAvg.toFixed(2) : "—"}
          label="Điểm TB nhóm"
          sublabel={`So với TB chung: ${overallAvg.toFixed(2)}`}
          iconClassName="bg-emerald-50 text-emerald-500"
        />
      </div>
    </div>
  );
};

export default GroupCompare;
