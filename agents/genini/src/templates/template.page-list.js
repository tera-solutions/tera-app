module.exports = ({ entity, Entity, ENTITY }) => {
  return `/* Import: library */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderSearch from "@tera/components/web/HeaderViewList/HeaderSearch";
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { BUTTON_KEY } from "@tera/commons/constants/permission";
import { ${ENTITY.toUpperCase()}_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { ${Entity}Service } from "@tera/modules";

/* Import: pages */
import ${Entity}Table from "./containers/${Entity}Table";
import ${Entity}Filter from "./containers/${Entity}Filter";

const ${Entity}ListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
  });

  const [isFilter, setIsFilter] = useState(false);

  const { mutate: onExport } = ${Entity}Service.use${Entity}Export();

  return (
    <div className="p-2.5">
      <HeaderViewList
        title={t("${ENTITY}.title")}
        onClickFilter={() => setIsFilter(true)}
        buttonCreatingKey={BUTTON_KEY.${entity.toUpperCase()}_CREATE}
        buttonAddRender={() => (
          <Button onClick={() => navigate(${ENTITY.toUpperCase()}_PAGE_URL.create.path)}>
            <PlusCircleOutlined />
            {t("button.create")}
          </Button>
        )}
        dropdownItems={[
          {
            key: "export",
            label: t("button.export_excel"),
            onClick: () => onExport({ params }),
          },
        ]}
        actionLeftRender={<HeaderSearch onSearch={(v) => setParams(p => ({...p, keyword: v?.keyword, page: 1}))} />}
      >
        <${Entity}Table params={params} setParams={setParams} />
      </HeaderViewList>

      {isFilter && (
        <${Entity}Filter
          open={isFilter}
          onClose={() => setIsFilter(false)}
          onFilter={(v) => setParams(p => ({ ...p, ...v, page: 1 }))}
          initialValue={params}
        />
      )}
    </div>
  );
};

export default ${Entity}ListPage;
`;
};
