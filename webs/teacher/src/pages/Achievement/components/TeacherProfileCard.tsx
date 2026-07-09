import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { TeacherProfile } from "../_interface";

interface TeacherProfileCardProps {
  profile: TeacherProfile | undefined;
  loading?: boolean;
}

const TeacherProfileCard = ({ profile, loading }: TeacherProfileCardProps) => (
  <Card className="flex items-center">
    <WidgetState isLoading={loading}>
      <div className="flex items-center gap-4">
        <Avatar
          src={profile?.avatar_url}
          alt={profile?.full_name}
          sizeClassName="h-16 w-16"
          iconSizeClassName="[&_svg]:h-8 [&_svg]:w-8"
        />
        <div>
          <p className="text-lg font-bold text-slate-800">{profile?.full_name || "—"}</p>
          <p className="text-sm text-slate-400">{profile?.role_name}</p>
        </div>
      </div>
    </WidgetState>
  </Card>
);

export default TeacherProfileCard;
