import { useCallback, useEffect, useState } from "react";
import { Modal } from "tera-dls";

import WidgetState from "_common/components/WidgetState";

interface ImagePreviewModalProps {
  open: boolean;
  word: string;
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal = ({ open, word, imageUrl, onClose }: ImagePreviewModalProps) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  // Probe the deterministic storage URL with a throwaway `Image` (independent of whatever
  // <img> ends up rendered) so the loading/error state reflects a fresh fetch every time the
  // modal is reopened or retried, rather than trusting a persisted DOM node's stale onLoad.
  const probe = useCallback(() => {
    setStatus("loading");
    const img = new Image();
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (open) probe();
  }, [open, probe]);

  return (
    <Modal
      title={`Xem trước ảnh — ${word}`}
      open={open}
      onCancel={onClose}
      className="!w-[95%] xmd:!w-[480px]"
      footer={null}
    >
      <WidgetState isLoading={status === "loading"} isError={status === "error"} onRetry={() => setStatus("loading")}>
        <div className="flex items-center justify-center rounded-xl bg-slate-50 p-3">
          <img src={imageUrl} alt={word} className="max-h-[420px] w-full rounded-lg object-contain" />
        </div>
      </WidgetState>
    </Modal>
  );
};

export default ImagePreviewModal;
