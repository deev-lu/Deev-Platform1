import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HubProvider } from "./session";
import HubApp from "./App";
import "./hub.css";

/**
 * DEEV Business Hub, its own bundle (hub.html), served under /hub by a Vercel
 * rewrite. The marketing site's bundle and prerender never load any of it.
 */
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/hub">
    <HubProvider>
      <HubApp />
    </HubProvider>
  </BrowserRouter>,
);
