import { ReactNode } from "react";
import { Button, CheckOutlined, Modal, XMarkOutlined } from "tera-dls";

/**
 * Shared shell for create/edit form modals. Every form modal in the app was
 * hand-rolling the same `Modal` props (title switch, okText/cancelText
 * defaults, destroyOnClose, onCancel=onClose) around wildly different form
 * internals (plain useState, react-hook-form + FormTera, or no form lib at
 * all for single-field modals). FormScaff standardizes only that shell —
 * it stays agnostic to how `children` manages its own state/validation, and
 * `onOk` is whatever the caller already uses to trigger submit (a plain
 * handler for useState forms, `() => form.handleSubmit(fn)()` for RHF).
 */
export interface FormScaffProps {
  open: boolean;
  onClose: () => void;
  /** Whether this instance is editing an existing record vs. creating a new one. */
  isEdit: boolean;
  titleCreate: string;
  titleEdit: string;
  /** Submit trigger — same function you'd otherwise pass to `Modal`'s `onOk`. */
  onOk: () => void;
  confirmLoading?: boolean;
  /** Defaults to "Lưu" when editing, "Tạo" when creating. */
  okText?: string;
  cancelText?: string;
  /** Modal width, e.g. `"!w-[95%] xmd:!w-[520px]"` — pass a literal string so Tailwind's JIT scanner picks it up. */
  className?: string;
  destroyOnClose?: boolean;
  /** Disable the ok button independent of `confirmLoading`, e.g. `{ disabled: !reason.trim() }`. */
  okButtonProps?: { disabled?: boolean };
  children: ReactNode;
}

const FormScaff = ({
  open,
  onClose,
  isEdit,
  titleCreate,
  titleEdit,
  onOk,
  confirmLoading,
  okText,
  cancelText = "Hủy",
  className = "!w-[95%] xmd:!w-[520px]",
  destroyOnClose = true,
  okButtonProps,
  children,
}: FormScaffProps) => (
  <Modal
    title={isEdit ? titleEdit : titleCreate}
    open={open}
    className={className}
    confirmLoading={confirmLoading}
    onOk={onOk}
    onCancel={onClose}
    destroyOnClose={destroyOnClose}
    footer={
      <div className="flex items-center justify-end gap-3">
        <Button
          outlined
          icon={<XMarkOutlined />}
          onClick={onClose}
          disabled={confirmLoading}
          className="min-w-28 justify-center text-brand border-brand hover:bg-brand"
        >
          {cancelText}
        </Button>
        <Button
          icon={<CheckOutlined />}
          loading={confirmLoading}
          disabled={okButtonProps?.disabled}
          onClick={onOk}
          className="min-w-28 justify-center whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          {okText ?? (isEdit ? "Lưu" : "Tạo")}
        </Button>
      </div>
    }
  >
    {children}
  </Modal>
);

export default FormScaff;
