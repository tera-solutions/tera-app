import { BellOutlined, Spin } from "tera-dls";
import moment from "moment";

import { CARD } from "_common/constants/dashboard";
import ErrorRetry from "_common/components/ErrorRetry";
import { useNotificationList } from "@tera/modules";

interface ClassNotificationsProps {
  classId: number | null;
}

const ClassNotifications = ({ classId }: ClassNotificationsProps) => {
  const query = useNotificationList(
    { params: { class_id: classId ?? 0, per_page: 5 } },
    { enabled: !!classId },
  );
  const items = query.data?.data?.items ?? [];

  return (
    <div className={`${CARD} p-4`}>
      <p className="mb-3 text-sm font-semibold text-slate-700">
        Thông báo lớp học
      </p>

      {query.isLoading ? (
        <Spin spinning>
          <div className="h-16" />
        </Spin>
      ) : query.isError ? (
        <ErrorRetry onRetry={() => query.refetch()} message="Không tải được thông báo" />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 [&_svg]:h-5 [&_svg]:w-5">
            <BellOutlined />
          </div>
          <p className="text-xs text-slate-400">
            Chưa có thông báo cho lớp này.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item: any) => (
            <div key={item.id} className="rounded-xl border border-slate-100 p-3">
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              {item.content && (
                <p className="mt-0.5 truncate text-xs text-slate-500">{item.content}</p>
              )}
              <p className="mt-1 text-[11px] text-slate-400">
                {moment(item.created_at).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassNotifications;
