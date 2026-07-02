import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  notification,
  PaperClipOutlined,
  TrashOutlined,
  DatePicker,
} from "tera-dls";
import { IFileUpload } from "@tera/commons/interfaces";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import UploadFiles from "@tera/components/dof/UploadFiles";
import { ICertificate } from "pages/Hr/teacher/_interface";

const INPUT_CLASS =
  "w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500";

export const fileNameFromUrl = (url?: string) => {
  if (!url) return "";
  try {
    return decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? url);
  } catch {
    return url;
  }
};

interface Props {
  form: ICertificate;
  onChange: (patch: Partial<ICertificate>) => void;
}

const CertificateFormFields = ({ form, onChange }: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-1.5'>
        <label className='text-[13px] text-gray-600 font-medium'>
          {t("teacher.certificate_name")} <span className='text-red-500'>*</span>
        </label>
        <input
          value={form.certificate_name ?? ""}
          onChange={(e) => onChange({ certificate_name: e.target.value })}
          placeholder={t("form.enter_value", {
            key: t("teacher.certificate_name"),
          })}
          className={INPUT_CLASS}
        />
      </div>
      <div className='flex flex-col gap-1.5'>
        <label className='text-[13px] text-gray-600 font-medium'>
          {t("teacher.certificate_issuer")}
        </label>
        <input
          value={form.issuer ?? ""}
          onChange={(e) => onChange({ issuer: e.target.value })}
          placeholder={t("form.enter_value", {
            key: t("teacher.certificate_issuer"),
          })}
          className={INPUT_CLASS}
        />
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-[13px] text-gray-600 font-medium'>
            {t("teacher.certificate_issued_date")}
          </label>
          {isMobile ? (
            <input
              type='date'
              value={form.issued_date ?? ""}
              onChange={(e) => onChange({ issued_date: e.target.value })}
              className={INPUT_CLASS}
            />
          ) : (
            <DatePicker
              className='w-full'
              format='DD/MM/YYYY'
              placeholder='DD/MM/YYYY'
              allowClear
              value={
                form.issued_date
                  ? moment(form.issued_date, "YYYY-MM-DD")
                  : undefined
              }
              onChange={(date: any) =>
                onChange({
                  issued_date: date ? moment(date).format("YYYY-MM-DD") : "",
                })
              }
            />
          )}
        </div>
        <div className='flex flex-col gap-1.5'>
          <label className='text-[13px] text-gray-600 font-medium'>
            {t("teacher.certificate_expired_date")}
          </label>
          {isMobile ? (
            <input
              type='date'
              value={form.expired_date ?? ""}
              min={form.issued_date || undefined}
              onChange={(e) => onChange({ expired_date: e.target.value })}
              className={INPUT_CLASS}
            />
          ) : (
            <DatePicker
              className='w-full'
              format='DD/MM/YYYY'
              placeholder='DD/MM/YYYY'
              allowClear
              disabledDate={(d: any) =>
                form.issued_date
                  ? d && d.isBefore(moment(form.issued_date, "YYYY-MM-DD"), "day")
                  : false
              }
              value={
                form.expired_date
                  ? moment(form.expired_date, "YYYY-MM-DD")
                  : undefined
              }
              onChange={(date: any) =>
                onChange({
                  expired_date: date ? moment(date).format("YYYY-MM-DD") : "",
                })
              }
            />
          )}
        </div>
      </div>
      <div className='flex flex-col gap-1.5'>
        <label className='text-[13px] text-gray-600 font-medium'>
          {t("teacher.certificate_attachment")}
        </label>
        {form.attachment ? (
          <div className='flex items-center justify-between gap-2 px-3 py-2 rounded border border-gray-200 bg-gray-50'>
            <a
              href={form.attachment}
              target='_blank'
              rel='noreferrer'
              className='flex items-center gap-2 text-[13px] text-blue-600 hover:underline truncate'
            >
              <PaperClipOutlined className='w-4 h-4 shrink-0' />
              <span className='truncate'>{fileNameFromUrl(form.attachment)}</span>
            </a>
            <button
              type='button'
              onClick={() => onChange({ attachment: "" })}
              className='h-7 w-7 flex items-center justify-center rounded text-red-500 hover:bg-red-50 transition-colors shrink-0'
            >
              <TrashOutlined className='w-4 h-4' />
            </button>
          </div>
        ) : (
          <UploadFiles
            isSingle
            maxSize={10}
            onReceiveFiles={(file: IFileUpload) =>
              onChange({ attachment: (file as any)?.url })
            }
            onFailed={() =>
              notification.error({ message: t("common.error_message") })
            }
          >
            <div className='flex items-center gap-2 w-fit px-3 py-2 text-[13px] border border-dashed border-gray-300 rounded hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer'>
              <PaperClipOutlined className='w-4 h-4' />
              {t("teacher.certificate_attachment_upload")}
            </div>
          </UploadFiles>
        )}
      </div>
    </div>
  );
};

export default CertificateFormFields;
