/* Import: services */
import { ClassRoomService } from "@tera/modules";

/* Import: pages */
import SearchSelect from "./SearchSelect";

interface ClassSelectProps {
  value?: string | number | null;
  /** class object đang gán — để hiện đúng tên khi không nằm trong 20 kết quả đang tải */
  selectedClass?: { id?: number; name?: string; code?: string } | null;
  onChange: (id: string, classRoom?: any) => void;
  placeholder?: string;
  disabled?: boolean;
  /** hiện nút xóa lựa chọn (dùng cho filter) */
  allowClear?: boolean;
}

/**
 * Chọn 1 lớp học có tìm kiếm phía server — alias của `SearchSelect` cố định
 * `useList = ClassRoomService.useClassRoomList` + nhãn = `name (code)` (giống `UserSelect`
 * với user). Dùng cho filter theo lớp (Điểm danh...) thay `FilterSelect` khi danh sách lớp
 * có thể vượt 100 dòng.
 */
const ClassSelect = ({
  value,
  selectedClass,
  onChange,
  placeholder,
  disabled,
  allowClear,
}: ClassSelectProps) => (
  <SearchSelect
    value={value}
    selectedItem={selectedClass}
    onChange={onChange}
    useList={ClassRoomService.useClassRoomList}
    getLabel={(c) => (c.code ? `${c.name} (${c.code})` : (c.name ?? `#${c.id}`))}
    placeholder={placeholder}
    disabled={disabled}
    allowClear={allowClear}
  />
);

export default ClassSelect;
