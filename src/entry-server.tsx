/**
 * The static render.
 *
 * Every page of this site used to ship four characters of body text: the word
 * DEEV inside a loading shell. Googlebot runs the JavaScript and so saw the
 * real page, but the crawlers that feed language models mostly do not, which
 * meant that to them the site was blank. This renders the same React tree to
 * HTML at build time so the markup itself carries the words.
 *
 * renderToPipeableStream rather than renderToString: most of the page is
 * React.lazy behind Suspense, and only the streaming renderer waits for those
 * chunks. renderToString would have written the skeletons.
 */
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Writable } from "node:stream";
import { SiteTree } from "./app/App";
import { DICTS } from "./locales";
import "./styles/index.css";

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
    });
    sink.on("finish", () => resolve(html));

    const stream = renderToPipeableStream(
      <StaticRouter location={url}>
        {/* Dark is the default before the browser reads localStorage, which
            matches the inline script in index.html. */}
        <SiteTree theme="dark" toggleTheme={() => {}} />
      </StaticRouter>,
      {
        onAllReady() {
          stream.pipe(sink);
        },
        onError(err) {
          reject(err);
        },
      },
    );
  });
}

/**
 * The funding page's questions, for the prerender's FAQPage data.
 *
 * Read from the same dictionary the page renders, so the structured data and
 * the visible text cannot drift apart. Emitting a question Google shows that
 * the page does not answer is worse than emitting nothing.
 */
export function grantFaq(locale: "en" | "fr" | "de") {
  return DICTS[locale].grant.faq.items.map((i) => ({ q: i.q, a: i.a }));
}
