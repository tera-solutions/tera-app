import Card from "_common/components/Card";

import type { AttendanceSessionState } from "../hooks/useAttendanceSession";
import AttendanceGrid from "./AttendanceGrid";
import AttendanceSidebar from "./AttendanceSidebar";

interface AttendanceEditorProps {
  session: AttendanceSessionState;
}

/** Grid + save + summary sidebar for one class session's attendance. */
const AttendanceEditor = ({ session }: AttendanceEditorProps) => {
  const {
    rows,
    loading,
    isError,
    refetch,
    selectedIds,
    toggleSelect,
    setStatusForSelected,
    markAllPresent,
    dirtyCount,
    saving,
    save,
    counts,
    absentRows,
    note,
    setNote,
  } = session;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
      <Card>
        <AttendanceGrid
          rows={rows}
          loading={loading}
          isError={isError}
          onRetry={refetch}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onSetStatus={setStatusForSelected}
          onMarkAllPresent={markAllPresent}
          dirtyCount={dirtyCount}
          saving={saving}
          onSave={save}
        />
      </Card>

      <div className="hidden xl:block">
        <AttendanceSidebar
          counts={counts}
          absentRows={absentRows}
          note={note}
          onNoteChange={setNote}
        />
      </div>
    </div>
  );
};

export default AttendanceEditor;
