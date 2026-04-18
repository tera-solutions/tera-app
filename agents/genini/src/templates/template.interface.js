module.exports = function templateInterface({ Entity, fields }) {
  const baseFields = fields
    .map((f) => {
      let type = "string";
      if (f.type === "number") type = "number";
      if (f.type === "boolean") type = "boolean";

      return `  ${f.key}?: ${type};`;
    })
    .join("\n");

  const formFields = fields
    .map((f) => {
      let type = "string";
      if (f.type === "number") type = "number";
      if (f.type === "boolean") type = "boolean";

      return `  ${f.key}: ${type};`;
    })
    .join("\n");

  return `/* Auto generate interface */

export interface I${Entity} {
  id?: number;
${baseFields}
}

export interface I${Entity}Form {
${formFields}
}
`;
};