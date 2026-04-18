module.exports = function templateCreatePage({ Entity, entity }) {
  const ENTITY = entity.toLowerCase();

  return `/* Import: library */
import { useRef } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowSmallLeftSolid,
  Breadcrumb,
  Button,
  BookmarkOutlined,
  ArrowLeftOutlined,
} from "tera-dls";

/* Import: packages */
import { IFormRef } from "@tera/commons/interfaces";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { messageWarning } from "@tera/commons/constants/message";

/* Import: pages */
import ${Entity}Form from "./containers/${Entity}Form";

const ${Entity}CreatePage = observer(() => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { t } = useTranslation();

  const actionRef = useRef<IFormRef>(null);

  const handleCloseConfirm = async () => {
    if (await actionRef.current?.getIsDirty()) {
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
                        {t("${ENTITY}.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("${ENTITY}.create"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-[5px] w-full p-4">
          <${Entity}Form ref={actionRef} type="create" />
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
            htmlType="submit"
            type="success"
            onClick={handleSaveForm}
            className="page-header-btn px-3"
          >
            <BookmarkOutlined className="w-4 h-4 stroke-2" />
            <span className="font-normal text-[16px] leading-4.5">
              {t("button.save")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ${Entity}CreatePage;
`;
};
