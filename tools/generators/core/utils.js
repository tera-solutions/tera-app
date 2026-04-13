const fs = require("fs");
const path = require("path");

const toPascal = (str) =>
  str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
};

module.exports = { toPascal, writeFile };