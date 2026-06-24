import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Modal,
  notification,
  PlusCircleOutlined,
  PencilSquareOutlined,
  TrashOutlined,
  PaperClipOutlined,
} from "tera-dls";
import useConfirm from "@tera/commons/hooks/useConfirm";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";
import { TeacherService } from "@tera/modules";
import { ICertificate } from "pages/Hr/teacher/_interface";
import CertificateFormFields, { fileNameFromUrl } from "./CertificateFormFields";

interface Props {
  teacherId?: number | string;
}

const TeacherCertificate = ({ teacherId }: Props) => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICertificate | null>(null);
  const [form, setForm] = useState<ICertificate>({});

  const { data, isLoading } = TeacherService.useTeacherCertificateList({
    id: teacherId,
  });
  const { mutate: onCreate, isPending: isCreating } =
    TeacherService.useTeacherCertificateCreate();
  const { mutate: onUpdate, isPending: isUpdating } =
    TeacherService.useTeacherCertificateUpdate();
  const { mutate: onDelete } = TeacherService.useTeacherCertificateDelete();

  const certificates: ICertificate[] = data?.data?.items ?? data?.data ?? [];

  const openCreate = () => {
    if (isMobile) {
      navigate(TEACHER_PAGE_URL.certificateCreate.path(Number(teacherId)));
      return;
    }
    setEditing(null);
    setForm({});
    setModalOpen(true);
  };

  const openEdit = (cert: ICertificate) => {
    if (isMobile) {
      navigate(
        TEACHER_PAGE_URL.certificateUpdate.path(
          Number(teacherId),
          Number(cert.id),
        ),
      );
      return;
    }
    setEditing(cert);
    setForm({
      certificate_name: cert.certificate_name ?? "",
      issuer: cert.issuer ?? "",
      issued_date: cert.issued_date ? cert.issued_date.split("T")[0] : "",
      expired_date: cert.expired_date ? cert.expired_date.split("T")[0] : "",
      attachment: cert.attachment ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.certificate_name?.trim()) return;
    if (
      form.issued_date &&
      form.expired_date &&
      form.expired_date < form.issued_date
    ) {
      notification.error({ message: t("teacher.certificate_date_invalid") });
      return;
    }
    if (editing?.id) {
      onUpdate(
        { id: editing.id, params: form },
        {
          onSuccess: () => setModalOpen(false),
          onError: (e: any) =>
            notification.error({
              message: e?.message || t("common.error_message"),
            }),
        },
      );
    } else {
      onCreate(
        { id: teacherId, params: form },
        {
          onSuccess: () => setModalOpen(false),
          onError: (e: any) =>
            notification.error({
              message: e?.message || t("common.error_message"),
            }),
        },
      );
    }
  };

  const handleDelete = (cert: ICertificate) => {
    confirm.warning({
      title: t("common.delete_confirm_title"),
      content: t("common.delete_confirm_question"),
      onOk: () =>
        onDelete(
          { id: cert.id },
          {
            onError: (e: any) =>
              notification.error({
                message: e?.message || t("common.error_message"),
              }),
          },
        ),
    });
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div>
      <div className='flex justify-end mb-3'>
        <button
          type='button'
          onClick={openCreate}
          className='flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        >
          <PlusCircleOutlined className='w-4 h-4' />
          <span>{t("teacher.certificate_create")}</span>
        </button>
      </div>

      {isLoading ? (
        <div className='py-8 text-center text-[13px] text-gray-400'>
          {t("common.loading")}
        </div>
      ) : certificates.length === 0 ? (
        <EmptyTab />
      ) : (
        <div className='flex flex-col gap-2'>
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className='flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors'
            >
              <div className='flex flex-col gap-1'>
                <span className='text-[13px] font-semibold text-gray-800'>
                  {cert.certificate_name ?? "—"}
                </span>
                <span className='text-[12px] text-gray-500'>
                  {cert.issuer ?? "—"}
                </span>
                <div className='flex gap-3 mt-0.5'>
                  {cert.issued_date && (
                    <span className='text-[11px] text-gray-400'>
                      {t("teacher.certificate_issued_date")}:{" "}
                      {new Date(cert.issued_date).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                  {cert.expired_date && (
                    <span className='text-[11px] text-gray-400'>
                      {t("teacher.certificate_expired_date")}:{" "}
                      {new Date(cert.expired_date).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>
                {cert.attachment && (
                  <a
                    href={cert.attachment}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center gap-1 mt-0.5 text-[11px] text-blue-600 hover:underline w-fit'
                  >
                    <PaperClipOutlined className='w-3 h-3 shrink-0' />
                    <span className='truncate max-w-[200px]'>
                      {fileNameFromUrl(cert.attachment)}
                    </span>
                  </a>
                )}
              </div>
              <div className='flex items-center gap-1 shrink-0'>
                <button
                  type='button'
                  onClick={() => openEdit(cert)}
                  className='h-7 w-7 flex items-center justify-center rounded text-amber-500 hover:bg-amber-50 transition-colors'
                >
                  <PencilSquareOutlined className='w-4 h-4' />
                </button>
                <button
                  type='button'
                  onClick={() => handleDelete(cert)}
                  className='h-7 w-7 flex items-center justify-center rounded text-red-500 hover:bg-red-50 transition-colors'
                >
                  <TrashOutlined className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editing ? t("teacher.certificate_update") : t("teacher.certificate_create")}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        closeIcon={false}
        centered
        width={480}
        footer={
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={() => setModalOpen(false)}
              className='px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors'
            >
              {t("button.cancel")}
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={!form.certificate_name?.trim() || isSaving}
              className='px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isSaving ? t("common.saving") : t("button.save")}
            </button>
          </div>
        }
      >
        <CertificateFormFields
          form={form}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        />
      </Modal>
    </div>
  );
};

const EmptyTab = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
      <svg
        className='w-10 h-10 mb-2 text-gray-300'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
      <p className='text-sm'>{t("common.no_data")}</p>
    </div>
  );
};

export default TeacherCertificate;
