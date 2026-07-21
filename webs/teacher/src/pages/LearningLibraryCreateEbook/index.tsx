import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  Button,
  ChevronRightOutlined,
  DocumentTextOutlined,
  EyeOutlined,
  PaperAirplaneOutlined,
  notification,
} from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import type { AttachmentDraft, DisplaySettings, EbookPageDraft, PublishSettings } from "./_interface";
import { DEFAULT_ATTACHMENTS, DEFAULT_PAGES } from "./mock";
import BasicInfoSection from "./components/BasicInfoSection";
import PageContentSection from "./components/PageContentSection";
import EbookSettingsSection from "./components/EbookSettingsSection";
import CoverAttachmentSection from "./components/CoverAttachmentSection";
import DisplaySettingsSection from "./components/DisplaySettingsSection";
import NoteSection from "./components/NoteSection";
import PublishShareSection from "./components/PublishShareSection";

const LearningLibraryCreateEbook = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("Animals World – Let's Explore!");
  const [language, setLanguage] = useState("en");
  const [description, setDescription] = useState(
    "Ebook giúp trẻ khám phá thế giới các loài động vật qua hình ảnh sinh động và từ vựng đơn giản.",
  );
  const [level, setLevel] = useState("beginner_6_8");
  const [audience, setAudience] = useState("kids");
  const [tags, setTags] = useState<string[]>(["Animals", "Vocabulary", "Nature", "Kids"]);

  const [pages, setPages] = useState<EbookPageDraft[]>(DEFAULT_PAGES);
  const [activePageId, setActivePageId] = useState(DEFAULT_PAGES[0].id);

  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [font, setFont] = useState("nunito");
  const [colorMode, setColorMode] = useState("dark");

  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [attachments, setAttachments] = useState<AttachmentDraft[]>(DEFAULT_ATTACHMENTS);

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    allowDownload: true,
    showTableOfContents: true,
    allowPrint: false,
  });

  const [note, setNote] = useState("");

  const [publishSettings, setPublishSettings] = useState<PublishSettings>({
    visibility: "all",
    classroomId: "",
    publishDate: "2025-05-15",
    status: "published",
  });

  const goBack = () => navigate(PATHS.learningLibrary);

  const handleComingSoon = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  const handleUploadCover = (file?: File) => {
    if (!file) {
      if (customCoverUrl) URL.revokeObjectURL(customCoverUrl);
      setCustomCoverUrl("");
      return;
    }
    setCustomCoverUrl(URL.createObjectURL(file));
  };

  const handleSaveDraft = () => {
    notification.success({ message: `Đã lưu nháp "${title || "ebook mới"}"` });
    goBack();
  };

  const handlePublish = () => {
    if (!title.trim()) {
      notification.warning({ message: "Vui lòng nhập tiêu đề ebook" });
      return;
    }
    notification.success({ message: `Đã xuất bản "${title}"` });
    goBack();
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-3 flex items-center gap-1.5 text-sm text-slate-500">
        <Link to={PATHS.learningLibrary} className="hover:text-brand">
          Học liệu
        </Link>
        <ChevronRightOutlined className="h-3.5 w-3.5 text-slate-300" />
        <Link to={`${PATHS.learningLibrary}/create`} className="hover:text-brand">
          Tạo mới học liệu
        </Link>
        <ChevronRightOutlined className="h-3.5 w-3.5 text-slate-300" />
        <span className="text-slate-700">Tạo Ebook</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Button
          outlined
          icon={<ArrowLeftOutlined />}
          className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
          onClick={goBack}
        >
          Quay lại
        </Button>
        <div className="flex items-center gap-2">
          <Button
            outlined
            icon={<DocumentTextOutlined />}
            className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            onClick={handleSaveDraft}
          >
            Lưu nháp
          </Button>
          <Button outlined icon={<EyeOutlined />} className="border-brand text-brand" onClick={handleComingSoon}>
            Xem trước
          </Button>
          <Button icon={<PaperAirplaneOutlined />} className="bg-brand hover:bg-brand/80" onClick={handlePublish}>
            Xuất bản
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <BasicInfoSection
            title={title}
            onTitleChange={setTitle}
            language={language}
            onLanguageChange={setLanguage}
            description={description}
            onDescriptionChange={setDescription}
            level={level}
            onLevelChange={setLevel}
            audience={audience}
            onAudienceChange={setAudience}
            tags={tags}
            onChangeTags={setTags}
          />

          <PageContentSection
            pages={pages}
            onChangePages={setPages}
            activeId={activePageId}
            onActiveIdChange={setActivePageId}
          />

          <PublishShareSection
            value={publishSettings}
            onChange={(patch) => setPublishSettings((s) => ({ ...s, ...patch }))}
          />
        </div>

        <div className="flex flex-col gap-4">
          <EbookSettingsSection
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            orientation={orientation}
            onOrientationChange={setOrientation}
            font={font}
            onFontChange={setFont}
            colorMode={colorMode}
            onColorModeChange={setColorMode}
          />

          <CoverAttachmentSection
            title={title}
            gradient={pages[0]?.gradient ?? "from-sky-300 to-emerald-200"}
            emoji={pages[0]?.emoji ?? "📘"}
            customCoverUrl={customCoverUrl}
            onUploadCover={handleUploadCover}
            onRemoveCover={() => handleUploadCover(undefined)}
            attachments={attachments}
            onChangeAttachments={setAttachments}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <DisplaySettingsSection
              value={displaySettings}
              onChange={(patch) => setDisplaySettings((s) => ({ ...s, ...patch }))}
            />

            <NoteSection value={note} onChange={setNote} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningLibraryCreateEbook;
