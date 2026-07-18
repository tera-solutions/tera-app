// Moved to `@tera/components/dof/AsyncSearchSelect` so every portal (admin/
// teacher/parent/student) shares one async entity-picker implementation.
// Re-exported here so existing imports in this app don't need to change.
export type { AsyncSearchSelectProps } from "@tera/components/dof/AsyncSearchSelect";
export { default } from "@tera/components/dof/AsyncSearchSelect";
