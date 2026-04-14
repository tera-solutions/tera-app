const genEntity = require("./gen.entity");

const args = process.argv.slice(2);

const command = args[0]; // entity
const domain = args[1]; // system
const entity = args[2]; // business

// flags
const flags = args.slice(3);
const options = {
  api: flags.includes("--api"),
  service: flags.includes("--service"),
  all: flags.includes("--all"),
  force: flags.includes("--force"),
};

if (options.all) {
  options.api = true;
  options.service = true;
}

// default: nếu không có flag → tạo cả 2
if (!options.api && !options.service) {
  options.api = true;
  options.service = true;
}

if (command === "entity") {
  if (!domain || !entity) {
    console.log(`
Usage:
  npm run gen entity <domain> <entity> [--api|--service|--all] [--force]

Examples:
  npm run gen entity system business
  npm run gen entity crm lead --api
  npm run gen entity edu student --service
  npm run gen entity finance invoice --all --force
`);
    process.exit(1);
  }

  genEntity(domain, entity, options);
}
