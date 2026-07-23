import classNames from "classnames";
import { TextArea } from "tera-dls";

import {
  AVATAR_ACCEPT,
  AVATAR_MAX_SIZE,
  BIO_MAX_LENGTH,
  CERTIFICATE_ACCEPT,
  CERTIFICATE_MAX_SIZE,
} from "../../constants";
import type { RegisterErrors, RegisterFormData } from "../../types";
import FileUploadField from "../../components/FileUploadField";

interface ProfileFormProps {
  values: RegisterFormData;
  errors: RegisterErrors;
  disabled?: boolean;
  onChange: <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) => void;
  onFieldError: (field: keyof RegisterFormData, message: string) => void;
}

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const ProfileForm = ({
  values,
  errors,
  disabled,
  onChange,
  onFieldError,
}: ProfileFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Ảnh đại diện</label>
        <FileUploadField
          file={values.avatar}
          accept={AVATAR_ACCEPT}
          maxSize={AVATAR_MAX_SIZE}
          maxSizeLabel="Ảnh không được vượt quá 5MB"
          invalidTypeMessage="Chỉ chấp nhận ảnh jpg hoặc png"
          hint="Chọn ảnh (jpg, png · tối đa 5MB)"
          disabled={disabled}
          error={errors.avatar}
          onSelect={(file) => onChange("avatar", file)}
          onError={(message) => onFieldError("avatar", message)}
          onClear={() => onChange("avatar", null)}
        />
      </div>

      <div>
        <label className={labelClass}>Giới thiệu bản thân</label>
        <TextArea
          value={values.bio}
          disabled={disabled}
          maxLength={BIO_MAX_LENGTH}
          rows={4}
          placeholder="Chia sẻ đôi nét về bản thân..."
          onChange={(e) => onChange("bio", e.target.value)}
          className={classNames(
            "w-full resize-none rounded-xl bg-slate-50",
            errors.bio && "border-red-500!",
          )}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.bio ? (
            <p className="text-xs text-red-500">{errors.bio}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-slate-400">
            {values.bio.length}/{BIO_MAX_LENGTH}
          </span>
        </div>
      </div>

      <div>
        <label className={labelClass}>Chứng chỉ</label>
        <FileUploadField
          file={values.certificate}
          accept={CERTIFICATE_ACCEPT}
          maxSize={CERTIFICATE_MAX_SIZE}
          maxSizeLabel="Chứng chỉ không được vượt quá 10MB"
          invalidTypeMessage="Chỉ chấp nhận pdf, jpg hoặc png"
          hint="Chọn tệp (pdf, jpg, png · tối đa 10MB)"
          disabled={disabled}
          error={errors.certificate}
          onSelect={(file) => onChange("certificate", file)}
          onError={(message) => onFieldError("certificate", message)}
          onClear={() => onChange("certificate", null)}
        />
      </div>
    </div>
  );
};

export default ProfileForm;
