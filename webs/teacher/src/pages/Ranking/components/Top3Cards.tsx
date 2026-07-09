import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";

import type { RankingRow } from "../_interface";
import { MEDAL_COLOR } from "../constants";

interface Top3CardsProps {
  top3: RankingRow[];
}

const Top3Cards = ({ top3 }: Top3CardsProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-700">Top 3</p>
    {top3.length === 0 ? (
      <EmptyState description="Chưa có dữ liệu" className="py-6" />
    ) : (
      <div className="flex flex-col gap-2.5">
        {top3.map((row, i) => (
          <div key={row.student_id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: MEDAL_COLOR[i] }}
            >
              {i + 1}
            </span>
            <Avatar src={row.student_avatar} alt={row.student_name} sizeClassName="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">{row.student_name}</p>
              <p className="text-xs text-slate-400">{row.class_name}</p>
            </div>
            <span className="text-sm font-bold text-slate-700">{row.score}</span>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default Top3Cards;
