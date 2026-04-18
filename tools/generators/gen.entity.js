const path = require("path");
const { toPascal, writeFile } = require("./core/utils");
const apiTemplate = require("./core/template.api");
const serviceTemplate = require("./core/template.service");

const MODULES = require("../modules.config").MODULES;

module.exports = function (domain, entity, options) {
  const module = MODULES[domain];

  if (!module) {
    console.error(`❌ Domain "${domain}" not found`);
    return;
  }

  const Entity = toPascal(entity);

  // ===== API =====
  if (options.api) {
    const apiContent = apiTemplate({
      Entity,
      entity,
      domain: module.prefix,
    });

    const apiPath = path.join(
      process.cwd(),
      `services/api/src/${domain}/${entity}/${entity}.api.ts`,
    );

    writeFile(apiPath, apiContent);
    console.log("✅ API:", apiPath);
  }

  // ===== SERVICE =====
  if (options.service) {
    const serviceContent = serviceTemplate({
      Entity,
      entity,
      domain,
    });

    const servicePath = path.join(
      process.cwd(),
      `services/modules/src/${domain}/${entity}/${entity}.service.ts`,
    );

    writeFile(servicePath, serviceContent);
    console.log("✅ SERVICE:", servicePath);
  }

  console.log(`🚀 Done: ${domain}/${entity}`);
};
