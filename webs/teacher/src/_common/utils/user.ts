export interface UserDisplay {
  name: string;
  role: string;
  roleName: string;
  initials: string;
}

const DEFAULT_DISPLAY: UserDisplay = {
  name: "Cô Ngọc",
  role: "TEACHER_ROLE",
  roleName: "Giáo viên",
  initials: "NG",
};

export const getUserDisplay = (user: any): UserDisplay => {
  const name = String(user?.name ?? user?.full_name ?? "").trim();
  if (!name) return DEFAULT_DISPLAY;

  const words = name.split(/\s+/);
  const initials = (
    words.length >= 2
      ? words[words.length - 2][0] + words[words.length - 1][0]
      : words[0].slice(0, 2)
  ).toUpperCase();

  const role = user.role;
  const roleName = user.role_name;

  return { name, role, roleName, initials };
};
