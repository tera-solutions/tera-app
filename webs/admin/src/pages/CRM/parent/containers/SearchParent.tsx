/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";

interface SearchParentProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Ô tìm kiếm phụ huynh — bọc lại SearchBar dùng chung với placeholder của parent.
 */
const SearchParent = ({ value, onChange, className }: SearchParentProps) => {
  const { t } = useTranslation();
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder={t("parent.search_placeholder")}
      className={className}
    />
  );
};

export default SearchParent;
