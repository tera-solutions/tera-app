import { AvatarItemProps } from "@tera/components/web/AvatarGroup/AvatarItem";

export type EmployeeFollowingType = {
  user_id: number;
  full_name?: string;
  isFollower: boolean;
  avatar_url?: string;
  code?: string;
};
export type AvatarFollower = AvatarItemProps & {
  id?: number;
};
