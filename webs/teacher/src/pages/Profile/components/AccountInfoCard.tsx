import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { notification, PencilSquareOutlined, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Input from "@tera/components/dof/Control/Input";
import DatePicker from "@tera/components/dof/Control/DatePicker";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";
import { FileAPI } from "@tera/api/common/FileAPI";
import { ProfileService } from "@tera/modules/system";

import type { ProfileData, ProfileFormValues } from "../_interface";
import { GENDER_OPTIONS } from "../constants";

interface AccountInfoCardProps {
  profile: ProfileData | undefined;
  loading?: boolean;
}

const DATE_FORMAT = "YYYY-MM-DD";

const AccountInfoCard = ({ profile, loading }: AccountInfoCardProps) => {
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile?.avatar_url);

  const form = useForm<ProfileFormValues>({ mode: "onChange" });

  useEffect(() => {
    if (!profile) return;
    setAvatarUrl(profile.avatar_url);
    form.reset({
      full_name: profile.full_name,
      dob: profile.dob,
      gender: profile.gender,
      phone: profile.phone,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const { mutate: updateProfile, isPending } = ProfileService.useProfileUpdate();

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await FileAPI.upload(file);
      setAvatarUrl(uploaded.url);
      updateProfile(
        { avatar: uploaded.url },
        {
          onSuccess: () => notification.success({ message: "Cập nhật ảnh đại diện thành công" }),
          onError: (error: any) =>
            notification.error({ message: error?.data?.msg ?? "Không thể cập nhật ảnh đại diện" }),
        },
      );
    } catch {
      notification.error({ message: "Tải ảnh lên thất bại" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (values: ProfileFormValues) => {
    updateProfile(values, {
      onSuccess: () => {
        notification.success({ message: "Cập nhật thông tin thành công" });
        setEditing(false);
      },
      onError: (error: any) => {
        notification.error({
          message: error?.data?.msg ?? error?.message ?? "Không thể cập nhật thông tin",
        });
      },
    });
  };

  return (
    <Card>
      <WidgetState isLoading={loading}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative">
            <Avatar src={avatarUrl} alt={profile?.full_name} sizeClassName="h-20 w-20" />
            <label className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-brand text-white [&_svg]:h-3.5 [&_svg]:w-3.5">
              <PencilSquareOutlined />
              <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleAvatarSelect} disabled={uploading} />
            </label>
          </div>
          <p className="font-semibold text-slate-800">{profile?.full_name}</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`h-2 w-2 rounded-full ${profile?.is_online ? "bg-emerald-400" : "bg-slate-300"}`} />
            {profile?.is_online ? "Online" : "Offline"}
          </p>
        </div>

        {editing ? (
          <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)} className="mt-4">
            <FormTeraItem label="Họ tên" name="full_name" rules={[{ required: "Vui lòng nhập họ tên" }]}>
              <Input />
            </FormTeraItem>
            <FormTeraItem label="Ngày sinh" name="dob">
              <Controller
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <DatePicker
                    format={DATE_FORMAT}
                    value={field.value ? moment(field.value) : undefined}
                    onChange={(value: any) => field.onChange(value ? moment(value).format(DATE_FORMAT) : "")}
                  />
                )}
              />
            </FormTeraItem>
            <FormTeraItem label="Giới tính" name="gender">
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} options={GENDER_OPTIONS} onChange={field.onChange} />
                )}
              />
            </FormTeraItem>
            <FormTeraItem label="Số điện thoại" name="phone">
              <Input />
            </FormTeraItem>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => form.handleSubmit(handleSubmit)()}
                disabled={isPending}
                className="flex-1 rounded-lg bg-brand py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
            </div>
          </FormTera>
        ) : (
          <>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span>{profile?.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ngày sinh</span>
                <span>{profile?.dob ? moment(profile.dob).format("DD/MM/YYYY") : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Giới tính</span>
                <span>{GENDER_OPTIONS.find((g) => g.value === profile?.gender)?.label ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SĐT</span>
                <span>{profile?.phone || "—"}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-4 w-full rounded-lg border border-brand py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white"
            >
              Chỉnh sửa thông tin
            </button>
          </>
        )}
      </WidgetState>
    </Card>
  );
};

export default AccountInfoCard;
