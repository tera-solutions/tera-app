import { useState } from "react";
import { BoltOutlined, Button } from "tera-dls";

import Card from "_common/components/Card";

interface AISummaryPanelProps {
  answer: string;
}

interface HeuristicSummary {
  strengths: string[];
  weaknesses: string[];
  suggested_score: number;
}

/**
 * No backend AI-summary endpoint exists for assignment submissions — this is a
 * local, offline heuristic (word count / sentence variety) so the panel from
 * the mockup renders something plausible. Swap for a real API call if/when
 * one is added.
 */
const summarize = (answer: string): HeuristicSummary => {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length ? words.length / sentences.length : 0;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (words.length >= 40) strengths.push("Bài viết có độ dài phù hợp, nội dung đầy đủ");
  else weaknesses.push("Bài viết còn ngắn, cần bổ sung thêm ý");

  if (sentences.length >= 3) strengths.push("Cấu trúc câu rõ ràng, chia đoạn hợp lý");
  else weaknesses.push("Cần chia thêm câu/đoạn để bài viết mạch lạc hơn");

  if (avgWordsPerSentence > 4 && avgWordsPerSentence < 20)
    strengths.push("Độ dài câu cân đối, dễ đọc");
  else if (avgWordsPerSentence >= 20) weaknesses.push("Một số câu khá dài, nên tách ngắn lại");

  const lengthScore = Math.min(words.length / 10, 6);
  const structureScore = Math.min(sentences.length, 4);
  const suggested_score = Math.round(Math.min(lengthScore + structureScore, 10) * 2) / 2;

  return { strengths, weaknesses, suggested_score };
};

const AISummaryPanel = ({ answer }: AISummaryPanelProps) => {
  const [summary, setSummary] = useState<HeuristicSummary | null>(null);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">AI tóm tắt</p>
        <Button
          outlined
          icon={<BoltOutlined />}
          onClick={() => setSummary(summarize(answer))}
          disabled={!answer}
          className="text-brand border-brand hover:bg-brand"
        >
          Phân tích
        </Button>
      </div>

      {summary && (
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <p className="mb-1 font-medium text-emerald-600">Điểm mạnh</p>
            <ul className="list-inside list-disc text-slate-600">
              {summary.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-amber-600">Điểm cần cải thiện</p>
            <ul className="list-inside list-disc text-slate-600">
              {summary.weaknesses.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-slate-400">
            Gợi ý điểm số: <span className="font-semibold text-slate-600">{summary.suggested_score}</span>
          </p>
        </div>
      )}
    </Card>
  );
};

export default AISummaryPanel;
