/* Import: library */
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowSmallLeftSolid,
  Breadcrumb,
  BookmarkOutlined,
  Button,
  Spin,
  notification,
} from "tera-dls";

/* Import: packages */
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: containers */
import CertificateFormFields from "./containers/CertificateFormFields";
import { ICertificate } from "./_interface";

const TeacherCertificateFormPage = observer(() => {
  const navigate = useNavigate();
  const { id, certificateId } = useParams();
  const { t } = useTranslation();

  const teacherId = Number(id);
  const isUpdate = !!certificateId;

  const [form, setForm] = useState<ICertificate>({});

  const { data, isLoading } = TeacherService.useTeacherCertificateList({
    id: teacherId,
  });
  const { mutate: onCreate, isPending: isCreating } =
    TeacherService.useTeacherCertificateCreate();
  const { mutate: onUpdate, isPending: isUpdating } =
    TeacherService.useTeacherCertificateUpdate();

  const certificates: ICertificate[] = data?.data?.items ?? data?.data ?? [];

  useEffect(() => {
    if (!isUpdate) return;
    const cert = certificates.find((c) => c.id === Number(certificateId));
    if (cert) {
      setForm({
        certificate_name: cert.certificate_name ?? "",
        issuer: cert.issuer ?? "",
        issued_date: cert.issued_date ? cert.issued_date.split("T")[0] : "",
        expired_date: cert.expired_date ? cert.expired_date.split("T")[0] : "",
        attachment: cert.attachment ?? "",
      });
    }
  }, [data, certificateId, isUpdate]);

  const isSaving = isCreating || isUpdating;

  const handleSave = () => {
    if (!form.certificate_name?.trim()) {
      notification.error({
        message: t("form.enter_value", { key: t("teacher.certificate_name") }),
      });
      return;
    }
    if (
      form.issued_date &&
      form.expired_date &&
      form.expired_date < form.issued_date
    ) {
      notification.error({ message: t("teacher.certificate_date_invalid") });
      return;
    }
    const onDone = {
      onSuccess: () => navigate(-1),
      onError: (e: any) =>
        notification.error({ message: e?.message || t("common.error_message") }),
    };
    if (isUpdate) {
      onUpdate({ id: Number(certificateId), params: form }, onDone);
    } else {
      onCreate({ id: teacherId, params: form }, onDone);
    }
  };

  return (
    <div className='tera-page-form gap-0! relative'>
      <div className='sticky top-11.5 z-10 bg-[#F3F3F9]'>
        <div className='page-header-v2'>
          <div className='page-header-v2__breadcrumb'>
            <div
              className='page-header__breadcrumb-back cursor-pointer'
              onClick={() => navigate(-1)}
            >
              <ArrowSmallLeftSolid className='h-6 w-6' />
            </div>
            <Breadcrumb
              separator={">"}
              items={[
                {
                  title: (
                    <a onClick={() => navigate(-1)}>
                      <span className='!text-blue-400 hover:!text-blue-600'>
                        {t("teacher.detail")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: isUpdate
                    ? t("teacher.certificate_update")
                    : t("teacher.certificate_create"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className='w-full max-w-3xl mx-auto max-xmd:pb-[60px]'>
        <div className='flex justify-end mb-2'>
          <Button
            onClick={handleSave}
            loading={isSaving}
            className='flex! items-center! gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl! bg-gradient-to-r! from-green-400! to-emerald-500! text-white! font-semibold! shadow-lg! shadow-emerald-200! hover:from-green-500! hover:to-emerald-600! hover:shadow-emerald-300! active:scale-95 transition-all duration-200 border-none!'
          >
            <BookmarkOutlined className='w-5 h-5 xmd:w-4 xmd:h-4' />
            <span className='text-base xmd:text-sm'>{t("button.save")}</span>
          </Button>
        </div>

        <div className='bg-white rounded-[5px] w-full p-4'>
          <Spin spinning={isUpdate && isLoading}>
            <CertificateFormFields
              form={form}
              onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
});

export default TeacherCertificateFormPage;
