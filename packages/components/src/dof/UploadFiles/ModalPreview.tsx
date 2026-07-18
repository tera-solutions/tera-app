import { ArrowDownTrayOutlined, Button, DocumentOutlined, Modal, Spin } from "tera-dls";

type PreviewKind = "image" | "pdf" | "video" | "audio" | "office" | "unsupported";

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
const VIDEO_EXT = ["mp4", "webm", "mov", "avi", "mkv", "m4v", "mpg", "mpeg"];
const AUDIO_EXT = ["mp3", "wav", "ogg", "m4a", "aac", "flac"];
/** Rendered via Microsoft's Office Online viewer — requires `file.url` to be publicly reachable. */
const OFFICE_EXT = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

const getExtension = (name: string) => name?.split(".").pop()?.toLowerCase() ?? "";

const resolveKind = (name: string): PreviewKind => {
  const ext = getExtension(name);
  if (IMAGE_EXT.includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (VIDEO_EXT.includes(ext)) return "video";
  if (AUDIO_EXT.includes(ext)) return "audio";
  if (OFFICE_EXT.includes(ext)) return "office";
  return "unsupported";
};

interface ModalPreviewProps {
  open: boolean;
  handleClose: () => void;
  file: { name: string; url: string } | null;
  /** File is being fetched — show a spinner instead of the empty/unsupported state. */
  loading?: boolean;
}

function ModalPreview({ handleClose, open, file, loading }: ModalPreviewProps) {
  const renderLayout = () => {
    if (loading) {
      return (
        <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
          <Spin spinning />
        </div>
      );
    }
    if (!file?.url) return <UnsupportedPreview file={file} />;

    switch (resolveKind(file.name)) {
      case "image":
        return <img src={file.url} alt={file.name} />;
      case "video":
        return <video src={file.url} autoPlay controls />;
      case "audio":
        return (
          <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-4">
            <DocumentOutlined className="h-16 w-16 text-gray-300" />
            <audio src={file.url} controls className="w-full max-w-md" />
          </div>
        );
      case "pdf":
        return (
          <object
            title={file.name}
            data={`${file.url}#page=1&zoom=85`}
            type="application/pdf"
          >
            Không thể hiển thị file
          </object>
        );
      case "office":
        return (
          <iframe
            title={file.name}
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
          />
        );
      default:
        return <UnsupportedPreview file={file} />;
    }
  };

  return (
    <Modal
      title={loading ? "Đang tải..." : (file?.name ?? "Xem trước")}
      open={open}
      className="modal-preview"
      cancelText="Đóng"
      okButtonProps={{ className: "hidden" }}
      onCancel={handleClose}
    >
      <div className="modal-preview__body min-h-[60vh]">{renderLayout()}</div>
    </Modal>
  );
}

const UnsupportedPreview = ({ file }: { file: { name: string; url: string } | null }) => (
  <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-3 text-center">
    <DocumentOutlined className="h-16 w-16 text-gray-300" />
    <p className="text-gray-500">Không hỗ trợ xem trước loại file này</p>
    {file?.url && (
      <Button
        icon={<ArrowDownTrayOutlined />}
        onClick={() => window.open(file.url, "_blank", "noopener,noreferrer")}
      >
        Tải xuống để xem
      </Button>
    )}
  </div>
);

export default ModalPreview;
