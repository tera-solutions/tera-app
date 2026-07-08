import { useEffect, useState } from "react";
import moment from "moment";
import { Button, StopOutlined } from "tera-dls";

interface SessionTimerProps {
  startAt: moment.Moment;
  onStop: () => void;
  stopping?: boolean;
}

const formatElapsed = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(Math.max(0, n)).padStart(2, "0")).join(":");
};

/** Counts up from the session's actual start time — resilient to the tab being backgrounded, unlike a naive setInterval counter. */
const SessionTimer = ({ startAt, onStop, stopping }: SessionTimerProps) => {
  const [elapsed, setElapsed] = useState(() => moment().diff(startAt, "seconds"));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(moment().diff(startAt, "seconds"));
    }, 1000);
    return () => clearInterval(interval);
  }, [startAt]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 p-4">
      <p className="text-3xl font-bold tabular-nums text-slate-800">{formatElapsed(elapsed)}</p>
      <Button
        icon={<StopOutlined />}
        type="danger"
        loading={stopping}
        onClick={onStop}
        className="w-full"
      >
        Dừng lại
      </Button>
    </div>
  );
};

export default SessionTimer;
