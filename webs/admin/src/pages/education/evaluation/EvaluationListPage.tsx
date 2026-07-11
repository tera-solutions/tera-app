/* Import: library */
import { useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";

/* Import: pages */
import EvaluationFilter from "./containers/EvaluationFilter";
import EvaluationTable from "./containers/EvaluationTable";
import EvaluationDetail from "./containers/EvaluationDetail";
import EvaluationFormModal from "./EvaluationFormModal";
import { IEvaluation, STATUS_TABS } from "./_interface";

const EvaluationListPage = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [keyword, setKeyword] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("");
  const [detail, setDetail] = useState<{
    open: boolean;
    record?: IEvaluation;
  }>({ open: false });
  const [edit, setEdit] = useState<{ open: boolean; record?: IEvaluation }>({
    open: false,
  });

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const statusTabs = [
    { key: "", label: t("common.all") },
    ...STATUS_TABS.map((s) => ({ key: s, label: t(`evaluation.status_${s}`) })),
  ];

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    evaluation_type: typeFilter || undefined,
    classification: classificationFilter || undefined,
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList title={t("evaluation.title")}>
        {/* Status tabs */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-0.5 mt-2 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveStatus(tab.key);
                resetPage();
              }}
              className={`px-3 py-1 text-[13px] rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeStatus === tab.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col gap-2 mb-3 xmd:flex-row xmd:items-center xmd:flex-wrap">
          <div className="relative w-full xmd:flex-1">
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
              placeholder={t("evaluation.search_placeholder")}
              className="w-full h-9 border border-gray-300 rounded pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
            />
          </div>
          <EvaluationFilter
            typeFilter={typeFilter}
            onChangeType={(v) => {
              setTypeFilter(v);
              resetPage();
            }}
            classificationFilter={classificationFilter}
            onChangeClassification={(v) => {
              setClassificationFilter(v);
              resetPage();
            }}
          />
        </div>

        <EvaluationTable
          params={tableParams}
          setParams={setParams}
          onView={(record) => setDetail({ open: true, record })}
          onEdit={(record) => setEdit({ open: true, record })}
        />
      </HeaderViewList>

      <EvaluationDetail
        open={detail.open}
        id={detail.record?.id}
        record={detail.record}
        onClose={() => setDetail({ open: false })}
      />

      <EvaluationFormModal
        open={edit.open}
        record={edit.record}
        onClose={() => setEdit({ open: false })}
      />
    </div>
  );
};

export default EvaluationListPage;
