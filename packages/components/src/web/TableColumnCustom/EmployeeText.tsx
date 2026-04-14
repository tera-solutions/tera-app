import customTwMerge from "tailwind-merge.config";

interface IEmployeeTextProp {
  code: string;
  name: string;
  className?: string;
  classNameContent?: string;
}
export const EmployeeText = (props: IEmployeeTextProp) => {
  const { code, name, className, classNameContent } = props;
  return (
    <span className={className}>
      {code && <span className="text-green-500">[{code}]</span>}{" "}
      <span className={customTwMerge("break-word", classNameContent)}>
        {name}
      </span>
    </span>
  );
};
