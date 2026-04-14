interface EmployeeColumnProps {
  name?: string;
  job_title?: string;
  position?: string;
  department?: string;
}
const EmployeeColumn = ({
  job_title,
  name,
  position,
  department,
}: EmployeeColumnProps) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm truncate">{name}</p>
      {department && (
        <p className="text-xs text-gray-500 truncate">{department}</p>
      )}
      {job_title && position && (
        <p className="text-xs text-gray-500 truncate">
          {job_title} - {position}
        </p>
      )}
    </div>
  );
};

export default EmployeeColumn;
