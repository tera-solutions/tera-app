module.exports = ({ Entity, entity, domain }) => `
import { endpoint } from "~/_endpoint";
import api from "~/drivers";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "~/_interface";

export const ${Entity}API = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(\`\${endpoint}/${domain}/${entity}/list\`, params)
      .then((result) => result.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(\`\${endpoint}/${domain}/${entity}/detail/\${id}\`)
      .then((result) => result.data),

  create: async ({ params }: CreatePayload) =>
    await api
      .post(\`\${endpoint}/${domain}/${entity}/create\`, params)
      .then((result) => result.data),

  update: async ({ id, params }: UpdatePayload) =>
    await api
      .put(\`\${endpoint}/${domain}/${entity}/update/\${id}\`, params)
      .then((result) => result.data),

  delete: async ({ id }: DeletePayload) =>
    await api
      .delete(\`\${endpoint}/${domain}/${entity}/delete/\${id}\`)
      .then((result) => result.data),
};
`;