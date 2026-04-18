const fs = require("fs");
const path = require("path");
const { toPascal, writeFile } = require("../core/utils");
const template = require("../templates/template.service");

const configPath = path.resolve(__dirname, `../modules.config.json`);

const MODULES = JSON.parse(fs.readFileSync(configPath, "utf-8"));

Object.entries(MODULES).forEach(([domain, config]) => {
  config.entities.forEach((entity) => {
    const Entity = toPascal(entity);

    const content = template({
      Entity,
      entity,
      domain,
    });

    const output = path.join(
      process.cwd(),
      `../../services/modules/src/${domain}/${entity}/${entity}.service.ts`,
    );

    writeFile(output, content);
    console.log("✅ SERVICE:", output);
  });
});
