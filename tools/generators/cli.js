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
};

// default: nếu không có flag → tạo cả 2
if (!options.api && !options.service) {
  options.api = true;
  options.service = true;
}

if (command === "entity") {
  if (!domain || !entity) {
    console.log(
      "Usage: npm run gen entity <domain> <entity> [--api|--service]",
    );
    process.exit(1);
  }

  genEntity(domain, entity, options);
}
