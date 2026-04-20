const fs = require("fs");
const path = require("path");
const templateInterface = require("../templates/template.interface");
const templateTable = require("../templates/template.page-table");
const templateTableModal = require("../templates/template.page-table-modal");
const templateFilter = require("../templates/template.page-filter");
const templateList = require("../templates/template.page-list");
const templateListModal = require("../templates/template.page-list-modal");
const templateForm = require("../templates/template.page-form");
const templateCreatePage = require("../templates/template.page-create");
const templateUpdatePage = require("../templates/template.page-update");
const templateDetailPage = require("../templates/template.page-detail");
const templateFormModal = require("../templates/template.page-form-modal");

const args = process.argv.slice(2);

const entityArg = args[0];
const isForce = args.includes("--force");

if (!entityArg) {
  console.error("❌ Missing entity name");
  process.exit(1);
}

const configPath = path.resolve(__dirname, `../sources/${entityArg}.json`);

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const { module: moduleName, entity, fields } = config;

if (!moduleName || !entity || !fields) {
  throw new Error("Invalid config");
}

const Entity = capitalize(entity);
const ENTITY = entity.toLowerCase();

/**
 * ===== Utils =====
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generatePageUrl({ ENTITY }) {
  return `
export const ${ENTITY.toUpperCase()}_PAGE_URL = {
  list: {
    key: PAGE_KEY.${ENTITY.toUpperCase()}_LIST_VIEW,
    path: "/${ENTITY}/list",
    shortenUrl: "/${ENTITY}/list",
  },
  create: {
    key: PAGE_KEY.${ENTITY.toUpperCase()}_CREATE_VIEW,
    path: "/${ENTITY}/create",
    shortenUrl: "/${ENTITY}/create",
  },
  detail: {
    key: PAGE_KEY.${ENTITY.toUpperCase()}_DETAIL_VIEW,
    path: (id: number) => "/${ENTITY}/detail/" + id,
    shortenUrl: "/${ENTITY}/detail/:id",
  },
  update: {
    key: PAGE_KEY.${ENTITY.toUpperCase()}_UPDATE_VIEW,
    path: (id: number) => "/${ENTITY}/update/" + id,
    shortenUrl: "/${ENTITY}/update/:id",
  },
};
`;
}

function appendUrlConstant(filePath, content, entity) {
  const file = fs.readFileSync(filePath, "utf-8");

  const constantName = `${entity.toUpperCase()}_PAGE_URL`;

  if (file.includes(`export const ${constantName}`)) {
    console.log(`⚠️ Skip URL (exists): ${constantName}`);
    return;
  }

  fs.appendFileSync(filePath, "\n" + content);
  console.log(`✅ Append URL: ${constantName} => ${filePath}`);
}

function generatePageKey({ ENTITY, prefix }) {
  const E = ENTITY.toUpperCase();

  return `
  ${E}_LIST_VIEW: "${prefix}_${ENTITY}_list_view",
  ${E}_DETAIL_VIEW: "${prefix}_${ENTITY}_detail_view",
  ${E}_CREATE_VIEW: "${prefix}_${ENTITY}_create_view",
  ${E}_UPDATE_VIEW: "${prefix}_${ENTITY}_update_view",
  ${E}_DELETE_VIEW: "${prefix}_${ENTITY}_delete_view",`;
}

function insertPageKey(filePath, content, ENTITY) {
  let file = fs.readFileSync(filePath, "utf-8");

  const keyCheck = `${ENTITY.toUpperCase()}_LIST_VIEW:`;

  if (file.includes(keyCheck)) {
    console.log(`⚠️ Skip PAGE_KEY (exists): ${ENTITY}`);
    return;
  }

  // tìm vị trí cuối object PAGE_KEY
  const regex = /export const PAGE_KEY = {([\s\S]*?)}/;
  const match = file.match(regex);

  if (!match) {
    throw new Error("❌ PAGE_KEY object not found");
  }

  const before = match[0].slice(0, -1); // bỏ dấu }
  const after = "}";

  const updatedBlock = `${before}${content}\n${after}`;

  file = file.replace(regex, updatedBlock);

  fs.writeFileSync(filePath, file);

  console.log(`✅ Insert PAGE_KEY: ${ENTITY} => ${filePath}`);
}

function generateButtonKey({ ENTITY, prefix, buttons }) {
  const E = ENTITY.toUpperCase();

  const map = {
    create: `${E}_CREATE: "${prefix}_${ENTITY}_create",`,
    update: `${E}_UPDATE: "${prefix}_${ENTITY}_update",`,
    delete: `${E}_DELETE: "${prefix}_${ENTITY}_delete",`,
    export: `${E}_EXPORT: "${prefix}_${ENTITY}_export",`,
  };

  return buttons
    .filter((c) => map[c])
    .map((c) => "  " + map[c])
    .join("\n");
}

function insertButtonKey(filePath, content, ENTITY) {
  let file = fs.readFileSync(filePath, "utf-8");

  const keyCheck = `${ENTITY.toUpperCase()}_CREATE:`;

  if (file.includes(keyCheck)) {
    console.log(`⚠️ Skip BUTTON_KEY (exists): ${ENTITY}`);
    return;
  }

  const regex = /export const BUTTON_KEY = {([\s\S]*?)}/;
  const match = file.match(regex);

  if (!match) {
    throw new Error("❌ BUTTON_KEY object not found");
  }

  const before = match[0].slice(0, -1);
  const after = "}";

  const updated = `${before}\n${content}\n${after}`;

  file = file.replace(regex, updated);

  fs.writeFileSync(filePath, file);

  console.log(`✅ Insert BUTTON_KEY: ${ENTITY} => ${filePath}`);
}

function writeFileSafe(filePath, content) {
  const exists = fs.existsSync(filePath);

  if (exists && !isForce) {
    console.log(`⚠️  Skip (exists): ${filePath}`);
    return;
  }

  fs.writeFileSync(filePath, content);

  if (exists && isForce) {
    console.log(`♻️ Overwrite: ${filePath}`);
  } else {
    console.log(`✅ Create: ${filePath}`);
  }
}

function generateRoute({ Entity, router }) {
  if (config?.mode === "page") {
    return `
        {/* BLOCK:${Entity} */}
        <Route path="${router.list}" element={<${Entity}ListPage />} />
        <Route path="${router.create}" element={<${Entity}CreatePage />} />
        <Route path="${router.update}" element={<${Entity}UpdatePage />} />
        <Route path="${router.detail}" element={<${Entity}DetailPage />} />`;
  }

  return `
        {/* BLOCK:${Entity} */}
        <Route path="${router.list}" element={<${Entity}ListPage />} />`;
}

function insertRoute(filePath, content, Entity, block) {
  let file = fs.readFileSync(filePath, "utf-8");
  const checkExits = `{/* BLOCK:${Entity} */}`;

  if (file.includes(checkExits)) {
    console.log(`⚠️ Skip Route (exists): ${Entity}`);
    return;
  }

  const marker = `{/* BLOCK:router */}`;

  if (!file.includes(marker)) {
    throw new Error(`❌ Block not found: ${Entity}`);
  }

  const updated = file.replace(marker, `${marker}\n${content}`);

  fs.writeFileSync(filePath, updated);

  console.log(`✅ Insert Route: ${Entity} => ${filePath}`);
}

function insertImport(filePath, ENTITY, moduleName, entity, block) {
  let file = fs.readFileSync(filePath, "utf-8");

  let importLine = `
/* IMPORT:${ENTITY} */
import ${ENTITY}ListPage from "pages/${moduleName}/${entity}/${ENTITY}ListPage";`;
  if (config?.mode === "page") {
    importLine = `
/* IMPORT:${ENTITY} */
import ${ENTITY}ListPage from "pages/${moduleName}/${entity}/${ENTITY}ListPage";
import ${ENTITY}CreatePage from "pages/${moduleName}/${entity}/${ENTITY}CreatePage";
import ${ENTITY}UpdatePage from "pages/${moduleName}/${entity}/${ENTITY}UpdatePage";
import ${ENTITY}DetailPage from "pages/${moduleName}/${entity}/${ENTITY}DetailPage";`;
  }

  if (file.includes(importLine)) {
    console.log(`⚠️ Skip Import (exists): ${ENTITY}`);
    return;
  }

  const marker = `/* IMPORT:router */`;

  if (!file.includes(marker)) {
    throw new Error(`❌ Import block not found: ${block}`);
  }

  const updated = file.replace(marker, `${marker}\n${importLine}`);

  fs.writeFileSync(filePath, updated);

  console.log(`✅ Insert Import: ${ENTITY} => ${filePath}`);
}

function generateI18n({ entity, title, fields }) {
  const obj = {
    title: `DANH SÁCH ${title?.toUpperCase()}`,
    list: `Danh sách ${title}`,
    create: `Thêm mới ${title}`,
    update: `Cập nhật ${title}`,
    detail: `Chi tiết ${title}`,
  };

  fields.forEach((col) => {
    obj[col.key] = col.title;
  });

  return `"${entity}": ${JSON.stringify(obj, null, 2)}`;
}

function insertI18n(filePath, content, entity) {
  const file = fs.readFileSync(filePath, "utf-8");

  const json = JSON.parse(file);

  if (json[entity]) {
    console.log(`⚠️ Skip i18n (exists): ${entity}`);
    return;
  }

  // parse content string → object
  const newEntry = JSON.parse(`{${content}}`);

  const updated = {
    ...json,
    ...newEntry,
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

  console.log(`✅ Insert i18n: ${entity} => ${filePath}`);
}

/**
 * ===== Paths =====
 */
const baseDir = `../../webs/admin/src/pages/${moduleName}/${entity}`;
const containersDir = `${baseDir}/containers`;

fs.mkdirSync(containersDir, { recursive: true });

/**
 * ===== Generate Interface =====
 */
const interfaceContent = templateInterface({
  entity,
  Entity,
  fields: config.fields || [],
});

const interfacePath = `${baseDir}/_interface.ts`;

writeFileSafe(interfacePath, interfaceContent);
/**
 * ===== Generate Filter =====
 */
const filterContent = templateFilter({
  Entity,
  ENTITY,
  moduleName,
  fields,
});

writeFileSafe(`${containersDir}/${Entity}Filter.tsx`, filterContent);

/**
 * ===== Generate Form =====
 */
const formContent = templateForm({
  module: moduleName,
  entity,
  Entity,
  fields,
});

writeFileSafe(`${containersDir}/${Entity}Form.tsx`, formContent);

if (config?.mode === "modal") {
  /**
   * ===== Generate Table modal =====
   */
  const tableContent = templateTableModal({
    Entity,
    ENTITY,
    moduleName,
    fields,
  });

  writeFileSafe(`${containersDir}/${Entity}Table.tsx`, tableContent);

  /**
   * ===== Generate Page modal =====
   */
  const pageContent = templateListModal({
    entity,
    Entity,
  });

  writeFileSafe(`${baseDir}/${Entity}ListPage.tsx`, pageContent);

  /**
   * ===== Generate Form Modal =====
   */
  const modalContent = templateFormModal({
    Entity,
    entity,
  });

  writeFileSafe(`${baseDir}/${Entity}FormModal.tsx`, modalContent);
}

if (config?.mode === "page") {
  /**
   * ===== Generate Table =====
   */
  const tableContent = templateTable({
    Entity,
    ENTITY,
    moduleName,
    fields,
  });

  writeFileSafe(`${containersDir}/${Entity}Table.tsx`, tableContent);

  /**
   * ===== Generate Page =====
   */
  const pageContent = templateList({
    entity,
    Entity,
    ENTITY,
  });

  writeFileSafe(`${baseDir}/${Entity}ListPage.tsx`, pageContent);

  /**
   * ===== Generate Create Page =====
   */
  const createContent = templateCreatePage({
    Entity,
    entity,
  });

  writeFileSafe(`${baseDir}/${Entity}CreatePage.tsx`, createContent);

  /**
   * ===== Generate Update Page =====
   */
  const updateContent = templateUpdatePage({
    Entity,
    entity,
  });

  writeFileSafe(`${baseDir}/${Entity}UpdatePage.tsx`, updateContent);

  /**
   * ===== Generate Detail Page =====
   */
  const detailContent = templateDetailPage({
    Entity,
    entity,
  });

  writeFileSafe(`${baseDir}/${Entity}DetailPage.tsx`, detailContent);
}

const permissionFilePath = path.resolve(
  __dirname,
  "../../../../packages/commons/src/constants/permission.ts",
);

const pageKeyContent = generatePageKey({
  ENTITY,
  prefix: config.prefix,
});

insertPageKey(permissionFilePath, pageKeyContent, ENTITY);

const buttonKeyContent = generateButtonKey({
  ENTITY,
  prefix: config.prefix,
  buttons: config.buttons || [],
});

insertButtonKey(permissionFilePath, buttonKeyContent, ENTITY);

const urlFilePath = path.resolve(
  __dirname,
  "../../../../packages/commons/src/constants/url.ts",
);

const urlContent = generatePageUrl({ ENTITY });

appendUrlConstant(urlFilePath, urlContent, ENTITY);

const routerPath = path.resolve(
  __dirname,
  "../../../../webs/admin/src/routers/index.tsx",
);

insertImport(routerPath, Entity, moduleName, entity, config.block);

const routeContent = generateRoute({
  Entity,
  router: config.router,
});

insertRoute(routerPath, routeContent, Entity);

const i18nPath = path.resolve(
  __dirname,
  "../../../../packages/assets/src/locales/vi/translation.json",
);

const i18nContent = generateI18n({
  entity,
  title: config.title,
  fields: config.fields,
});

insertI18n(i18nPath, i18nContent, entity);
