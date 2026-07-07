export interface SkillScores {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
}

const SKILL_LABEL: Record<keyof SkillScores, string> = {
  listening: "Listening",
  speaking: "Speaking",
  reading: "Reading",
  writing: "Writing",
};

/** Horizontal 0-100 bars for the 4 language skills, shared by student detail + feedback screens. */
const SkillBars = ({ skills }: { skills: SkillScores }) => (
  <div className="flex flex-col gap-3">
    {(Object.keys(SKILL_LABEL) as (keyof SkillScores)[]).map((key) => (
      <div key={key}>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">{SKILL_LABEL[key]}</span>
          <span className="text-slate-400">{skills[key]}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${Math.max(0, Math.min(100, skills[key]))}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

export default SkillBars;
