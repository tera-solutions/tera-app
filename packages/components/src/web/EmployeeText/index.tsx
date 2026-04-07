import customTwMerge from "tailwind-merge.config";

interface IEmployeeTextProp {
  code: string;
  name: string;
  className?: string;
}

export const EmployeeText = (props: IEmployeeTextProp) => {
  const { code, name, className } = props;
  return (
    props && (
      <span className={customTwMerge("inline-flex gap-x-1", className)}>
        {code && <div className="text-green-500 truncate">[{code}]</div>}
        <div className="truncate">{name}</div>
      </span>
    )
  );
};
