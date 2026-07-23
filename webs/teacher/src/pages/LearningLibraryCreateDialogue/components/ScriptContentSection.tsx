import Card from "_common/components/Card";

import type { DialogueContentType, DialogueLineDraft, VocabularyItemDraft } from "../_interface";
import DialogueScriptTable from "./DialogueScriptTable";
import VocabularyListPanel from "./VocabularyListPanel";

interface ScriptContentSectionProps {
  contentType: DialogueContentType;
  dialogueLines: DialogueLineDraft[];
  onChangeDialogueLines: (lines: DialogueLineDraft[]) => void;
  vocabularyItems: VocabularyItemDraft[];
  onChangeVocabularyItems: (items: VocabularyItemDraft[]) => void;
}

const ScriptContentSection = ({
  contentType,
  dialogueLines,
  onChangeDialogueLines,
  vocabularyItems,
  onChangeVocabularyItems,
}: ScriptContentSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">2. Kịch bản &amp; Nội dung</p>

    {contentType === "dialogue" ? (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
        <DialogueScriptTable lines={dialogueLines} onChange={onChangeDialogueLines} />
        <VocabularyListPanel items={vocabularyItems} onChange={onChangeVocabularyItems} />
      </div>
    ) : (
      <VocabularyListPanel items={vocabularyItems} onChange={onChangeVocabularyItems} />
    )}
  </Card>
);

export default ScriptContentSection;
