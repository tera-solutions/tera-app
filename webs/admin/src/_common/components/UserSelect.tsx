/* Import: services */
import { UserService } from "@tera/modules";

/* Import: pages */
import SearchSelect from "./SearchSelect";

interface UserSelectProps {
  value?: string | number | null;
  /** user object đang gán (vd dataDetail.manager) để hiện đúng tên khi chưa có trong kết quả tìm */
  selectedUser?: { id?: number; full_name?: string } | null;
  onChange: (id: string, user?: any) => void;
  placeholder?: string;
  disabled?: boolean;
  /** hiện nút xóa lựa chọn (dùng cho filter) */
  allowClear?: boolean;
}

/**
 * Chọn 1 user có tìm kiếm phía server — alias tiện dụng của `SearchSelect` cố định
 * `useList = UserService.useUserList` + nhãn = `full_name`. Toàn bộ logic (trigger + dropdown
 * portal + debounce search) nằm trong `SearchSelect`, đây chỉ là lớp bọc để 13 chỗ "chọn user"
 * gọi cho gọn (không phải truyền lại `useList`/`getLabel` mỗi lần).
 */
const UserSelect = ({
  value,
  selectedUser,
  onChange,
  placeholder,
  disabled,
  allowClear,
}: UserSelectProps) => (
  <SearchSelect
    value={value}
    selectedItem={selectedUser}
    onChange={onChange}
    useList={UserService.useUserList}
    getLabel={(u) => u.full_name ?? `#${u.id}`}
    placeholder={placeholder}
    disabled={disabled}
    allowClear={allowClear}
  />
);

export default UserSelect;
