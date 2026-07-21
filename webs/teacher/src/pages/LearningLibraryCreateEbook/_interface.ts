export interface EbookPageDraft {
  id: string;
  title: string;
  gradient: string;
  emoji: string;
  headline: string;
  body: string;
  note: string;
}

export interface AttachmentDraft {
  id: string;
  name: string;
  sizeLabel: string;
}

export interface DisplaySettings {
  allowDownload: boolean;
  showTableOfContents: boolean;
  allowPrint: boolean;
}

export interface PublishSettings {
  visibility: string;
  classroomId: string;
  publishDate: string;
  status: string;
}
