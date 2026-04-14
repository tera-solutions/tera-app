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
      "class-room",
      "lesson-plan",
      "lesson",
      "attendance",
      "evaluation",
      "student-level",
    ],
  },

  finance: {
    prefix: "fin",
    entities: ["invoice", "payment", "refund", "debt", "discount"],
  },

  wallet: {
    prefix: "fin",
    entities: ["wallet", "wallet-transaction"],
  },

  hr: {
    prefix: "hr",
    entities: ["teacher", "staff"],
  },

  notification: {
    prefix: "sys",
    entities: ["notification", "template"],
  },

  reporting: {
    prefix: "report",
    entities: [
      "attendance-report",
      "class-utilization-report",
      "lead-conversion-report",
      "revenue-report",
      "student-progress-report",
      "teacher-performance-report",
    ],
  },
};
