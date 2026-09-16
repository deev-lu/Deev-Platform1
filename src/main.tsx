import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { localeFromPath } from "./lib/i18n";
import "./styles/index.css";

/**
 * Anhaengen statt ersetzen.
 *
 * Die ausgelieferten Seiten enthalten die fertig gerenderte Seite in #root;
 * `data-ssr` traegt die Sprache, in der sie gerendert wurde. Stimmt diese mit
 * der Sprache in der Adresse ueberein, wird hydriert: das Markup steht schon,
 * React uebernimmt nur die Interaktion.
 *
 * Frueher rief diese Datei immer createRoot auf, was das vorhandene Markup
 * verwarf und neu baute. Deshalb musste ein deckender Ladebildschirm davor,
 * und deshalb sah ein Besucher erst nach dem JavaScript etwas.
 *
 * Zwei Faelle fallen bewusst auf createRoot zurueck:
 *
 *   Ohne Markierung - in der Entwicklung und auf der 404-Seite - steht in
 *   #root nur der Ladebildschirm, den React ersetzen soll.
 *
 *   Bei abweichender Sprache. /de liegt als de/index.html vor; liefert ein
 *   Host darunter die englische Wurzel aus, enthaelt das Dokument die falsche
 *   Sprache. Hydrieren hiesse dann, englischen Text sichtbar zu deutschem
 *   umspringen zu lassen. Neu rendern ist in diesem Fall genau das Verhalten
 *   von vorher und faellt nicht auf.
 */
const root = document.getElementById("root")!;
const rendered = root.dataset.ssr;

if (rendered && rendered === localeFromPath(window.location.pathname)) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
