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
    // Collect bytes and decode once: decoding chunk by chunk breaks any
    // multi-byte character that straddles a chunk boundary. NUL bytes are
    // dropped: when a multi-byte character does not fit the end of React's
    // 2KB write buffer, React 18.3 flushes the buffer with the unused bytes
    // still zero, and browsers show them as "\uFFFD" (the contact form's
    // placeholder read "timeline\uFFFD\uFFFD…"). No character is lost, the
    // padding is only extra, and a NUL never belongs in an HTML document.
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
    });
    sink.on("finish", () => resolve(Buffer.concat(chunks).toString("utf8").replace(/\0/g, "")));

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
