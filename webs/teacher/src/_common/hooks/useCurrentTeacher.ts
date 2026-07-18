import { ProfileService } from "@tera/modules/system";
import { TeacherService } from "@tera/modules/hr";

/**
 * The logged-in teacher's own `hr_teachers` row — there is no "my teacher
 * profile" endpoint, so it's looked up by `user_id` off the auth profile
 * (same pattern as `pages/MyInfo/index.tsx`). Needed anywhere a request body
 * wants the teacher entity id rather than the `users.id` (e.g. `LeaveRequest`
 * `requester_id` for `teacher_leave`, payroll/timesheet's own-teacher scoping).
 */
export const useCurrentTeacher = () => {
  const profileQuery = ProfileService.useProfile();
  const userId = profileQuery.data?.data?.id ?? null;

  const lookupQuery = TeacherService.useTeacherList(
    { params: { per_page: 1, filters: { user_id: userId } } },
    { enabled: !!userId },
  );
  const teacherId = lookupQuery.data?.data?.items?.[0]?.id ?? null;

  return {
    userId,
    teacherId,
    isLoading: profileQuery.isLoading || lookupQuery.isLoading,
  };
};

export default useCurrentTeacher;
