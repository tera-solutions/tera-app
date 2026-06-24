import { ParentStudentAPI, ParentAPI } from "@tera/api";

/**
 * Đồng bộ quan hệ Phụ huynh ↔ Học viên qua API `crm/parent-student/*`.
 *
 * Đây là NGUỒN GHI DUY NHẤT cho bảng pivot parent_student — được dùng chung
 * bởi StudentForm (tab Phụ huynh), ParentForm (tab Học viên) và module Liên kết,
 * để tránh việc 3 nơi "replace" giẫm chân nhau làm mất dữ liệu cấp-link
 * (is_primary_contact / is_billing_contact / is_pickup_authorized / note / relation).
 *
 * Cơ chế: diff theo `link_id`.
 *  - row có link_id  → update link (chỉ relation + contacts + note, KHÔNG đổi id 2 đầu)
 *  - row chưa link_id → create link (kèm parent_id + student_id)
 *  - link cũ không còn trong rows → delete
 *  - mode "new" (chỉ phía student): tạo phụ huynh qua crm/parent/create trước
 *    (để backend sinh Mã PH) rồi mới link.
 */

export interface LinkRowInput {
  link_id?: number;
  /** Chỉ dùng khi anchor = "student": "existing" chọn PH sẵn, "new" tạo PH mới */
  mode?: "existing" | "new";
  /** parent_id (khi anchor=student) hoặc student_id (khi anchor=parent) */
  counterpart_id?: number;
  /** payload tạo phụ huynh mới (mode = "new") */
  new_parent?: {
    name?: string;
    phone?: string;
    email?: string;
    business_id?: number;
    branch_id?: number;
  };
  relation?: string;
  is_primary_contact?: boolean;
  is_billing_contact?: boolean;
  is_pickup_authorized?: boolean;
  note?: string;
}

export interface SyncLinksArgs {
  anchor: "student" | "parent";
  anchorId: number;
  rows: LinkRowInput[];
  originalLinkIds: number[];
}

const extractId = (res: any): number | undefined =>
  res?.data?.id ??
  res?.data?.parent?.id ??
  res?.data?.student?.id ??
  res?.id;

export async function syncParentStudentLinks({
  anchor,
  anchorId,
  rows,
  originalLinkIds,
}: SyncLinksArgs): Promise<void> {
  const keptLinkIds: number[] = [];

  for (const row of rows) {
    let counterpartId = row.counterpart_id;

    // Tạo phụ huynh mới (chỉ phía student) → lấy id để link
    if (anchor === "student" && row.mode === "new" && !counterpartId) {
      if (!row.new_parent?.name?.trim()) continue;
      const created = await ParentAPI.create({
        params: {
          name: row.new_parent.name.trim(),
          phone: row.new_parent.phone?.trim() || undefined,
          email: row.new_parent.email?.trim() || undefined,
          business_id: row.new_parent.business_id,
          branch_id: row.new_parent.branch_id,
        },
      });
      counterpartId = extractId(created);
    }

    if (!counterpartId) continue; // dòng chưa chọn đối tượng → bỏ qua

    const linkFields = {
      relation: row.relation || undefined,
      is_primary_contact: !!row.is_primary_contact,
      is_billing_contact: !!row.is_billing_contact,
      is_pickup_authorized: !!row.is_pickup_authorized,
      note: row.note?.trim() || undefined,
    };

    if (row.link_id) {
      keptLinkIds.push(row.link_id);
      await ParentStudentAPI.update({ id: row.link_id, params: linkFields });
    } else {
      await ParentStudentAPI.create({
        params: {
          ...linkFields,
          parent_id: anchor === "parent" ? anchorId : counterpartId,
          student_id: anchor === "student" ? anchorId : counterpartId,
        },
      });
    }
  }

  // Xóa các link cũ không còn trong danh sách
  for (const id of originalLinkIds) {
    if (!keptLinkIds.includes(id)) {
      await ParentStudentAPI.delete({ id });
    }
  }
}
