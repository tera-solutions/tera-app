import classNames from "classnames";
import { useRef } from "react";
import { TrashOutlined } from "tera-dls";

interface FileUploadFieldProps {
  file: File | null;
  accept: string[];
  maxSize: number;
  maxSizeLabel: string;
  hint: string;
  invalidTypeMessage: string;
  disabled?: boolean;
  error?: string;
  onSelect: (file: File) => void;
  onError: (message: string) => void;
  onClear: () => void;
}

const FileUploadField = ({
  file,
  accept,
  maxSize,
  maxSizeLabel,
  hint,
  invalidTypeMessage,
  disabled,
  error,
  onSelect,
  onError,
  onClear,
}: FileUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;

    if (!accept.includes(picked.type)) {
      onError(invalidTypeMessage);
      return;
    }
    if (picked.size > maxSize) {
      onError(maxSizeLabel);
      return;
    }
    onSelect(picked);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        disabled={disabled}
        onChange={handleChange}
        className="hidden"
      />
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="truncate text-sm text-slate-700">{file.name}</span>
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className="shrink-0 text-slate-400 hover:text-red-500"
            aria-label="Xóa tệp"
          >
            <TrashOutlined className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={classNames(
            "flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 hover:border-brand hover:text-brand disabled:opacity-60",
            error && "border-red-500!",
          )}
        >
          {hint}
        </button>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileUploadField;
