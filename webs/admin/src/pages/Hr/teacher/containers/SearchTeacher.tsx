/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";

interface SearchTeacherProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Ô tìm kiếm giáo viên — bọc lại SearchBar dùng chung với placeholder của teacher.
 */
const SearchTeacher = ({ value, onChange, className }: SearchTeacherProps) => {
  const { t } = useTranslation();
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder={t("teacher.search_placeholder")}
      className={className}
    />
  );
};

export default SearchTeacher;
