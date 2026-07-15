/* Import: library */
import {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { Col, Row, Modal, notification, HomeOutlined } from "tera-dls";
import debounce from "lodash/debounce";

/* Import: packages */
import { IFormProps, IFileUpload } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import Select from "@tera/components/dof/Control/Select";
import TextArea from "@tera/components/dof/Control/TextArea";
import UploadFiles from "@tera/components/dof/UploadFiles";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import { RoomService, BranchService } from "@tera/modules";
import { RoomAPI } from "@tera/api";

/* Import: pages */
import { IRoomForm, ROOM_TYPES } from "pages/education/room/_interface";

const defaultValues: IRoomForm = {
  branch_id: "",
  room_code: "",
  room_name: "",
  avatar: "",
  floor: "",
  capacity: "",
  room_type: "",
  description: "",
};

const RoomForm = forwardRef<any, IFormProps & { onSuccess?: () => void }>(
  ({ dataDetail, type = "create", onSuccess }, ref) => {
    const isView = type === "detail";
    const isUpdate = type === "update";
    const { t } = useTranslation();

    const [showAvatarPreview, setShowAvatarPreview] = useState(false);

    const { data: branchData } = BranchService.useBranchList({
      params: { page: 1, per_page: 100, status: "active" } as any,
    });
    const branches: any[] = useMemo(() => {
      const list = branchData?.data?.items ?? [];
      const selected = dataDetail?.branch;
      // giữ option cho chi nhánh đang gán dù không nằm trong list active
      if (selected?.id && !list.some((b: any) => b.id === selected.id)) {
        return [...list, selected];
      }
      return list;
    }, [branchData, dataDetail]);

    const isUpdateRef = useRef(isUpdate);
    isUpdateRef.current = isUpdate;

    const currentIdRef = useRef(dataDetail?.id);
    currentIdRef.current = dataDetail?.id;

    // Check trùng mã phòng — list edu/room dùng param `search` (theo Postman)
    const checkCodeRef = useRef(
      debounce((code: string, resolve: (valid: boolean) => void) => {
        RoomAPI.getList({ params: { search: code, per_page: 5 } })
          .then((res) => {
            const items: any[] = res?.data?.items ?? [];
            resolve(
              !items.some(
                (item) =>
                  item.room_code === code && item.id !== currentIdRef.current,
              ),
            );
          })
          .catch(() => resolve(true));
      }, 500),
    );

    const schema = useMemo(
      () =>
        yup.object({
          room_code: yup
            .string()
            .required(t("validate.required"))
            .matches(/^[a-zA-Z0-9_-]+$/, t("validate.no_special_chars"))
            .test("unique-code", t("validate.code_exists"), (value) => {
              if (!value) return true;
              return new Promise((resolve) =>
                checkCodeRef.current(value, resolve),
              );
            }),
          room_name: yup.string().required(t("validate.required")),
          // update: backend không nhận branch_id (select bị disable) → chỉ required khi create
          branch_id: yup
            .string()
            .test("branch-required", t("validate.required"), (value) =>
              isUpdateRef.current ? true : !!value,
            ),
          room_type: yup.string().required(t("validate.required")),
          capacity: yup.string().optional(),
          floor: yup.string().optional(),
          description: yup.string().optional(),
        }),
      [t],
    );

    const form = useForm<IRoomForm>({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema) as any,
    });

    const { reset, formState, watch } = form;

    const avatarValue = watch("avatar" as any);

    const { mutate: onSubmit, isPending } = RoomService.useUpsertRoom();

    useEffect(() => {
      if (dataDetail?.id) {
        reset({
          branch_id: dataDetail.branch_id ? String(dataDetail.branch_id) : "",
          room_code: dataDetail.room_code ?? "",
          room_name: dataDetail.room_name ?? "",
          avatar: dataDetail.avatar ?? "",
          floor: dataDetail.floor ?? "",
          capacity:
            dataDetail.capacity != null ? String(dataDetail.capacity) : "",
          room_type: dataDetail.room_type ?? "",
          description: dataDetail.description ?? "",
        });
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: IRoomForm) => {
      const params = {
        // update: body backend không có branch_id → không gửi
        branch_id: isUpdate
          ? undefined
          : values.branch_id
            ? Number(values.branch_id)
            : undefined,
        room_code: values.room_code?.trim() || undefined,
        room_name: values.room_name?.trim() || undefined,
        avatar: values.avatar?.trim() || undefined,
        floor: values.floor?.trim() || undefined,
        capacity: values.capacity ? Number(values.capacity) : undefined,
        room_type: values.room_type || undefined,
        description: values.description?.trim() || undefined,
      };
      onSubmit(
        { id: dataDetail?.id, params },
        {
          onSuccess: () => {
            notification.success({
              message: isUpdate
                ? t("common.update_success")
                : t("common.create_success"),
            });
            onSuccess?.();
          },
          onError: (error: any) => {
            notification.error({
              message: error?.message || t("common.error_message"),
            });
          },
        },
      );
    };

    useImperativeHandle(ref, () => ({
      isValid: () => formState.isValid,
      submit: () => form.handleSubmit(handleSubmitForm)(),
      isDirty: () => formState.isDirty,
    }));

    return (
      <div>
        <FormTera
          form={form}
          onSubmit={handleSubmitForm}
          isLoading={isPending}
          isDisabled={isView}
        >
          <Row className='grid grid-cols-1 sm:grid-cols-2 gap-x-4'>
            {!isView && (
              <Col className='sm:col-span-2'>
                <label className='text-[13px] text-gray-600 font-medium mb-2 block text-center'>
                  {t("room.avatar")}
                </label>
                <div className='flex flex-col items-center gap-2 mb-3'>
                  <div className='relative group w-24 h-24'>
                    <div className='w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center'>
                      {avatarValue ? (
                        <img
                          src={avatarValue}
                          alt='avatar'
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <HomeOutlined className='w-8 h-8 text-gray-300' />
                      )}
                    </div>
                    <UploadFiles
                      isSingle
                      maxSize={10}
                      accept='image/*'
                      onReceiveFiles={(file: IFileUpload) =>
                        form.setValue("avatar" as any, (file as any)?.url, {
                          shouldDirty: true,
                        })
                      }
                      onFailed={() =>
                        notification.error({
                          message: t("common.error_message"),
                        })
                      }
                    >
                      <div className='absolute inset-0 rounded-lg flex items-center justify-center text-center px-1 bg-black/45 text-white text-[11px] font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                        {t("room.upload_avatar")}
                      </div>
                    </UploadFiles>
                  </div>
                  {avatarValue && (
                    <div className='flex items-center gap-3'>
                      <button
                        type='button'
                        onClick={() => setShowAvatarPreview(true)}
                        className='text-[13px] text-blue-500 hover:text-blue-600 transition-colors cursor-pointer'
                      >
                        {t("button.detail")}
                      </button>
                      <button
                        type='button'
                        onClick={() =>
                          form.setValue("avatar" as any, "", {
                            shouldDirty: true,
                          })
                        }
                        className='text-[13px] text-red-500 hover:text-red-600 transition-colors cursor-pointer'
                      >
                        {t("button.delete")}
                      </button>
                    </div>
                  )}
                </div>
              </Col>
            )}
            <Col>
              <FormTeraItem
                label={t("room.code")}
                name='room_code'
                rules={[{ required: t("validate.required") }]}
              >
                <Input placeholder='VD: A101, B202...' disabled={isView} />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("room.name")}
                name='room_name'
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={t("form.enter_value", { key: t("room.name") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("room.branch")}
                name='branch_id'
                rules={[{ required: t("validate.required") }]}
              >
                <Select
                  options={branches.map((b) => ({
                    value: String(b.id),
                    label: b.code ? `${b.name} (${b.code})` : b.name,
                  }))}
                  placeholder={t("form.enter_value", {
                    key: t("room.branch"),
                  })}
                  disabled={isView || isUpdate}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("room.type")}
                name='room_type'
                rules={[{ required: t("validate.required") }]}
              >
                <Select
                  options={ROOM_TYPES.map((type) => ({
                    value: type,
                    label: t(`room.type_${type}`),
                  }))}
                  placeholder={t("form.enter_value", { key: t("room.type") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem label={t("room.floor")} name='floor'>
                <Input
                  placeholder={t("form.enter_value", { key: t("room.floor") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem label={t("room.capacity")} name='capacity'>
                <Input
                  type='number'
                  min={0}
                  onKeyDown={(e: any) => {
                    if (["-", "+", "e", "E"].includes(e.key))
                      e.preventDefault();
                  }}
                  placeholder={t("form.enter_value", {
                    key: t("room.capacity"),
                  })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col className='sm:col-span-2'>
              <FormTeraItem label={t("room.description")} name='description'>
                <TextArea
                  rows={3}
                  placeholder={t("form.enter_value", {
                    key: t("room.description"),
                  })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
          </Row>
        </FormTera>
        {showAvatarPreview && (
          <Modal
            title={t("room.avatar")}
            open={showAvatarPreview}
            cancelText={t("button.close")}
            okButtonProps={{ className: "hidden" }}
            onCancel={() => setShowAvatarPreview(false)}
          >
            <img
              src={avatarValue}
              alt='avatar'
              className='max-h-[70vh] max-w-full mx-auto rounded'
            />
          </Modal>
        )}
      </div>
    );
  },
);

export default RoomForm;
