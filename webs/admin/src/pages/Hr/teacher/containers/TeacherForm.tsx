/* Import: library */
import {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  Col,
  Row,
  Modal,
  notification,
  PlusCircleOutlined,
  UserOutlined,
} from "tera-dls";
import debounce from "lodash/debounce";

/* Import: packages */
import { IFormProps, IFileUpload } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import Select, { SelectField } from "@tera/components/dof/Control/Select";
import TextArea from "@tera/components/dof/Control/TextArea";
import UploadFiles from "@tera/components/dof/UploadFiles";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import { TeacherService, BranchService } from "@tera/modules";
import { TeacherAPI } from "@tera/api";

/* Import: pages */
import DateField from "_common/components/DateField";
import UserSelect from "_common/components/UserSelect";
import { ITeacherForm } from "pages/Hr/teacher/_interface";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

// Chặn nhập số âm / ký tự khoa học ở input number (lương)
const preventNegativeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
};

const defaultValues: ITeacherForm = {
  code: "",
  full_name: "",
  avatar: "",
  branch_id: "",
  teacher_type: "",
  status: "",
  hourly_rate: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  address: "",
  identity_no: "",
  joined_at: "",
  employment_type: "",
  manager_id: "",
  monthly_salary: "",
  note: "",
  skills: [],
  bank_account: {
    bank_name: "",
    bank_account_number: "",
    bank_account_holder: "",
    bank_branch: "",
  },
};

const TeacherForm = forwardRef<any, IFormProps & { onSuccess?: () => void }>(
  ({ dataDetail, type = "create", onSuccess }, ref) => {
    const isView = type === "detail";
    const isUpdate = type === "update";
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("basic");
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [showAvatarPreview, setShowAvatarPreview] = useState(false);
    const [newSkillName, setNewSkillName] = useState("");
    const [newSkillLevel, setNewSkillLevel] = useState("");

    const { data: branchData } = BranchService.useBranchList({
      params: { page: 1, per_page: 100, status: "active" },
    });
    const branches: any[] = useMemo(() => {
      const list = branchData?.data?.items ?? [];
      const selected = dataDetail?.branch;
      // giữ option cho chi nhánh đang gán dù đã inactive (không nằm trong list active)
      if (selected?.id && !list.some((b: any) => b.id === selected.id)) {
        return [...list, selected];
      }
      return list;
    }, [branchData, dataDetail]);

    const isUpdateRef = useRef(isUpdate);
    isUpdateRef.current = isUpdate;

    const checkCodeRef = useRef(
      debounce((code: string, resolve: (valid: boolean) => void) => {
        TeacherAPI.getList({ params: { keyword: code, per_page: 5 } })
          .then((res) => {
            const items: any[] = res?.data?.items ?? [];
            resolve(!items.some((item) => item.code === code));
          })
          .catch(() => resolve(true));
      }, 500),
    );

    const currentIdRef = useRef(dataDetail?.id);
    currentIdRef.current = dataDetail?.id;

    const checkEmailRef = useRef(
      debounce((email: string, resolve: (valid: boolean) => void) => {
        TeacherAPI.getList({ params: { keyword: email, per_page: 20 } })
          .then((res) => {
            const items: any[] = res?.data?.items ?? [];
            const dup = items.some(
              (item: any) =>
                (item.email ?? "").toLowerCase() === email.toLowerCase() &&
                item.id !== currentIdRef.current,
            );
            resolve(!dup);
          })
          .catch(() => resolve(true));
      }, 500),
    );

    const checkPhoneRef = useRef(
      debounce((phone: string, resolve: (valid: boolean) => void) => {
        TeacherAPI.getList({ params: { keyword: phone, per_page: 20 } })
          .then((res) => {
            const items: any[] = res?.data?.items ?? [];
            const dup = items.some(
              (item: any) =>
                (item.phone ?? "") === phone &&
                item.id !== currentIdRef.current,
            );
            resolve(!dup);
          })
          .catch(() => resolve(true));
      }, 500),
    );

    const schema = useMemo(
      () =>
        yup.object({
          code: yup
            .string()
            .required(t("validate.required"))
            .matches(/^[a-zA-Z0-9_-]+$/, t("validate.no_special_chars"))
            .test("unique-code", t("validate.code_exists"), (value) => {
              if (!value || isUpdateRef.current) return true;
              return new Promise((resolve) =>
                checkCodeRef.current(value, resolve),
              );
            }),
          full_name: yup
            .string()
            .required(t("validate.required"))
            .matches(
              /^[^!@#$%^&*()+\=\[\]{}|;:'",<>?\/\\~`]+$/,
              t("validate.no_special_chars"),
            ),
          branch_id: yup.string().required(t("validate.required")),
          teacher_type: yup.string().required(t("validate.required")),
          status: yup
            .string()
            .test("status-required", t("validate.required"), (value) =>
              isUpdateRef.current ? true : !!value,
            ),
          hourly_rate: yup.string().required(t("validate.required")),
          gender: yup.string().optional(),
          dob: yup.string().optional(),
          email: yup
            .string()
            .required(t("validate.required"))
            .email(t("validate.email_format"))
            .test("unique-email", t("validate.email_exists"), (value) => {
              if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                return true;
              return new Promise((resolve) =>
                checkEmailRef.current(value, resolve),
              );
            }),
          phone: yup
            .string()
            .required(t("validate.required"))
            .matches(/^(0|\+84)\d{9,10}$/, t("validate.phone_format"))
            .test("unique-phone", t("validate.phone_exists"), (value) => {
              if (!value || !/^(0|\+84)\d{9,10}$/.test(value)) return true;
              return new Promise((resolve) =>
                checkPhoneRef.current(value, resolve),
              );
            }),
          address: yup.string().optional(),
          identity_no: yup.string().optional(),
          joined_at: yup.string().required(t("validate.required")),
          employment_type: yup.string().required(t("validate.required")),
          skills: yup
            .array()
            .of(
              yup.object({
                skill_name: yup.string().required(t("validate.required")),
                level: yup.string().required(t("validate.required")),
              }),
            )
            .min(1, t("validate.required"))
            .required(t("validate.required")),
        }),
      [t],
    );

    const form = useForm<ITeacherForm>({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema) as any,
    });

    const { reset, formState, watch } = form;
    const errors = formState.errors as any;

    const managerIdValue = watch("manager_id" as any);
    const avatarValue = watch("avatar" as any);

    const {
      fields: skillFields,
      append: appendSkill,
      remove: removeSkill,
    } = useFieldArray({ control: form.control, name: "skills" as any });

    const skillLevelLabels: Record<string, string> = {
      beginner: t("teacher.skill_level_beginner"),
      intermediate: t("teacher.skill_level_intermediate"),
      advanced: t("teacher.skill_level_advanced"),
      expert: t("teacher.skill_level_expert"),
    };

    const handleAddSkill = () => {
      if (!newSkillName.trim() || !newSkillLevel) return;
      appendSkill({ skill_name: newSkillName.trim(), level: newSkillLevel });
      setNewSkillName("");
      setNewSkillLevel("");
      setShowAddSkill(false);
    };

    const handleCancelSkill = () => {
      setNewSkillName("");
      setNewSkillLevel("");
      setShowAddSkill(false);
    };

    const queryClient = useQueryClient();
    const { mutate: onSubmit, isPending } = TeacherService.useUpsertTeacher();

    useEffect(() => {
      if (dataDetail?.id) {
        reset({
          code: dataDetail.code ?? "",
          full_name: dataDetail.full_name ?? "",
          avatar: dataDetail.avatar ?? "",
          branch_id: dataDetail.branch_id ? String(dataDetail.branch_id) : "",
          teacher_type: dataDetail.teacher_type ?? "",
          status: dataDetail.status ?? "",
          hourly_rate: dataDetail.hourly_rate ?? "",
          gender: dataDetail.gender ?? "",
          dob: dataDetail.dob ? dataDetail.dob.split("T")[0] : "",
          email: dataDetail.email ?? "",
          phone: dataDetail.phone ?? "",
          address: dataDetail.address ?? "",
          identity_no: dataDetail.identity_no ?? "",
          joined_at: dataDetail.joined_at
            ? dataDetail.joined_at.split("T")[0]
            : "",
          employment_type: dataDetail.employment_type ?? "",
          manager_id: dataDetail.manager_id
            ? String(dataDetail.manager_id)
            : "",
          monthly_salary: dataDetail.monthly_salary ?? "",
          note: dataDetail.note ?? "",
          skills:
            dataDetail.skills?.map((s) => ({
              skill_name: s.skill_name,
              level: s.level,
            })) ?? [],
          bank_account: {
            bank_name: dataDetail.bank_account?.bank_name ?? "",
            bank_account_number:
              dataDetail.bank_account?.bank_account_number ?? "",
            bank_account_holder:
              dataDetail.bank_account?.bank_account_holder ?? "",
            bank_branch: dataDetail.bank_account?.bank_branch ?? "",
          },
        });
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: ITeacherForm) => {
      const bank = values.bank_account;
      const hasBank = !!(
        bank?.bank_name?.trim() ||
        bank?.bank_account_number?.trim() ||
        bank?.bank_account_holder?.trim() ||
        bank?.bank_branch?.trim()
      );
      const params = {
        code: values.code?.trim() || undefined,
        full_name: values.full_name?.trim() || undefined,
        avatar: values.avatar?.trim() || undefined,
        branch_id: values.branch_id ? Number(values.branch_id) : undefined,
        teacher_type: values.teacher_type || undefined,
        status: isUpdate ? undefined : values.status || undefined,
        hourly_rate: values.hourly_rate
          ? Number(values.hourly_rate)
          : undefined,
        gender: values.gender || undefined,
        dob: values.dob || undefined,
        email: values.email?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        address: values.address?.trim() || undefined,
        identity_no: values.identity_no?.trim() || undefined,
        joined_at: values.joined_at || undefined,
        employment_type: (values as any).employment_type || undefined,
        manager_id: values.manager_id ? Number(values.manager_id) : undefined,
        monthly_salary: values.monthly_salary
          ? Number(values.monthly_salary)
          : undefined,
        note: values.note?.trim() || undefined,
        skills: values.skills?.length ? values.skills : undefined,
        bank_account: hasBank
          ? {
              bank_name: bank?.bank_name?.trim() || undefined,
              bank_account_number:
                bank?.bank_account_number?.trim() || undefined,
              bank_account_holder:
                bank?.bank_account_holder?.trim() || undefined,
              bank_branch: bank?.bank_branch?.trim() || undefined,
            }
          : undefined,
      };
      onSubmit(
        { id: dataDetail?.id, params },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
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

    // Error indicators per tab
    const tabErrors: Record<string, boolean> = {
      basic: !!(
        errors.code ||
        errors.full_name ||
        errors.phone ||
        errors.email ||
        errors.branch_id
      ),
      expertise: !!(errors.teacher_type || errors.skills),
      work: !!(
        errors.employment_type ||
        errors.joined_at ||
        errors.hourly_rate ||
        errors.status
      ),
    };

    const tabs = [
      { key: "basic", label: t("teacher.tab_basic") },
      { key: "expertise", label: t("teacher.tab_expertise_info") },
      { key: "work", label: t("teacher.tab_work") },
    ];

    return (
      <div>
        <FormTera
          form={form}
          onSubmit={handleSubmitForm}
          isLoading={isPending}
          isDisabled={isView}
        >
          {/* Tab bar */}
          <div className='flex border-b border-gray-200 mb-4 overflow-x-auto overflow-y-hidden scrollbar-none'>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type='button'
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tabErrors[tab.key] && (
                  <span className='w-1.5 h-1.5 rounded-full bg-red-500 shrink-0' />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Thông tin cơ bản */}
          <div className={activeTab === "basic" ? "block" : "hidden"}>
            <Row className='grid grid-cols-1 sm:grid-cols-2 gap-x-4'>
              {!isView && (
                <Col className='sm:col-span-2'>
                  <label className='text-[13px] text-gray-600 font-medium mb-2 block text-center'>
                    {t("teacher.avatar")}
                  </label>
                  <div className='flex flex-col items-center gap-2 mb-3'>
                    <div className='relative group w-20 h-20'>
                      <div className='w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center'>
                        {avatarValue ? (
                          <img
                            src={avatarValue}
                            alt='avatar'
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <UserOutlined className='w-8 h-8 text-gray-300' />
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
                        <div className='absolute inset-0 rounded-full flex items-center justify-center text-center px-1 bg-black/45 text-white text-[11px] font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                          {t("teacher.upload_avatar")}
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
                  label={t("teacher.code")}
                  name='code'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={isUpdate ? "" : "VD: GV001, GV002..."}
                    disabled={isView || isUpdate}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.name")}
                  name='full_name'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.name"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.branch")}
                  name='branch_id'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Select
                    options={branches.map((branch) => ({
                      value: String(branch.id),
                      label: branch.code
                        ? `${branch.name} (${branch.code})`
                        : branch.name,
                    }))}
                    placeholder={t("form.enter_value", {
                      key: t("teacher.branch"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("teacher.address")} name='address'>
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.address"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("teacher.dob")} name='dob'>
                  <DateField disabled={isView} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.identity_no")}
                  name='identity_no'
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.identity_no"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("teacher.gender")} name='gender'>
                  <Select
                    options={[
                      { value: "male", label: t("teacher.gender_male") },
                      { value: "female", label: t("teacher.gender_female") },
                      { value: "other", label: t("teacher.gender_other") },
                    ]}
                    placeholder={t("form.enter_value", {
                      key: t("teacher.gender"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.phone")}
                  name='phone'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.phone"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col className='sm:col-span-2'>
                <FormTeraItem
                  label={t("teacher.email")}
                  name='email'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.email"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Chuyên môn */}
          <div className={activeTab === "expertise" ? "block" : "hidden"}>
            <Row className='grid grid-cols-1'>
              <Col>
                <FormTeraItem
                  label={t("teacher.type")}
                  name='teacher_type'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Select
                    options={[
                      {
                        value: "part_time",
                        label: t("teacher.type_part_time"),
                      },
                      {
                        value: "full_time",
                        label: t("teacher.type_full_time"),
                      },
                      {
                        value: "assistant",
                        label: t("teacher.type_assistant"),
                      },
                      {
                        value: "freelancer",
                        label: t("teacher.type_freelancer"),
                      },
                    ]}
                    placeholder={t("form.enter_value", {
                      key: t("teacher.type"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>

              {/* Kỹ năng */}
              <Col>
                <div className='mb-3'>
                  <label className='text-[13px] text-gray-600 font-medium mb-2 block'>
                    {t("teacher.skill_name")}
                  </label>
                  {skillFields.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {skillFields.map((field, index) => {
                        const skill = form.watch(`skills.${index}` as any);
                        return (
                          <span
                            key={field.id}
                            className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[13px] text-blue-700'
                          >
                            {skill.skill_name}
                            {skill.level && (
                              <span className='text-blue-400'>·</span>
                            )}
                            {skill.level && skillLevelLabels[skill.level]}
                            {!isView && (
                              <button
                                type='button'
                                onClick={() => removeSkill(index)}
                                className='ml-0.5 text-blue-400 hover:text-red-500 leading-none transition-colors'
                              >
                                ×
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {errors?.skills && (
                    <p className='text-[12px] text-red-500 mb-2'>
                      {errors.skills.message ?? t("validate.required")}
                    </p>
                  )}
                  {!isView && showAddSkill && (
                    <div className='border border-gray-200 rounded-md p-3 bg-gray-50 mb-2'>
                      <div className='flex flex-col gap-2'>
                        <input
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder={t("form.enter_value", {
                            key: t("teacher.skill_name"),
                          })}
                          className={SELECT_CLASS}
                          style={{ borderRadius: "3px" }}
                        />
                        <SelectField
                          options={[
                            {
                              value: "beginner",
                              label: t("teacher.skill_level_beginner"),
                            },
                            {
                              value: "intermediate",
                              label: t("teacher.skill_level_intermediate"),
                            },
                            {
                              value: "advanced",
                              label: t("teacher.skill_level_advanced"),
                            },
                            {
                              value: "expert",
                              label: t("teacher.skill_level_expert"),
                            },
                          ]}
                          placeholder={t("teacher.skill_level")}
                          value={newSkillLevel}
                          onChange={(val) =>
                            setNewSkillLevel(String(val ?? ""))
                          }
                        />
                        <div className='flex gap-2 justify-end'>
                          <button
                            type='button'
                            onClick={handleCancelSkill}
                            className='px-3 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-100 transition-colors'
                          >
                            {t("button.cancel")}
                          </button>
                          <button
                            type='button'
                            onClick={handleAddSkill}
                            className='px-3 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                          >
                            {t("button.create")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {!isView && !showAddSkill && (
                    <button
                      type='button'
                      onClick={() => setShowAddSkill(true)}
                      className='flex items-center gap-1.5 text-[13px] text-blue-500 hover:text-blue-600 w-fit transition-colors'
                    >
                      <PlusCircleOutlined className='w-4 h-4' />
                      <span>{t("teacher.add_skill")}</span>
                    </button>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          {/* Tab 3: Thông tin làm việc */}
          <div className={activeTab === "work" ? "block" : "hidden"}>
            <Row className='grid grid-cols-1 sm:grid-cols-2 gap-x-4'>
              <Col>
                <FormTeraItem
                  label={t("teacher.employment_type")}
                  name='employment_type'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Select
                    options={[
                      {
                        value: "contract",
                        label: t("teacher.employment_type_contract"),
                      },
                      {
                        value: "collaborator",
                        label: t("teacher.employment_type_collaborator"),
                      },
                      {
                        value: "probation",
                        label: t("teacher.employment_type_probation"),
                      },
                    ]}
                    placeholder={t("form.enter_value", {
                      key: t("teacher.employment_type"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.joined_at")}
                  name='joined_at'
                  rules={[{ required: t("validate.required") }]}
                >
                  <DateField disabled={isView} disableFuture={false} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.salary_per_hour")}
                  name='hourly_rate'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    type='number'
                    min={0}
                    onKeyDown={preventNegativeKey}
                    placeholder={t("form.enter_value", {
                      key: t("teacher.salary_per_hour"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.monthly_salary")}
                  name='monthly_salary'
                >
                  <Input
                    type='number'
                    min={0}
                    onKeyDown={preventNegativeKey}
                    placeholder={t("form.enter_value", {
                      key: t("teacher.monthly_salary"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("teacher.manager")} name='manager_id'>
                  <UserSelect
                    value={managerIdValue}
                    selectedUser={(dataDetail as any)?.manager}
                    disabled={isView}
                    placeholder={t("form.enter_value", {
                      key: t("teacher.manager"),
                    })}
                    onChange={(id) =>
                      form.setValue("manager_id" as any, id, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FormTeraItem>
              </Col>
              {!isUpdate && (
                <Col>
                  <FormTeraItem
                    label={t("teacher.status")}
                    name='status'
                    rules={[{ required: t("validate.required") }]}
                  >
                    <Select
                      options={[
                        { value: "active", label: t("teacher.status_active") },
                        {
                          value: "suspended",
                          label: t("teacher.status_suspended"),
                        },
                        {
                          value: "resigned",
                          label: t("teacher.status_resigned"),
                        },
                      ]}
                      placeholder={t("form.enter_value", {
                        key: t("teacher.status"),
                      })}
                      disabled={isView}
                    />
                  </FormTeraItem>
                </Col>
              )}
              <Col className='sm:col-span-2'>
                <FormTeraItem label={t("teacher.note")} name='note'>
                  <TextArea
                    rows={3}
                    placeholder={t("teacher.note_placeholder")}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>

              <Col className='sm:col-span-2'>
                <div className='mt-1 mb-2 pt-2 border-t border-gray-100'>
                  <h3 className='text-[13px] font-semibold text-gray-700'>
                    {t("teacher.bank_info")}
                  </h3>
                </div>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.bank_name")}
                  name='bank_account.bank_name'
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.bank_name"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.bank_account_number")}
                  name='bank_account.bank_account_number'
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.bank_account_number"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.bank_account_holder")}
                  name='bank_account.bank_account_holder'
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.bank_account_holder"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("teacher.bank_branch")}
                  name='bank_account.bank_branch'
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("teacher.bank_branch"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>
        </FormTera>
        {showAvatarPreview && (
          <Modal
            title={t("teacher.avatar")}
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

export default TeacherForm;
