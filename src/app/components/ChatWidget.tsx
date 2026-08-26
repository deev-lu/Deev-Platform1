import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageSquare, X, ArrowUp, Square, Eraser } from "lucide-react";
import L from "./L";
import { useT, useLocale, useLocalePath } from "../../lib/useT";
import { useIsMobile } from "../../lib/useIsMobile";
import { getConsent, onConsentChange } from "../../lib/consent";

/**
 * The site assistant.
 *
 * A launcher in the corner and a panel that streams an answer from /api/chat.
 * It answers about the studio, the portfolio and the SME grant, and sends
 * anyone with a real enquiry to the contact form, which is a person.
 *
 * Three things shape the implementation more than the design does:
 *
 *   - It ships dark until the key exists. The route answers 503 when
 *     ANTHROPIC_API_KEY is unset, so the widget asks once per tab whether it
 *     is configured and renders nothing if not. A launcher that opens onto an
 *     apology is worse than no launcher, and this keeps the feature out of the
 *     page entirely until someone decides to turn it on.
 *
 *   - Nothing it prints is HTML. The answer arrives as text and is rendered as
 *     text nodes; the only markup is the internal links, which are matched
 *     against the site's own routes rather than trusted from the model. A
 *     model that is talked into emitting a script tag emits the characters.
 *
 *   - The transcript lives in sessionStorage, so reopening the panel keeps the
 *     thread and closing the tab ends it. A chat about a company's plans is
 *     not something to leave on a shared machine for a year.
 */

const ENDPOINT = "/api/chat";
const PROBE_KEY = "deev_chat_ok";
const THREAD_KEY = "deev_chat_thread";
const MAX_CHARS = 1200;

interface Turn {
  role: "user" | "assistant";
  content: string;
}

/** Paths the assistant may link to, matched so a made-up URL stays text. */
const PATH = /(\/(?:fr\/|de\/)?(?:services|work|blog|contact|legal)(?:\/[a-z0-9-]+)?|\/#[a-z-]+)/g;

/** Session storage, but never fatal: private mode and blocked site data throw. */
const session = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* nothing to do: the thread simply will not survive a reopen */
    }
  },
  remove(key: string) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* as above */
    }
  },
};

export default function ChatWidget() {
  const t = useT();
  const locale = useLocale();
  const localePath = useLocalePath();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();

  /**
   * The cookie banner owns the bottom of the screen on a first visit, and on a
   * phone it spans the full width. Two overlays stacked on each other is a bad
   * first impression and, on the narrowest screens, an unreachable button, so
   * the launcher waits until the banner has been answered.
   */
  const [consented, setConsented] = useState(() => Boolean(getConsent()));
  useEffect(() => onConsentChange((r) => setConsented(Boolean(r))), []);

  const [ready, setReady] = useState<boolean | null>(() => {
    const cached = session.get(PROBE_KEY);
    return cached === null ? null : cached === "1";
  });
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>(() => {
    try {
      const raw = session.get(THREAD_KEY);
      return raw ? (JSON.parse(raw) as Turn[]) : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abort = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);

  /**
   * Ask the route whether it is configured, once per tab, when the browser is
   * otherwise idle. An empty body is a 400 when the key is set and a 503 when
   * it is not, which answers the question without spending a token.
   */
  useEffect(() => {
    if (ready !== null) return;
    const ask = () => {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      })
        .then((r) => r.status !== 503)
        .catch(() => false)
        .then((ok) => {
          session.set(PROBE_KEY, ok ? "1" : "0");
          setReady(ok);
        });
    };
    // Cancel with the same mechanism that scheduled it. requestIdleCallback
    // and setTimeout hand out small integers from separate pools, so calling
    // clearTimeout on an idle handle cancels whichever unrelated timeout
    // happens to hold that number. It cancelled the cookie banner.
    if (window.requestIdleCallback) {
      const handle = window.requestIdleCallback(ask, { timeout: 4000 });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(ask, 2500);
    return () => window.clearTimeout(handle);
  }, [ready]);

  useEffect(() => {
    if (turns.length) session.set(THREAD_KEY, JSON.stringify(turns.slice(-12)));
  }, [turns]);

  // Follow the answer as it streams in.
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [turns, streaming, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    input.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abort.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim().slice(0, MAX_CHARS);
      if (!question || streaming) return;

      setError(null);
      setDraft("");
      const history = [...turns, { role: "user" as const, content: question }];
      setTurns([...history, { role: "assistant" as const, content: "" }]);
      setStreaming(true);

      const controller = new AbortController();
      abort.current = controller;

      /** Replace the trailing placeholder as text arrives. */
      const grow = (chunk: string) =>
        setTurns((prev) => {
          const next = prev.slice();
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-12), locale }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          setTurns(history);
          setError(
            res.status === 429
              ? t.chat.errors.limited
              : res.status === 503
                ? t.chat.errors.unavailable
                : t.chat.errors.upstream,
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Server-sent events arrive as blocks separated by a blank line, and
          // a block can be split across reads.
          const blocks = buffer.split("\n\n");
          buffer = blocks.pop() ?? "";

          for (const block of blocks) {
            const event = block.match(/^event: (.+)$/m)?.[1];
            const raw = block.match(/^data: (.+)$/m)?.[1];
            if (!event || !raw) continue;
            let data: { text?: string; error?: string };
            try {
              data = JSON.parse(raw);
            } catch {
              continue;
            }
            if (event === "delta" && data.text) grow(data.text);
            if (event === "error") {
              setError(
                data.error === "busy"
                  ? t.chat.errors.busy
                  : data.error === "refused"
                    ? t.chat.errors.refused
                    : t.chat.errors.upstream,
              );
            }
          }
        }

        // A stream that produced nothing is a failure the visitor can see.
        setTurns((prev) =>
          prev[prev.length - 1]?.role === "assistant" && !prev[prev.length - 1].content
            ? prev.slice(0, -1)
            : prev,
        );
      } catch (e) {
        if ((e as Error).name === "AbortError") {
          setTurns((prev) =>
            prev[prev.length - 1]?.content ? prev : prev.slice(0, -1),
          );
          return;
        }
        setTurns(history);
        setError(navigator.onLine ? t.chat.errors.upstream : t.chat.errors.offline);
      } finally {
        setStreaming(false);
        abort.current = null;
      }
    },
    [turns, streaming, locale, t],
  );

  const clear = () => {
    abort.current?.abort();
    setTurns([]);
    setError(null);
    session.remove(THREAD_KEY);
    input.current?.focus();
  };

  if (ready === false || !consented) return null;

  const motionProps = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
      };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            {...motionProps}
            transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="false"
            aria-label={t.chat.title}
            className="fixed z-[60] flex flex-col border border-[var(--line-strong)] bg-[var(--surface-0)] shadow-2xl inset-x-3 bottom-3 top-20 sm:inset-x-auto sm:top-auto sm:right-5 sm:bottom-24 sm:w-[400px] sm:h-[min(620px,calc(100vh-9rem))]"
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <header className="flex items-start gap-3 px-5 py-4 border-b border-[var(--line)]">
              <div className="min-w-0 flex-1">
                <div
                  className="text-[var(--text-hi)] font-medium"
                  style={{ fontSize: "var(--t-body)", letterSpacing: "-0.01em" }}
                >
                  {t.chat.title}
                </div>
                <div
                  className="text-[var(--text-low)] mt-0.5"
                  style={{ fontSize: "var(--t-label)", lineHeight: 1.45 }}
                >
                  {t.chat.subtitle}
                </div>
              </div>
              {turns.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label={t.chat.clear}
                  title={t.chat.clear}
                  className="shrink-0 p-2 -m-1 text-[var(--text-low)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
                >
                  <Eraser className="w-4 h-4" strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcher.current?.focus();
                }}
                aria-label={t.chat.close}
                className="shrink-0 p-2 -m-1 text-[var(--text-low)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </header>

            <div ref={log} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              <p
                className="text-[var(--text-mid)]"
                style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
              >
                {t.chat.greeting}
              </p>

              {turns.map((turn, i) => (
                <div
                  key={i}
                  className={turn.role === "user" ? "self-end max-w-[85%]" : "max-w-full"}
                >
                  {turn.role === "user" ? (
                    <div
                      className="px-3.5 py-2.5 bg-[var(--signal)] text-white"
                      style={{
                        fontSize: "var(--t-small)",
                        lineHeight: 1.5,
                        borderRadius: "var(--radius-1)",
                      }}
                    >
                      {turn.content}
                    </div>
                  ) : (
                    <div
                      className="text-[var(--text-hi)] whitespace-pre-wrap"
                      style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}
                    >
                      <Answer text={turn.content} localePath={localePath} />
                      {streaming && i === turns.length - 1 && (
                        <span
                          aria-label={t.chat.thinking}
                          className={`inline-block w-1.5 h-4 ml-0.5 -mb-0.5 bg-[var(--signal-text)] ${
                            reduce || isMobile ? "" : "animate-pulse"
                          }`}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}

              {turns.length === 0 && (
                <div className="flex flex-col items-start gap-2 mt-1">
                  {t.chat.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-left px-3 py-2 border border-[var(--line)] text-[var(--text-mid)] hover:border-[var(--line-strong)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
                      style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <p
                  role="status"
                  className="text-[var(--text-mid)] border-l-2 border-[var(--signal)] pl-3"
                  style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
                >
                  {error}
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="border-t border-[var(--line)] px-4 py-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={input}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(draft);
                    }
                  }}
                  rows={1}
                  maxLength={MAX_CHARS}
                  placeholder={t.chat.placeholder}
                  aria-label={t.chat.placeholder}
                  className="flex-1 resize-none bg-transparent text-[var(--text-hi)] placeholder:text-[var(--text-low)] outline-none py-2 max-h-28"
                  style={{ fontSize: "var(--t-small)", lineHeight: 1.5 }}
                />
                <button
                  type={streaming ? "button" : "submit"}
                  onClick={streaming ? () => abort.current?.abort() : undefined}
                  disabled={!streaming && !draft.trim()}
                  aria-label={streaming ? t.chat.stop : t.chat.send}
                  className="shrink-0 grid place-items-center w-9 h-9 bg-[var(--signal)] text-white disabled:opacity-35 disabled:cursor-not-allowed transition-opacity duration-[var(--dur-1)]"
                  style={{ borderRadius: "var(--radius-1)" }}
                >
                  {streaming ? (
                    <Square className="w-3.5 h-3.5" strokeWidth={2} fill="currentColor" />
                  ) : (
                    <ArrowUp className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
              </div>

              <p
                className="text-[var(--text-low)] mt-2"
                style={{ fontSize: "var(--t-label)", lineHeight: 1.5 }}
              >
                {t.chat.notice}{" "}
                <L to="/legal" className="underline hover:text-[var(--text-mid)]">
                  {t.chat.noticeLink}
                </L>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcher}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.chat.close : t.chat.open}
        aria-expanded={open}
        className="fixed z-[60] bottom-5 right-5 grid place-items-center w-12 h-12 bg-[var(--signal)] text-white shadow-lg hover:opacity-90 transition-opacity duration-[var(--dur-1)]"
        style={{ borderRadius: "var(--radius-1)" }}
      >
        {open ? (
          <X className="w-5 h-5" strokeWidth={1.75} />
        ) : (
          <MessageSquare className="w-5 h-5" strokeWidth={1.75} />
        )}
      </button>
    </>
  );
}

/**
 * The answer, as text.
 *
 * Paths the site actually has become links; everything else, including
 * anything shaped like markup, stays a text node. There is no markdown parser
 * and no dangerouslySetInnerHTML here, which is the point.
 */
function Answer({
  text,
  localePath,
}: {
  text: string;
  localePath: (path: string) => string;
}) {
  const parts = text.split(PATH);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part;
        const style = "text-[var(--signal-text)] underline underline-offset-2";
        // A homepage section is a real navigation, so the browser's own
        // fragment handling puts the reader on it. withLocale strips any
        // prefix first, so a path the model wrote as /fr/work still resolves.
        return part.startsWith("/#") ? (
          <a key={i} href={`${localePath("/")}${part.slice(1)}`} className={style}>
            {part}
          </a>
        ) : (
          <L key={i} to={part} className={style}>
            {part}
          </L>
        );
      })}
    </>
  );
}
