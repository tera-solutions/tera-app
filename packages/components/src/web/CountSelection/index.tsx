import customTwMerge from "tailwind-merge.config";

interface CountSelection {
  count?: number;
  className?: string;
}
const CountSelection = ({ count, className }: CountSelection) => {
  return (
    <>
      {count ? (
        <div
          className={customTwMerge(
            "flex items-center p-5 mb-6 text-green-700 bg-green-300 shadow-xsm rounded-2xl h-9",
            className,
          )}
        >
          Đã chọn {count || 0} mục
        </div>
      ) : null}
    </>
  );
};

export default CountSelection;
