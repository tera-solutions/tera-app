import { useState } from "react";
import {
  Button,
  Cog6ToothOutlined,
  LockClosedOutlined,
  LockOpenOutlined,
  CheckCircleOutlined,
  InputNumber,
  Spin,
  notification,
} from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import Badge from "_common/components/Badge";
import { ScoreService } from "@tera/modules/education";

import ScoreConfigModal from "./ScoreConfigModal";

interface ScoreBoardPanelProps {
  classId: number | null;
}

/** Editable score cell — local draft value, saved on blur if changed. */
const ScoreCell = ({
  value,
  disabled,
  onSave,
}: {
  value: number | undefined;
  disabled: boolean;
  onSave: (value: number) => void;
}) => {
  const [draft, setDraft] = useState<number | undefined>(value);

  return (
    <InputNumber
      min={0}
      max={100}
      value={draft}
      disabled={disabled}
      onChange={(v) => setDraft(typeof v === "number" ? v : undefined)}
      onBlur={() => {
        if (draft !== undefined && draft !== value) onSave(draft);
      }}
      className="w-16 text-center text-sm"
    />
  );
};

const ScoreBoardPanel = ({ classId }: ScoreBoardPanelProps) => {
  const [configOpen, setConfigOpen] = useState(false);

  const configQuery = ScoreService.useScoreConfig(classId ?? "");
  const boardQuery = ScoreService.useScoreBoard(classId ?? "");
  const { mutate: saveComponent } = ScoreService.useSaveScoreComponent(classId ?? "");
  const { mutate: finalizeScore, isPending: isFinalizing } = ScoreService.useFinalizeScore(classId ?? "");
  const { mutate: unlockScore, isPending: isUnlocking } = ScoreService.useUnlockScore(classId ?? "");

  const config = configQuery.data?.data ?? null;
  const board = boardQuery.data?.data;
  const components = config?.components ?? [];
  const students = board?.students ?? [];
  const isFinalized = !!board?.is_finalized;

  const handleFinalize = () => {
    finalizeScore(undefined, {
      onSuccess: () => notification.success({ message: "Đã chốt điểm cho lớp" }),
      onError: (error: any) =>
        notification.error({ message: error?.data?.msg ?? "Không thể chốt điểm" }),
    });
  };

  const handleUnlock = () => {
    unlockScore(undefined, {
      onSuccess: () => notification.success({ message: "Đã mở khóa điểm" }),
      onError: (error: any) => notification.error({ message: error?.data?.msg ?? "Không thể mở khóa" }),
    });
  };

  if (!classId) return null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-700">Bảng điểm tổng hợp</p>
          {isFinalized && (
            <Badge className="bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">
              Đã chốt điểm
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button outlined icon={<Cog6ToothOutlined />} onClick={() => setConfigOpen(true)}>
            Cấu hình trọng số
          </Button>
          {isFinalized ? (
            <Button
              outlined
              icon={<LockOpenOutlined />}
              onClick={handleUnlock}
              loading={isUnlocking}
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              Mở khóa
            </Button>
          ) : (
            <Button
              icon={<LockClosedOutlined />}
              onClick={handleFinalize}
              loading={isFinalizing}
              disabled={components.length === 0 || students.length === 0}
              className="bg-brand hover:bg-brand/80"
            >
              Chốt điểm
            </Button>
          )}
        </div>
      </div>

      <Spin spinning={configQuery.isLoading || boardQuery.isLoading}>
        {components.length === 0 ? (
          <EmptyState
            className="py-10"
            description="Lớp chưa cấu hình trọng số điểm — bấm “Cấu hình trọng số” để bắt đầu"
          />
        ) : students.length === 0 ? (
          <EmptyState className="py-10" description="Lớp chưa có học viên đang học" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                  <th className="px-3 py-2">Học viên</th>
                  {components.map((c) => (
                    <th key={c.key} className="px-3 py-2 text-center">
                      {c.label}
                      <span className="ml-1 font-normal text-slate-400">({c.weight}%)</span>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-center">Điểm tổng kết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((row: any) => (
                  <tr key={row.student_id}>
                    <td className="px-3 py-2 font-medium text-slate-800">
                      {row.student?.full_name ?? `#${row.student_id}`}
                    </td>
                    {components.map((c) => (
                      <td key={c.key} className="px-3 py-2 text-center">
                        <ScoreCell
                          value={row.components?.[c.key]}
                          disabled={isFinalized}
                          onSave={(score) =>
                            saveComponent(
                              { student_id: row.student_id, type: c.key, score },
                              {
                                onError: (error: any) =>
                                  notification.error({
                                    message: error?.data?.msg ?? "Không thể lưu điểm",
                                  }),
                              },
                            )
                          }
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center font-semibold text-slate-800">
                      {row.final_score != null ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircleOutlined className="h-4 w-4" />
                          {row.final_score}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Spin>

      <ScoreConfigModal
        open={configOpen}
        classId={classId}
        initialComponents={components}
        onClose={() => setConfigOpen(false)}
      />
    </div>
  );
};

export default ScoreBoardPanel;
