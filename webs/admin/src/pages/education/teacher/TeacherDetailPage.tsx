/* Import: library */
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Spin,
  ArrowSmallLeftSolid,
  Breadcrumb,
  Button,
  ArrowLeftOutlined,
  PencilSquareOutlined,
} from "tera-dls";

/* Import: packages */
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import TeacherForm from "./containers/TeacherForm";

const TeacherDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { t } = useTranslation();

  const { data, isPending } =
    TeacherService.useTeacherDetail({ id });

  return (
    <div className="tera-page-form gap-0! relative">
      <div className="sticky top-11.25 z-10 bg-[#F3F3F9]">
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
                        {t("teacher.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("teacher.detail"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-[5px] w-full p-4">
          <Spin spinning={isPending}>
            <TeacherForm
              type="detail"
              dataDetail={data?.data?.teacher}
            />
          </Spin>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          <Button
            onClick={() => navigate(-1)}
            type="light"
            className="btn-info px-3"
          >
            <ArrowLeftOutlined className="w-4 h-4 stroke-2" />
            <span className="font-normal text-[16px] leading-4.5">
              {t("button.back")}
            </span>
          </Button>

          <Button
            type="success"
            onClick={() => navigate(TEACHER_PAGE_URL.update.path(Number(id)))}
            className="px-3"
          >
            <PencilSquareOutlined className="w-4 h-4 stroke-2" />
            <span className="font-normal text-[16px] leading-4.5">
              {t("button.edit")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default TeacherDetailPage;
