import { useState } from "react";
import { Modal, notification, PlusOutlined, TrashOutlined } from "tera-dls";

import useConfirm from "_common/hooks/useConfirm";
import WidgetState from "_common/components/WidgetState";
import { QuestionCategoryService, QuestionTagService } from "@tera/modules/education";

interface CategoryTagManagerModalProps {
  open: boolean;
  onClose: () => void;
}

/** Quản lý danh mục & thẻ dùng chung cho toàn bộ ngân hàng câu hỏi — cả hai
 * đều dùng chung nhóm quyền `question.*` (BE convention, xem question.md §XV). */
const CategoryTagManagerModal = ({ open, onClose }: CategoryTagManagerModalProps) => {
  const [tab, setTab] = useState<"category" | "tag">("category");
  const [draftName, setDraftName] = useState("");
  const [draftCode, setDraftCode] = useState("");
  const confirm = useConfirm();

  const categoryQuery = QuestionCategoryService.useQuestionCategoryList(
    { params: { page: 1, per_page: 100 } },
    { enabled: open },
  );
  const tagQuery = QuestionTagService.useQuestionTagList(
    { params: { page: 1, per_page: 100 } },
    { enabled: open },
  );

  const { mutate: createCategory, isPending: isCreatingCategory } = QuestionCategoryService.useQuestionCategoryCreate();
  const { mutate: deleteCategory } = QuestionCategoryService.useQuestionCategoryDelete();
  const { mutate: createTag, isPending: isCreatingTag } = QuestionTagService.useQuestionTagCreate();
  const { mutate: deleteTag } = QuestionTagService.useQuestionTagDelete();

  const categories = categoryQuery.data?.data?.items ?? [];
  const tags = tagQuery.data?.data?.items ?? [];

  const resetDraft = () => {
    setDraftName("");
    setDraftCode("");
  };

  const handleAddCategory = () => {
    if (!draftName.trim() || !draftCode.trim()) return;
    createCategory(
      { params: { category_code: draftCode.trim(), category_name: draftName.trim() } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã thêm danh mục" });
          resetDraft();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể thêm danh mục" }),
      },
    );
  };

  const handleAddTag = () => {
    if (!draftName.trim()) return;
    createTag(
      { params: { tag_name: draftName.trim() } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã thêm thẻ" });
          resetDraft();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể thêm thẻ" }),
      },
    );
  };

  const handleDeleteCategory = (id: number, name: string) => {
    confirm.warning({
      title: "Xóa danh mục",
      content: `Bạn có chắc muốn xóa danh mục "${name}"?`,
      onOk: () =>
        deleteCategory(
          { id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa danh mục" }),
            onError: (error: any) =>
              notification.error({ message: error?.data?.msg ?? "Không thể xóa danh mục" }),
          },
        ),
    });
  };

  const handleDeleteTag = (id: number, name: string) => {
    confirm.warning({
      title: "Xóa thẻ",
      content: `Bạn có chắc muốn xóa thẻ "${name}"?`,
      onOk: () =>
        deleteTag(
          { id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa thẻ" }),
            onError: (error: any) =>
              notification.error({ message: error?.data?.msg ?? "Không thể xóa thẻ" }),
          },
        ),
    });
  };

  const handleClose = () => {
    resetDraft();
    onClose();
  };

  return (
    <Modal
      title="Quản lý danh mục & thẻ"
      open={open}
      onCancel={handleClose}
      className="!w-[95%] xmd:!w-[480px]"
      footer={null}
      destroyOnClose
    >
      <div className="mb-3 flex gap-2 border-b border-slate-100">
        <button
          type="button"
          onClick={() => {
            setTab("category");
            resetDraft();
          }}
          className={`px-3 py-2 text-sm font-medium ${tab === "category" ? "border-b-2 border-brand text-brand" : "text-slate-500"}`}
        >
          Danh mục
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("tag");
            resetDraft();
          }}
          className={`px-3 py-2 text-sm font-medium ${tab === "tag" ? "border-b-2 border-brand text-brand" : "text-slate-500"}`}
        >
          Thẻ
        </button>
      </div>

      {tab === "category" && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={draftCode}
              onChange={(e) => setDraftCode(e.target.value)}
              placeholder="Mã danh mục"
              className="w-28 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
            />
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Tên danh mục"
              className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
            />
            <button
              type="button"
              disabled={isCreatingCategory}
              onClick={handleAddCategory}
              className="rounded-lg bg-brand px-3 py-1.5 text-white hover:bg-brand/80"
            >
              <PlusOutlined className="h-4 w-4" />
            </button>
          </div>
          <WidgetState isLoading={categoryQuery.isLoading}>
            <div className="flex max-h-72 flex-col divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-100">
              {categories.length === 0 && <p className="p-3 text-sm text-slate-400">Chưa có danh mục nào</p>}
              {categories.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-2.5 text-sm">
                  <span>
                    <span className="font-medium text-slate-800">{c.category_name}</span>{" "}
                    <span className="text-slate-400">({c.category_code})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(c.id, c.category_name)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <TrashOutlined className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </WidgetState>
        </div>
      )}

      {tab === "tag" && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Tên thẻ"
              className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
            />
            <button
              type="button"
              disabled={isCreatingTag}
              onClick={handleAddTag}
              className="rounded-lg bg-brand px-3 py-1.5 text-white hover:bg-brand/80"
            >
              <PlusOutlined className="h-4 w-4" />
            </button>
          </div>
          <WidgetState isLoading={tagQuery.isLoading}>
            <div className="flex max-h-72 flex-col divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-100">
              {tags.length === 0 && <p className="p-3 text-sm text-slate-400">Chưa có thẻ nào</p>}
              {tags.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-2.5 text-sm">
                  <span className="font-medium text-slate-800">{t.tag_name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(t.id, t.tag_name)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <TrashOutlined className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </WidgetState>
        </div>
      )}
    </Modal>
  );
};

export default CategoryTagManagerModal;
