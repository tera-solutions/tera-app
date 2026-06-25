/* Import: library */
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowSmallLeftSolid,
  Breadcrumb,
  Button,
  PencilSquareOutlined,
} from "tera-dls";

/* Import: packages */
import { PARENT_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { ParentService } from "@tera/modules";

/* Import: pages */
import ParentDetailView from "./containers/ParentDetailView";

const ParentDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const { data, isPending } = ParentService.useParentDetail({ id });
  const parent = data?.data?.parent ?? data?.data;
  const statistics = data?.data?.statistics;

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
                        {t("parent.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("parent.detail"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <ParentDetailView
            parent={parent}
            statistics={statistics}
            loading={isPending}
          />
        </div>

        <div className="flex justify-end mt-2 max-xmd:mb-[60px]">
          <Button
            onClick={() => navigate(PARENT_PAGE_URL.update.path(Number(id)))}
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

export default ParentDetailPage;
