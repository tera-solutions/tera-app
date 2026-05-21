import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import "./main.css";

import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient();
root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
);
