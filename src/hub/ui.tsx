import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { useModal } from "../lib/useModal";
import { useHub } from "./session";
import type { HubLang } from "./types";

// ── Data loading ────────────────────────────────────────────

/** Load something, show it, reload on demand. Errors become a message, never a crash. */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const seq = useRef(0);
  const run = useCallback(async () => {
    const n = ++seq.current;
    setLoading(true);
    try {
      const v = await fn();
      if (n === seq.current) {
        setData(v);
        setError(false);
      }
    } catch {
      if (n === seq.current) setError(true);
    } finally {
      if (n === seq.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => {
    run();
  }, [run]);
  return { data, error, loading, reload: run, setData };
}

// ── Formatting ──────────────────────────────────────────────

const LOCALE: Record<HubLang, string> = { en: "en-GB", fr: "fr-LU", de: "de-LU" };

export function useFmt() {
  const { lang, t } = useHub();
  const loc = LOCALE[lang];
  return {
    money: (v: number | null | undefined) =>
      v == null ? "–" : new Intl.NumberFormat(loc, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v),
    num: (v: number | null | undefined) => (v == null ? "–" : new Intl.NumberFormat(loc).format(v)),
    date: (iso: string | null | undefined) =>
      iso ? new Intl.DateTimeFormat(loc, { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)) : "–",
    dateTime: (iso: string | null | undefined) =>
      iso ? new Intl.DateTimeFormat(loc, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)) : "–",
    day: (iso: string | null | undefined) => {
      if (!iso) return "–";
      const d = new Date(iso);
      const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
      const diff = Math.round((start(d) - start(new Date())) / 86_400_000);
      if (diff === 0) return t.date.today;
      if (diff === 1) return t.date.tomorrow;
      if (diff === -1) return t.date.yesterday;
      return new Intl.DateTimeFormat(loc, { day: "numeric", month: "short" }).format(d);
    },
  };
}

export const fullName = (c?: { first_name?: string | null; last_name?: string | null } | null) =>
  [c?.first_name, c?.last_name].filter(Boolean).join(" ") || "–";

export const splitList = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 30);

export const numOrNull = (s: string) => {
  const n = Number(String(s).replace(/\s/g, "").replace(",", "."));
  return s.trim() === "" || Number.isNaN(n) ? null : n;
};

/** A datetime-local value for an ISO date, in local time. */
export const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// ── Controls ────────────────────────────────────────────────

type Variant = "primary" | "ghost" | "quiet" | "danger";
const VARIANT: Record<Variant, string> = {
  primary: "bg-[var(--signal)] text-white hover:bg-[#1747c4] border border-transparent",
  ghost: "border border-[var(--line-control)] text-[var(--text-hi)] hover:bg-[var(--surface-2)]",
  quiet: "border border-transparent text-[var(--text-hi)] hover:bg-[var(--surface-2)]",
  danger: "border border-[var(--line-control)] text-[var(--danger)] hover:bg-[var(--danger-dim)]",
};

export function Button({
  variant = "ghost",
  size = "md",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        size === "sm" ? "h-9 px-3.5 text-[0.8125rem]" : "h-11 px-5 text-[0.875rem]"
      } ${VARIANT[variant]} ${className}`}
    />
  );
}

const control =
  "w-full rounded-[var(--radius-1)] border border-[var(--line-control)] bg-[var(--surface-1)] text-[var(--text-hi)] px-3.5 text-[0.9375rem] placeholder:text-[var(--text-low)]";

interface FieldBase {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  className?: string;
}

function Labelled({ id, label, hint, error, required, className = "", children }: FieldBase & { id: string; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[0.8125rem] font-medium text-[var(--text-hi)]">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="m-0 text-[0.75rem] text-[var(--text-low)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="m-0 text-[0.8125rem] text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string | null) =>
  [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;

export function Field({ label, hint, error, required, className, ...rest }: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Labelled id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
        className={`${control} h-11`}
      />
    </Labelled>
  );
}

export function TextArea({ label, hint, error, required, className, ...rest }: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Labelled id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        rows={4}
        {...rest}
        className={`${control} py-2.5 leading-relaxed`}
      />
    </Labelled>
  );
}

export function Select({
  label,
  hint,
  error,
  required,
  className,
  options,
  ...rest
}: FieldBase & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <Labelled id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select id={id} required={required} aria-describedby={describedBy(id, hint, error)} {...rest} className={`${control} h-11`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Labelled>
  );
}

export function Check({ label, className = "", ...rest }: { label: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <input id={id} type="checkbox" {...rest} className="w-[18px] h-[18px] accent-[var(--signal)]" />
      <label htmlFor={id} className="text-[0.875rem] text-[var(--text-hi)]">
        {label}
      </label>
    </div>
  );
}

/** A group of checkboxes with a visible legend. */
export function CheckGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <fieldset className="m-0 p-0 border-0 flex flex-col gap-2">
      <legend className="text-[0.8125rem] font-medium text-[var(--text-hi)] mb-1.5">{legend}</legend>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((o) => (
          <Check
            key={o.value}
            label={o.label}
            checked={value.includes(o.value)}
            onChange={(e) => onChange(e.target.checked ? [...value, o.value] : value.filter((v) => v !== o.value))}
          />
        ))}
      </div>
    </fieldset>
  );
}

// ── Layout ──────────────────────────────────────────────────

export function Card({ title, actions, children, className = "", as: Tag = "section" }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string; as?: "section" | "div" }) {
  const id = useId();
  return (
    <Tag aria-labelledby={title ? id : undefined} className={`rounded-[var(--radius-2)] border border-[var(--line)] bg-[var(--surface-1)] p-5 sm:p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {title && (
            <h2 id={id} className="m-0 text-[1rem] font-semibold text-[var(--text-hi)]">
              {title}
            </h2>
          )}
          {actions}
        </div>
      )}
      {children}
    </Tag>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="m-0 font-brand text-[var(--text-hi)] text-[1.75rem] sm:text-[2rem] leading-tight tracking-[-0.02em]">{title}</h1>
        {sub && <div className="mt-1.5 text-[0.875rem] text-[var(--text-mid)]">{sub}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Empty({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 py-6 text-[0.9375rem] text-[var(--text-mid)]">
      <p className="m-0">{children}</p>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "signal" | "good" | "warn" | "bad" }) {
  const tones = {
    neutral: "bg-[var(--surface-2)] text-[var(--text)]",
    signal: "bg-[var(--signal-dim)] text-[var(--signal-text)]",
    good: "bg-[var(--good-dim)] text-[var(--positive)]",
    warn: "bg-[var(--warn-dim)] text-[var(--warn)]",
    bad: "bg-[var(--danger-dim)] text-[var(--danger)]",
  };
  return <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[0.75rem] font-medium whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

export function Loading() {
  const { t } = useHub();
  return (
    <p role="status" className="m-0 py-10 text-[var(--text-mid)]">
      {t.loading}
    </p>
  );
}

export function LoadError({ retry }: { retry?: () => void }) {
  const { t } = useHub();
  return (
    <div role="alert" className="flex items-center gap-3 py-6 text-[var(--danger)]">
      {t.error}
      {retry && (
        <Button size="sm" onClick={retry}>
          ↻
        </Button>
      )}
    </div>
  );
}

/** A polite announcement for screen readers and a visible line for everyone. */
export function Status({ message, tone = "neutral" }: { message: string | null; tone?: "neutral" | "bad" }) {
  return (
    <p role={tone === "bad" ? "alert" : "status"} className={`m-0 min-h-[1.25rem] text-[0.875rem] ${tone === "bad" ? "text-[var(--danger)]" : "text-[var(--text-mid)]"}`}>
      {message ?? ""}
    </p>
  );
}

// ── Dialog ──────────────────────────────────────────────────

export function Dialog({
  open,
  title,
  onClose,
  children,
  wide = false,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const { t } = useHub();
  useModal(ref, open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/55" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className={`relative w-full ${wide ? "sm:max-w-3xl" : "sm:max-w-xl"} max-h-[92vh] overflow-y-auto rounded-t-[var(--radius-2)] sm:rounded-[var(--radius-2)] border border-[var(--line)] bg-[var(--surface-1)] p-5 sm:p-7 shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 id={id} className="m-0 font-brand text-[1.375rem] text-[var(--text-hi)]">
            {title}
          </h2>
          <Button variant="quiet" size="sm" onClick={onClose} aria-label={t.close}>
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Copy text, then say so. */
export function CopyButton({ text }: { text: string }) {
  const { t } = useHub();
  const [done, setDone] = useState(false);
  return (
    <Button
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* clipboard blocked: the text is on screen to select */
        }
      }}
    >
      <span aria-live="polite">{done ? t.agents.copied : t.agents.copy}</span>
    </Button>
  );
}
