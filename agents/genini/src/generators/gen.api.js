const fs = require("fs");
const path = require("path");
const { toPascal, writeFile } = require("../core/utils");
const template = require("../templates/template.api");

const configPath = path.resolve(__dirname, `../modules.config.json`);

const MODULES = JSON.parse(fs.readFileSync(configPath, "utf-8"));

Object.entries(MODULES).forEach(([domain, config]) => {
  config.entities.forEach((entity) => {
    const Entity = toPascal(entity);

    const content = template({
      Entity,
      entity,
      domain: config.prefix,
    });

    const output = path.join(
      process.cwd(),
      `../../services/api/src/${domain}/${entity}/${entity}.api.ts`,
    );

    writeFile(output, content);
    console.log("✅ API:", output);
  });
});
