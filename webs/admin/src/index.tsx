import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { TeraProvider } from "tera-dls";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "tera-dls/index.css";
import "./main.css";

import CrmProvider from "@tera/components/dof/CrmProvider";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient();
root.render(
  <DndProvider backend={HTML5Backend}>
    <QueryClientProvider client={queryClient}>
      <TeraProvider>
        <CrmProvider>
          <div>
            <App />
          </div>
        </CrmProvider>
      </TeraProvider>
    </QueryClientProvider>
  </DndProvider>,
);
