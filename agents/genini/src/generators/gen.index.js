const fs = require("fs");
const path = require("path");

const ROOT_MODULE = path.resolve(process.cwd(), "../../services/modules/src");
const ROOT_API = path.resolve(process.cwd(), "../../services/api/src");

function isValidFile(file) {
  return (
    file.endsWith(".ts") &&
    !file.endsWith(".d.ts") &&
    file !== "index.ts"
  );
}

function generateIndex(dir) {
  const items = fs.readdirSync(dir);

  const exports = [];

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      generateIndex(fullPath);
      exports.push(`export * from "./${item}";`);
    } else if (stat.isFile() && isValidFile(item)) {
      const name = item.replace(".ts", "");
      exports.push(`export * from "./${name}";`);
    }
  });

  const indexPath = path.join(dir, "index.ts");

  const content = exports.sort().join("\n") + "\n";

  fs.writeFileSync(indexPath, content);

  console.log(`✔ Generated: ${indexPath}`);
}

// run
generateIndex(ROOT_MODULE);
generateIndex(ROOT_API);