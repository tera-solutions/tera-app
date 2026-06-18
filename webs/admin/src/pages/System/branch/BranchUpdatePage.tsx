/* Import: library */
import { useRef } from "react";
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Spin,
  ArrowSmallLeftSolid,
  Breadcrumb,
  BookmarkOutlined,
  Button,
} from "tera-dls";

/* Import: packages */
import { IFormRef } from "@tera/commons/interfaces";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { messageWarning } from "@tera/commons/constants/message";
import { BRANCH_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { BranchService } from "@tera/modules";

/* Import: pages */
import BranchForm from "./containers/BranchForm";

const BranchUpdatePage = observer(() => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { id } = useParams();
  const { t } = useTranslation();

  const actionRef = useRef<IFormRef>(null);

  const { data, isPending } = BranchService.useBranchDetail({ id });
  const branch = data?.data?.branch ?? data?.data;

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
    } else {
      navigate(-1);
    }
  };

  const handleSaveForm = () => {
    actionRef?.current?.submit();
  };

  return (
    <div className="tera-page-form gap-0! relative">
      <div className="sticky top-11.25 z-10 bg-[#F3F3F9]">
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
                      <span className="text-blue-400! hover:text-blue-600!">
                        {t("branch.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("branch.update"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto max-xmd:pb-[60px]">
        <div className="bg-white rounded-[5px] w-full p-4">
          <Spin spinning={isPending}>
            <BranchForm
              dataDetail={branch}
              ref={actionRef}
              type="update"
              onSuccess={() => navigate(BRANCH_PAGE_URL.list.path)}
            />
          </Spin>
        </div>

        <div className="flex justify-end mt-2 max-xmd:mb-[60px]">
          <Button
            onClick={handleSaveForm}
            className="flex! items-center! gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl! bg-gradient-to-r! from-green-400! to-emerald-500! text-white! font-semibold! shadow-lg! shadow-emerald-200! hover:from-green-500! hover:to-emerald-600! hover:shadow-emerald-300! active:scale-95 transition-all duration-200 border-none!"
          >
            <BookmarkOutlined className="w-5 h-5 xmd:w-4 xmd:h-4" />
            <span className="text-base xmd:text-sm">{t("button.save")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default BranchUpdatePage;
