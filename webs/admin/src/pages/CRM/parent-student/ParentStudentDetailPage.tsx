/* Import: library */
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowSmallLeftSolid,
  Breadcrumb,
  Button,
  PencilSquareOutlined,
  TrashOutlined,
  notification,
} from "tera-dls";

/* Import: packages */
import useConfirm from "@tera/commons/hooks/useConfirm";
import { PARENT_STUDENT_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { ParentStudentService } from "@tera/modules";

/* Import: pages */
import ParentStudentDetailView from "./containers/ParentStudentDetailView";

const ParentStudentDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Trang này chỉ dành cho mobile; desktop dùng modal trên trang danh sách.
  // Resize sang desktop → quay về danh sách và nhắn nó mở modal detail.
  useEffect(() => {
    if (!isMobile) {
      navigate(PARENT_STUDENT_PAGE_URL.list.path, {
        replace: true,
        state: { openModal: { type: "detail", id } },
      });
    }
  }, [isMobile, navigate, id]);
  const { t } = useTranslation();
  const confirmDialog = useConfirm();
  const queryClient = useQueryClient();

  const { data, isPending } = ParentStudentService.useParentStudentDetail({
    id,
  });
  const { mutate: onDelete, isPending: isDeleting } =
    ParentStudentService.useParentStudentDelete();
  const link = data?.data?.parent_student ?? data?.data?.item ?? data?.data;

  const handleDelete = () => {
    confirmDialog.warning({
      title: t("common.delete_confirm_title"),
      content: t("common.delete_confirm_question"),
      onOk: () =>
        onDelete(
          { id: Number(id) },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["parent-student", "list"],
              });
              navigate(-1);
            },
            onError: (error: any) =>
              notification.error({
                message: error?.message || t("common.error_message"),
              }),
          },
        ),
    });
  };

  return (
    <div className="tera-page-form gap-0! relative">
      <div className="sticky top-11.25 z-30 bg-[#F3F3F9]">
        <div className="page-header-v2">
          <div className="page-header-v2__breadcrumb">
            <div
              className="page-header__breadcrumb-back cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ArrowSmallLeftSolid className="h-6 w-6" />
            </div>
            <Breadcrumb
              separator={">"}
              items={[
                {
                  title: (
                    <a onClick={() => navigate(-1)}>
                      <span className="text-blue-400! hover:text-blue-600!">
                        {t("parent_student.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("parent_student.detail"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <ParentStudentDetailView link={link} loading={isPending} />
        </div>

        <div className="flex justify-between mt-2 max-xmd:mb-[60px]">
          <Button
            onClick={() =>
              navigate(PARENT_STUDENT_PAGE_URL.update.path(Number(id)))
            }
            className="flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 ml-4 rounded-xl! bg-gradient-to-r! from-green-400! to-emerald-500! text-white! font-semibold shadow-lg shadow-emerald-200 hover:from-green-500! hover:to-emerald-600! hover:shadow-emerald-300 active:scale-95 transition-all duration-200 border-none!"
          >
            <PencilSquareOutlined className="w-5 h-5 xmd:w-4 xmd:h-4" />
            <span className="text-base xmd:text-sm">{t("button.edit")}</span>
          </Button>
          <Button
            onClick={handleDelete}
            loading={isDeleting}
            className="flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl! bg-gradient-to-r! from-red-400! to-red-500! text-white! font-semibold shadow-lg shadow-red-200 hover:from-red-500! hover:to-red-600! hover:shadow-red-300 active:scale-95 transition-all duration-200 border-none!"
          >
            <TrashOutlined className="w-5 h-5 xmd:w-4 xmd:h-4" />
            <span className="text-base xmd:text-sm">{t("button.delete")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ParentStudentDetailPage;
