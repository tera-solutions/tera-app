/* Import: library */
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { PARENT_STUDENT_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { BranchService } from "@tera/modules";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import FilterButton from "@tera/components/dof/FilterButton";
import ParentStudentTable from "./containers/ParentStudentTable";
import ParentStudentFilterModal from "./containers/ParentStudentFilterModal";
import ParentStudentFormModal from "./ParentStudentFormModal";

const ParentStudentListPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { globalStore } = useStores();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [keyword, setKeyword] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [relationFilter, setRelationFilter] = useState("");
  const [primaryFilter, setPrimaryFilter] = useState("");
  const [billingFilter, setBillingFilter] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("");
  const [parentStatusFilter, setParentStatusFilter] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const activeFilterCount =
    (branchFilter ? 1 : 0) +
    (relationFilter ? 1 : 0) +
    (primaryFilter ? 1 : 0) +
    (billingFilter ? 1 : 0) +
    (studentStatusFilter ? 1 : 0) +
    (parentStatusFilter ? 1 : 0);

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  // Trang create/update/detail (mobile) redirect về đây khi resize sang desktop,
  // kèm state.openModal = { type, id } để mở tiếp đúng modal.
  const location = useLocation();
  useEffect(() => {
    const m = (location.state as any)?.openModal;
    if (m?.type) {
      setModalData({ open: true, type: m.type, id: m.id });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  // Chiều ngược: desktop đang mở modal → resize xuống mobile thì đóng modal
  // và chuyển sang trang riêng (create/update/detail) tương ứng.
  useEffect(() => {
    if (isMobile && modalData.open) {
      const { type, id } = modalData;
      setModalData({ open: false, type: "create", id: undefined });
      if (type === "update" && id != null)
        navigate(PARENT_STUDENT_PAGE_URL.update.path(id));
      else if (type === "detail" && id != null)
        navigate(PARENT_STUDENT_PAGE_URL.detail.path(id));
      else navigate(PARENT_STUDENT_PAGE_URL.create.path);
    }
  }, [isMobile, modalData, navigate]);

  const { data: branchData } = BranchService.useBranchList({
    params: { page: 1, per_page: 100, status: "active" },
  });
  const branches: any[] = branchData?.data?.items ?? [];

  const relationOptions = globalStore.getOptions("guardian_relation") ?? [];
  const studentStatusOptions = globalStore.getOptions("student_status") ?? [];
  const parentStatusOptions = globalStore.getOptions("parent_status") ?? [];

  const boolOptions = [
    { value: "1", label: t("parent_student.yes") },
    { value: "0", label: t("parent_student.no") },
  ];

  const tableParams = {
    ...params,
    search: keyword || undefined,
    branch_id: branchFilter || undefined,
    relation: relationFilter || undefined,
    is_primary_contact: primaryFilter || undefined,
    is_billing_contact: billingFilter || undefined,
    student_status: studentStatusFilter || undefined,
    parent_status: parentStatusFilter || undefined,
  };

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("parent_student.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(PARENT_STUDENT_PAGE_URL.create.path)
                : setModalData({ open: true, type: "create" })
            }
            className="rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1 cursor-pointer"
          >
            <div className="flex items-center gap-1 shrink-0">
              <PlusCircleOutlined className="w-5 h-5" />
              <span>{t("button.create")}</span>
            </div>
          </Button>
        )}
      >
        {/* Search + quick filters row */}
        <div className="grid grid-cols-2 gap-2 mb-3 mt-2 xmd:flex xmd:flex-nowrap xmd:items-center">
          <div className="col-span-2 flex items-center gap-2 xmd:order-1 xmd:flex-1 xmd:min-w-[180px]">
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  resetPage();
                }}
                placeholder={t("parent_student.search_placeholder")}
                className="w-full h-9 border border-gray-300 rounded pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <FilterButton
              onClick={() => setFilterModalOpen(true)}
              count={activeFilterCount}
            />
          </div>

          {/* Các select lọc — CHỈ hiện desktop (mobile đưa vào modal "Lọc") */}
          <div className="hidden xmd:contents">
            {/* Chi nhánh */}
            <FilterSelect
              allowClear
              className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[120px] xmd:order-2"
              value={branchFilter}
              placeholder={t("common.all_branches")}
              options={branches.map((branch) => ({
                value: String(branch.id),
                label: branch.name,
              }))}
              onChange={(v) => {
                setBranchFilter(v);
                resetPage();
              }}
            />

            {/* Quan hệ */}
            <FilterSelect
              allowClear
              className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[120px] xmd:order-3"
              value={relationFilter}
              placeholder={t("parent_student.all_relations")}
              options={relationOptions.map((opt: any) => ({
                value: opt.value,
                label: opt.label,
              }))}
              onChange={(v) => {
                setRelationFilter(v);
                resetPage();
              }}
            />

            {/* Người liên hệ chính */}
            <FilterSelect
              allowClear
              className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[120px] xmd:order-4"
              value={primaryFilter}
              placeholder={t("parent_student.is_primary_contact")}
              options={boolOptions}
              onChange={(v) => {
                setPrimaryFilter(v);
                resetPage();
              }}
            />

            {/* Người nhận hóa đơn */}
            <FilterSelect
              allowClear
              className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[120px] xmd:order-5"
              value={billingFilter}
              placeholder={t("parent_student.is_billing_contact")}
              options={boolOptions}
              onChange={(v) => {
                setBillingFilter(v);
                resetPage();
              }}
            />

            {/* Trạng thái HV */}
            <FilterSelect
              allowClear
              className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[120px] xmd:order-6"
              value={studentStatusFilter}
              placeholder={t("parent_student.student_status")}
              options={studentStatusOptions.map((opt: any) => ({
                value: opt.value,
                label: opt.label,
              }))}
              onChange={(v) => {
                setStudentStatusFilter(v);
                resetPage();
              }}
            />

            {/* Trạng thái PH */}
            <FilterSelect
              allowClear
              className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[120px] xmd:order-7"
              value={parentStatusFilter}
              placeholder={t("parent_student.parent_status")}
              options={parentStatusOptions.map((opt: any) => ({
                value: opt.value,
                label: opt.label,
              }))}
              onChange={(v) => {
                setParentStatusFilter(v);
                resetPage();
              }}
            />
          </div>
        </div>

        <ParentStudentTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <ParentStudentFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData?.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}

      <ParentStudentFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        baseParams={{ search: keyword || undefined }}
        value={{
          branch: branchFilter,
          relation: relationFilter,
          primary: primaryFilter,
          billing: billingFilter,
          studentStatus: studentStatusFilter,
          parentStatus: parentStatusFilter,
        }}
        onApply={(v) => {
          setBranchFilter(v.branch);
          setRelationFilter(v.relation);
          setPrimaryFilter(v.primary);
          setBillingFilter(v.billing);
          setStudentStatusFilter(v.studentStatus);
          setParentStatusFilter(v.parentStatus);
          resetPage();
        }}
        branchOptions={branches.map((branch) => ({
          value: String(branch.id),
          label: branch.name,
        }))}
        relationOptions={relationOptions.map((opt: any) => ({
          value: opt.value,
          label: opt.label,
        }))}
        boolOptions={boolOptions}
        studentStatusOptions={studentStatusOptions.map((opt: any) => ({
          value: opt.value,
          label: opt.label,
        }))}
        parentStatusOptions={parentStatusOptions.map((opt: any) => ({
          value: opt.value,
          label: opt.label,
        }))}
      />
    </div>
  );
});

export default ParentStudentListPage;
