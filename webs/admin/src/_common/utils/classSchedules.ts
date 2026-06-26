import { ClassScheduleAPI } from "@tera/api";

/**
 * Đồng bộ lịch học của 1 lớp qua API `class-schedule/*` (NGUỒN GHI cho lịch học).
 *
 * Cơ chế diff theo `id` của từng dòng lịch:
 *  - row có id  → update  (PUT /edu/class-schedule/update/:id, body {weekday,start_time,end_time})
 *  - row chưa id → create (POST /edu/class-room/:classId/schedule/create, body {weekday,start_time,end_time})
 *  - dòng cũ không còn trong rows → delete (DELETE /edu/class-schedule/delete/:id)
 */

export interface ScheduleRowInput {
  id?: number;
  weekday?: number | string;
  start_time?: string;
  end_time?: string;
}

export interface SyncSchedulesArgs {
  classId: number;
  rows: ScheduleRowInput[];
  originalIds: number[];
}

export async function syncClassSchedules({
  classId,
  rows,
  originalIds,
}: SyncSchedulesArgs): Promise<void> {
  const keptIds: number[] = [];

  for (const row of rows) {
    // Bỏ dòng trống
    if (!row.weekday || !row.start_time || !row.end_time) continue;

    const fields = {
      weekday: Number(row.weekday),
      start_time: row.start_time,
      end_time: row.end_time,
    };

    if (row.id) {
      keptIds.push(row.id);
      await ClassScheduleAPI.update({ id: row.id, params: fields });
    } else {
      await ClassScheduleAPI.create({
        params: { class_id: classId, ...fields },
      });
    }
  }

  // Xóa các dòng cũ không còn trong danh sách
  for (const id of originalIds) {
    if (!keptIds.includes(id)) {
      await ClassScheduleAPI.delete({ id });
    }
  }
}
