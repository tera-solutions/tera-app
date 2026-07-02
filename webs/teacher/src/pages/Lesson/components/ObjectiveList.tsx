import { CheckCircleOutlined } from "tera-dls";

interface ObjectiveListProps {
  objectives: string[];
}

const ObjectiveList = ({ objectives }: ObjectiveListProps) => {
  if (objectives.length === 0) {
    return (
      <p className="text-sm text-slate-400">Chưa có mục tiêu cho bài học này.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {objectives.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
          <CheckCircleOutlined className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default ObjectiveList;
