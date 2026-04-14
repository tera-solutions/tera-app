interface EntityAppliedProps {
  departments: string[];
  employees: string[];
  job_titles: string[];
}
const EntityApplied = ({
  departments,
  employees,
  job_titles,
}: EntityAppliedProps) => {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="flex gap-1">
        <span className="text-gray-500">Phòng ban</span>
        <span className="flex-1 truncate">{departments?.join(", ")}</span>
      </p>
      <p className="flex gap-1">
        <span className="text-gray-500">Nhân viên</span>
        <span className="flex-1 truncate">{employees?.join(", ")}</span>
      </p>
      <p className="flex gap-1">
        <span className="text-gray-500">Chức danh</span>
        <span className="flex-1 truncate">{job_titles?.join(", ")}</span>
      </p>
    </div>
  );
};

export default EntityApplied;
