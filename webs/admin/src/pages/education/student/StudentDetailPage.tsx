import { useRef } from "react";
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Spin,
  ArrowSmallLeftSolid,
  Breadcrumb,
  Button,
  BookmarkOutlined,
  ArrowLeftOutlined,
} from "tera-dls";

import { IFormRef } from "@tera/commons/interfaces";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { messageWarning } from "@tera/commons/constants/message";

import StudentForm from "./containers/StudentForm";
import { StudentService } from "@tera/modules";

const StudentDetailPage = observer(() => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { id } = useParams();

  const { t } = useTranslation();

  const actionRef = useRef<IFormRef>(null);

  const { data, isPending } = StudentService.useStudentDetail({ id });

  return (
    <div className="tera-page-form !gap-0 relative">
      <div className="sticky top-[45px] z-10 bg-[#F3F3F9]">
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
                      <span className="!text-blue-400 hover:!text-blue-600">
                        {t("student.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("student.update"),
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-[5px] w-full p-4">
          <Spin spinning={isPending}>
            <StudentForm
              type="detail"
              dataDetail={data?.data}
              ref={actionRef}
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
        </div>
      </div>
    </div>
  );
});

export default StudentDetailPage;
