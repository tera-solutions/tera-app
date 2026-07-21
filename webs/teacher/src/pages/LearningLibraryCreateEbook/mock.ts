import type { AttachmentDraft, EbookPageDraft } from "./_interface";

export const DEFAULT_PAGES: EbookPageDraft[] = [
  {
    id: "page-1",
    title: "Trang bìa",
    gradient: "from-sky-300 to-emerald-200",
    emoji: "🦒🦁🐘🐰",
    headline: "Animals World\nLet's Explore!",
    body: "",
    note: "",
  },
  {
    id: "page-2",
    title: "Giới thiệu",
    gradient: "from-amber-200 to-orange-100",
    emoji: "📖",
    headline: "Introduction",
    body: "In this book, you will learn about many amazing animals around the world.",
    note: "",
  },
  {
    id: "page-3",
    title: "Animals in the Farm",
    gradient: "from-lime-200 to-yellow-100",
    emoji: "🐄🐔🐖",
    headline: "Animals in the Farm",
    body: "Cows, chickens and pigs live on the farm. They give us milk, eggs and more.",
    note: "",
  },
  {
    id: "page-4",
    title: "Animals in the Forest",
    gradient: "from-emerald-200 to-teal-100",
    emoji: "🦊🐻🦉",
    headline: "Animals in the Forest",
    body: "Foxes, bears and owls live in the forest. They hide among the trees.",
    note: "",
  },
  {
    id: "page-5",
    title: "Fun Facts",
    gradient: "from-pink-200 to-rose-100",
    emoji: "✨🐾",
    headline: "Fun Facts",
    body: "Did you know a giraffe's tongue can be up to 50cm long?",
    note: "",
  },
];

export const DEFAULT_ATTACHMENTS: AttachmentDraft[] = [
  { id: "att-1", name: "Animals_World_Worksheets.pdf", sizeLabel: "1.2 MB" },
];
