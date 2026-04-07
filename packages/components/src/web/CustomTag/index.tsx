import customTwMerge from "tailwind-merge.config";
interface ICustomTag {
  color: string;
  index?: number;
  title?: string;
  showIndex?: boolean;
  wrapperClassName?: string;
}
export default function CustomTag({
  color,
  index,
  title,
  showIndex = false,
  wrapperClassName,
}: ICustomTag) {
  return (
    <div
      className={customTwMerge(
        "text-blue-700 flex gap-1 items-center line-clamp-1",
        wrapperClassName,
      )}
    >
      <div className="relative">
        <span
          style={{
            background: color,
            opacity: "30%",
          }}
          className="absolute top-0 w-full h-full inline-flex items-center px-2 py-1 gap-1.5 font-normal rounded transition-opacity duration-300 ease-out overflow-hidden  "
        >
          <span className="hidden">{title}</span>
        </span>
        <span
          style={{
            color: color,
          }}
          className={customTwMerge(
            "relative w-full items-start bg-transparent inline-flex px-2 py-1 gap-1.5 font-normal rounded transition-opacity duration-300 ease-out overflow-hidden ",
          )}
        >
          {showIndex && <span className="shrink-0">{index + 1}.</span>}
          <span className="!opacity-100">{title}</span>
        </span>
      </div>
    </div>
  );
}
