/* Import: library */
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Spin,
  ArrowSmallLeftSolid,
  Breadcrumb,
  Button,
  PencilSquareOutlined,
} from "tera-dls";

/* Import: packages */
import { STUDENT_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { StudentService } from "@tera/modules";

/* Import: pages */
import StudentForm from "./containers/StudentForm";

const StudentDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const { data, isPending } = StudentService.useStudentDetail({ id });
  const student = data?.data?.student;

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
                        {t("student.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("student.detail"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        {/* Profile card */}
        <div className="flex flex-col items-center py-4 px-20 bg-white rounded-md shadow-sm border border-gray-100 w-fit mx-auto mb-3">
          <div className="w-20 h-20 rounded-full mb-3 overflow-hidden">
            {student?.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                {student?.name ? student.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
          <p className="text-base font-bold text-gray-800">
            {student?.name ?? "—"}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{student?.code ?? "—"}</p>
        </div>

        {/* Info card — dùng chung StudentForm (chế độ xem) để có đủ subtab giống modal */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <Spin spinning={isPending}>
            <StudentForm dataDetail={student} type="detail" />
          </Spin>
        </div>

        <div className="flex justify-end mt-2 max-xmd:mb-[60px]">
          <Button
            onClick={() => navigate(STUDENT_PAGE_URL.update.path(Number(id)))}
            className="flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl! bg-gradient-to-r! from-green-400! to-emerald-500! text-white! font-semibold shadow-lg shadow-emerald-200 hover:from-green-500! hover:to-emerald-600! hover:shadow-emerald-300 active:scale-95 transition-all duration-200 border-none!"
          >
            <PencilSquareOutlined className="w-5 h-5 xmd:w-4 xmd:h-4" />
            <span className="text-base xmd:text-sm">{t("button.edit")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default StudentDetailPage;
