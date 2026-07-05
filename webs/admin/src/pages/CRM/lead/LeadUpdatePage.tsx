/* Import: library */
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowSmallLeftSolid,
  Breadcrumb,
  Button,
  BookmarkOutlined,
  ArrowLeftOutlined,
  Spin,
} from "tera-dls";

/* Import: packages */
import { IFormRef } from "@tera/commons/interfaces";
import useConfirm from "@tera/commons/hooks/useConfirm";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { LEAD_PAGE_URL } from "@tera/commons/constants/url";
import { messageWarning } from "@tera/commons/constants/message";

/* Import: services */
import { LeadService } from "@tera/modules";

/* Import: pages */
import LeadForm from "./containers/LeadForm";

const LeadUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Trang này chỉ dành cho mobile; desktop dùng modal trên trang danh sách.
  // Resize sang desktop → quay về danh sách và nhắn nó mở modal update.
  useEffect(() => {
    if (!isMobile) {
      navigate(LEAD_PAGE_URL.list.path, {
        replace: true,
        state: { openModal: { type: "update", id } },
      });
    }
  }, [isMobile, navigate, id]);
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);

  const { data, isPending } = LeadService.useLeadDetail({ id });
  const lead = data?.data?.lead ?? data?.data;

  const handleCloseConfirm = async () => {
    if (actionRef.current?.isDirty()) {
      confirm.warning({
        title: t("common.exit_title"),
        content: (
          <>
            <p>{messageWarning.WARNING_EXIT_1}</p>
            <p>{messageWarning.WARNING_EXIT_2}</p>
          </>
        ),
        onOk: () => navigate(-1),
      });
    } else navigate(-1);
  };

  return (
    <div className="tera-page-form gap-0! relative">
      <div className="sticky top-11.5 z-10 bg-[#F3F3F9]">
        <div className="page-header-v2">
          <div className="page-header-v2__breadcrumb">
            <div
              className="page-header__breadcrumb-back cursor-pointer"
              onClick={handleCloseConfirm}
            >
              <ArrowSmallLeftSolid className="h-6 w-6" />
            </div>
            <Breadcrumb
              separator={">"}
              items={[
                {
                  title: (
                    <a onClick={handleCloseConfirm}>
                      <span className="!text-blue-400 hover:!text-blue-600">
                        {t("lead.list")}
                      </span>
                    </a>
                  ),
                },
                { title: t("lead.update") },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-[5px] w-full p-4">
          <Spin spinning={isPending}>
            <LeadForm
              ref={actionRef}
              dataDetail={lead}
              type="update"
              onSuccess={() => navigate(-1)}
            />
          </Spin>
        </div>
        <div className="flex justify-between gap-2 mt-4 max-xmd:mb-[60px]">
          <Button onClick={() => navigate(-1)} type="light" className="btn-info px-3">
            <ArrowLeftOutlined className="w-4 h-4 stroke-2" />
            <span className="font-normal text-[16px] leading-4.5">{t("button.back")}</span>
          </Button>
          <Button
            htmlType="submit"
            type="success"
            onClick={() => actionRef?.current?.submit()}
            className="page-header-btn px-3"
          >
            <BookmarkOutlined className="w-4 h-4 stroke-2" />
            <span className="font-normal text-[16px] leading-4.5">{t("button.save")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadUpdatePage;
