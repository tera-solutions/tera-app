export const MODULES = {
  system: {
    prefix: "system",
    entities: [
      "audit",
      "auth",
      "business",
      "permission",
      "role",
      "setting",
      "user",
    ],
  },

  crm: {
    prefix: "crm",
    entities: ["parent", "lead", "enrollment"],
  },

  education: {
    prefix: "edu",
    entities: [
      "student",
      "course",
      "class_room",
      "lesson_plan",
      "lesson",
      "attendance",
      "evaluation",
      "student_level",
    ],
  },

  finance: {
    prefix: "fin",
    entities: ["invoice", "payment", "refund", "debt", "discount"],
  },

  wallet: {
    prefix: "fin",
    entities: ["wallet", "wallet_transaction"],
  },

  hr: {
    prefix: "hr",
    entities: ["teacher", "staff"],
  },

  notification: {
    prefix: "sys",
    entities: ["notification", "template"],
  },
};
